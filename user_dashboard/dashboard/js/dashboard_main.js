// script for all page
$(function() {
    // load silde bar and top bar
    $("#accordionSidebar").load("../../common/sidebar.html");
    $("#topbar").load("../../common/topbar.html", setActiveAtSideBar);
});

// script for dashboard
function setActiveAtSideBar() {
    var navItems = document.getElementsByClassName('nav-item');
    for (var i = 0; i < navItems.length; i++) {
        var navItem = navItems[i];
        if (navItem.innerHTML.includes('dashboard/index.html')) {
            navItem.className += ' active';
            break;
        }
    }

    $.getScript('../../common/js/common.js');
}


// set default value for current user
function setUserData() {
    var userDto = UserRequest.getCurrentUser();
    // set value for Mã giới thiệu
    document.getElementsByClassName('btn btn-primary')[0].innerText =
        ' Mã giới thiệu: ' + userDto.username;
    document.getElementById('numOfCoin').innerHTML = userDto.accountBalance + ' xu';
    document.getElementById('numOfTime').innerHTML = userDto.numOfDefaultTime + ' phút';
    document.getElementById('numOfCoinGiftBox').innerHTML = userDto.numOfCoinGiftBox + ' hộp';
    document.getElementById('numOfTimeGiftBox').innerHTML = userDto.numOfTimeGiftBox + ' hộp';
    document.getElementById('numOfTravelledTime').innerHTML = userDto.numOfTravelledTime + ' phút';
    document.getElementById('numOfStar').innerHTML = userDto.numOfStar + ' sao';
}
setUserData();


function copyReferralCode() {
    window.prompt('Copy mã giới thiệu: ', connecter.getCookie('username'));
}

var timeOut = null;

function openCoinGiftBox() {
    resetStatusBox();
    var giftBox = GiftBoxRequest.openCoinGiftBox();
    document.getElementById('status').innerHTML = giftBox.message;
    document.getElementById('statusBox').style.cssText = "border-left:.25rem solid #f30425 !important;";
    document.getElementById('statusIcon').style.cssText = "color: blue;";

    document.getElementById('numOfCoinBox').style.cssText = "border-left:.25rem solid #f30425 !important;";
    document.getElementById('numOfCoinIcon').style.cssText = "color: orange;";

    document.getElementById('coinGiftBoxBox').style.cssText = 'border-left:.25rem solid #f30425 !important;';
    document.getElementById('coinGiftBoxIcon').style.cssText = "color: red;";

    setTimeoutStatusBox();
    userDto = UserRequest.getCurrentUser()
    setUserData();
}

function openTimeGiftBox() {
    resetStatusBox();
    var giftBox = GiftBoxRequest.openTimeGiftBox();
    document.getElementById('status').innerHTML = giftBox.message;
    document.getElementById('statusBox').style.cssText = "border-left:.25rem solid #f30425 !important;";
    document.getElementById('statusIcon').style.cssText = "color: blue;";

    document.getElementById('numOfTimeBox').style.cssText = "border-left:.25rem solid #f30425 !important;";
    document.getElementById('numOfTimeIcon').style.cssText = "color: green;";

    document.getElementById('timeGiftBoxBox').style.cssText = 'border-left:.25rem solid #f30425 !important;';
    document.getElementById('timeGiftBoxIcon').style.cssText = "color: green;";

    setTimeoutStatusBox();
    userDto = UserRequest.getCurrentUser()
    setUserData();
}

function setTimeoutStatusBox() {
    clearTimeout(timeOut);
    timeOut = setTimeout(function() {
        resetStatusBox();
    }, 2000);
}

function resetStatusBox() {
    document.getElementById('status').innerHTML = '';
    document.getElementById('statusBox').style.cssText = '';
    document.getElementById('statusIcon').style.cssText = "color: rgb(209, 209, 209);";

    document.getElementById('numOfCoinBox').style.cssText = '';
    document.getElementById('numOfCoinIcon').style.cssText = "color: rgb(209, 209, 209);";

    document.getElementById('numOfTimeBox').style.cssText = '';
    document.getElementById('numOfTimeIcon').style.cssText = "color: rgb(209, 209, 209);";

    document.getElementById('coinGiftBoxBox').style.cssText = '';
    document.getElementById('coinGiftBoxIcon').style.cssText = "color: rgb(209, 209, 209);";

    document.getElementById('timeGiftBoxBox').style.cssText = '';
    document.getElementById('timeGiftBoxIcon').style.cssText = "color: rgb(209, 209, 209);";
}

// load thông báo
function loadAnnouncement() {
    var announcementDtos = AnnouncementRequest.findAll();
    document.getElementsByClassName('announcement1')[1].innerHTML = '<div style="color:blue;">' + announcementDtos[announcementDtos.length - 1].title + '</div>';
    document.getElementsByClassName('announcement1')[2].innerText = announcementDtos[announcementDtos.length - 1].shortDescription;
    document.getElementsByClassName('announcement1')[3].href = '../announcement/post.html?id=' + announcementDtos[announcementDtos.length - 1].id;

    document.getElementsByClassName('announcement2')[1].innerHTML = '<div style="color:blue;">' + announcementDtos[announcementDtos.length - 2].title + '</div>';
    document.getElementsByClassName('announcement2')[2].innerText = announcementDtos[announcementDtos.length - 2].shortDescription;
    document.getElementsByClassName('announcement2')[3].href = '../announcement/post.html?id=' + announcementDtos[announcementDtos.length - 2].id;

    document.getElementsByClassName('announcement3')[1].innerHTML = '<div style="color:blue;">' + announcementDtos[announcementDtos.length - 3].title + '</div>';
    document.getElementsByClassName('announcement3')[2].innerText = announcementDtos[announcementDtos.length - 3].shortDescription;
    document.getElementsByClassName('announcement3')[3].href = '../announcement/post.html?id=' + announcementDtos[announcementDtos.length - 3].id;
    document.getElementsByClassName('announcement loading')[0].style.cssText = "display:none;";
    document.getElementsByClassName('announcement content')[0].style.cssText = "display:block;";
}
setTimeout(loadAnnouncement, 1000);

// load withdraw request
function loadWithdrawRequest() {
    var withdrawRequestDtos = WithdrawRequestRequest.findAllWithPagingAndSort(7, 0, '-id');
    var k = 0;
    for (var i = 0; i < withdrawRequestDtos.length; i++) {
        var withdrawRequest = document.getElementsByClassName('withdraw_request')[k];
        withdrawRequest.innerHTML = '<strong style="color:blue;">' + withdrawRequestDtos[i].username + '</strong> <br>' +
            "Đã rút " +
            '<strong style="color:red;">' + withdrawRequestDtos[i].amountOfMoney + '</strong>' +
            " VND qua " + withdrawRequestDtos[i].type + ".";
        k++;
        if (k == 7)
            break;
    }
    document.getElementsByClassName('withdraw_request_loading')[0].style.cssText = "display:none;";
    document.getElementsByClassName('withdraw_request_content')[0].style.cssText = "display:block;";
}
setTimeout(loadWithdrawRequest, 1000);


// function viewAdsOnMessageReceived(payload) {
//     setUserData();
//     sendStatus("ON_PAGE");
//     console.log(payload);

// }

// function listenFromServer() {
//     // connect to server and subcribe channel
//     var socket = new SockJS(connecter.baseUrlAPI + '/ws');
//     stompClient = Stomp.over(socket);
//     //stompClient.connect({}, onConnected, onError);
//     stompClient.connect({}, function () {
//         stompClient.subscribe('/channel/' + userDto.username, viewAdsOnMessageReceived);

//     }, function () {
//         alert("Có lỗi xảy ra.");
//     });
// }
// listenFromServer();

// function sendStatus(status) {
//     var messageSocketDto = {
//         receiver: "server",
//         type: status,
//         content: JSON.stringify({
//             username: userDto.username
//         })
//     }
//     stompClient.send("/send-fb-status", {}, JSON.stringify(messageSocketDto));
// }


