var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
var missionDto = MissionRequest.findOne(id);

// script for all page
$(function () {
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

}

function main() {
    setActiveAtSideBar();
    getPost();
}

$("#do-mission").click(function () {
    connecter.setCookie('missionId', id, 1);

    if (missionDto.type == 'CAPCHA')
        location.href = 'http://olalink.co/yDl91E';
    else
        location.href = 'do-mission.html';
});

function view_ads() {
    let url = 'https://www.google.com/';
    window_tab = window.open(url);
    $(this).fadeOut()

    if (typeof window_tab == 'undefined' || window_tab == null) {
        alert('Error Looks like windows doesnt open at your device. Please reload this page.')
    }
    else if (window_tab.closed === false) {
        var interval = setInterval(function () {
            if (window_tab.closed === true) {
                document.title = 'You have closed the tab!';
                clearInterval(interval);
            } else if (time_counter > 0) {
                // 
            } else if (time_counter === 0) {
                clearInterval(interval)
                // $.ajax({
                    
                // });
            }
        }, 1000);
    }
};