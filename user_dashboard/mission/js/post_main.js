var urlParams = new URLSearchParams(window.location.search);
var missionId = urlParams.get('id');
var missionDto = MissionRequest.findOne(missionId);

// script for all page
$(function() {
    // load silde bar and top bar
    $("#accordionSidebar").load("../../common/sidebar.html");
    $("#topbar").load("../../common/topbar.html", main);
});

// script for check in
function setActiveAtSideBar() {
    var navItems = document.getElementsByClassName('nav-item');
    for (var i = 0; i < navItems.length; i++) {
        var navItem = navItems[i];
        if (navItem.innerHTML.includes('mission/index.html')) {
            navItem.className += ' active';
            break;
        }
    }

    $.getScript('../../common/js/common.js');
}

function getPost() {
    document.getElementById('mission-title').innerText = missionDto.name;
    document.getElementById('mission-content').innerHTML = missionDto.description;
    if (missionDto.numOfStar != 0) {
        document.getElementById('mission-num-of-star-div').style.cssText += "display: block;";
        document.getElementById('mission-num-of-star').innerText = missionDto.numOfStar;
    }
    if (missionDto.numOfCoinGiftBox != 0) {
        document.getElementById('mission-num-of-coin-gift-box-div').style.cssText += "display: block;";
        document.getElementById('mission-num-of-coin-gift-box').innerText = missionDto.numOfCoinGiftBox;
    }
    if (missionDto.numOfTimeGiftBox != 0) {
        document.getElementById('mission-num-of-time-gift-box-div').style.cssText += "display: block;";
        document.getElementById('mission-num-of-time-gift-box').innerText = missionDto.numOfTimeGiftBox;
    }

    if (missionDto.type == 'DIEMDANH')
        document.getElementById('do-mission').innerText = 'Thực hiện điểm danh';
    else if (missionDto.type == 'CAPCHA')
        document.getElementById('do-mission').innerText = 'Xác nhận capcha';
    else if (missionDto.type == 'VIEW-ADS') {
        document.getElementById('do-mission').innerHTML = document.getElementById('do-mission').innerHTML.replace('Thực hiện', 'Xem trang');
        document.getElementById('mission-content').innerHTML += '<br> Thời gian: <strong>' + missionDto.time + ' giây.</strong>';
        $('#do-mission').prop('disabled', true);
        $('#loading-gif').attr('style', 'display:block;');
        var interval = setInterval(function() {
            if (serverConnected) {
                stompClient.subscribe('/channel/' + userDto.username + '/view_ads', viewAdsOnMessageReceived);
                $('#do-mission').prop('disabled', false);
                $('#loading-gif').attr('style', 'display:none;');
                clearInterval(interval);
            }
        }, 500);
    }

}

function main() {
    setActiveAtSideBar();
    getPost();
}

$("#do-mission").click(function() {
    connecter.setCookie('missionId', missionId, 5);

    if (missionDto.type == 'CAPCHA')
        location.href = 'http://olalink.co/yDl91E';
    else if (missionDto.type == 'DIEMDANH')
        location.href = 'do-mission.html';
    else if (missionDto.type == 'VIEW-ADS')
        view_ads();
});

var window_tab = null;
var missionSucceeded = false;

function view_ads() {
    if (!missionSucceeded) {
        // connect to server and subcribe channel
        $('#do-mission').prop('disabled', true);
        var messageSocketDto = {
            token: connecter.getCookie("tokenCode"),
            receiver: "server",
            type: "NOTIFICATION",
            content: JSON.stringify({
                id: Number(missionId),
                time: missionDto.time
            })
        }
        stompClient.send("/view_ads", {}, JSON.stringify(messageSocketDto));

        // open tab
        let url = $('#ads-link').val();
        window_tab = window.open(url);
    }

};


function viewAdsOnMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    if (typeof window_tab == 'undefined' || window_tab == null || window_tab.closed === true) {
        var messageSocketDto = {
            token: connecter.getCookie("tokenCode"),
            receiver: "server",
            type: "EXCEPTION"
        }
        stompClient.send("/view_ads", {}, JSON.stringify(messageSocketDto));
        alert('Bạn đã đóng tab hoặc trình duyệt này không được hỗ trợ. Hãy tải lại trang và thử lại.');
        //stompClient.disconnect();
        //location.reload();
    } else if (window_tab.closed === false) {
        if (message.type == "TIME_COUNT") {
            //document.getElementById('mission-content').innerHTML += '<strong style="color:red;">Thời gian còn lại: '+ JSON.parse(message.content).time +'</strong>';
            $('#do-mission').html('<strong style="color:red;">Thời gian còn lại: ' + (Number(missionDto.time) - Number(JSON.parse(message.content).time)) + '</strong>');
            document.title = "Thời gian còn lại: " + (Number(missionDto.time) - Number(JSON.parse(message.content).time));
        } else if (message.type == "NOTIFICATION") {
            document.title = JSON.parse(message.content).message;
            if (JSON.parse(message.content).message.includes('hoàn thành')) {
                missionSucceeded = true;
                window.onfocus = function() {
                    location.href = "do-mission.html";
                }
                $('#do-mission').prop('disabled', false);
                $('#do-mission').text('Xác nhận hoàn thành nhiệm vụ.');
                $("#do-mission").click(function() {
                    location.href = "do-mission.html";
                });

            }

        }

    }

}

function alert(content) {
    $('#announcement-content').html(content);
    $('#announcement').modal('show');
}

function closeAnnouncement() {
    $('#announcement').modal('hide');
}