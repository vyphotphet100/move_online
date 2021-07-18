$(function() {

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });
});

function messageReceived(payload) {
    sendStatus("ON_PAGE");

    var receivedMessage = JSON.parse(payload.body);
    console.log(receivedMessage.content);

    if (receivedMessage.type == 'FB_ACTIVE') {
        if (window.location.href.includes('/dashboard/index.html')) {
            $('#status').html('Bạn đang Online. Bạn sẽ nhận được <strong>Hộp quà xu</strong> trong thời gian Online của mình.');
            $('#numOfTraversedTimeIcon-old').attr('style', 'display:none;');
            $('#numOfTraversedTimeIcon-new').attr('style', 'display:block;');
            $('#coinGiftBoxIcon-old').attr('style', 'display:none;');
            $('#coinGiftBoxIcon-new').attr('style', 'display:block;');
        }
        connecter.setCookie('fbStatus', 'active', 3);
    } else if (receivedMessage.type == 'FB_INACTIVE') {
        if (window.location.href.includes('/dashboard/index.html')) {
            $('#status').html('Bạn đang Offline.');
            $('#numOfTraversedTimeIcon-old').attr('style', 'display:block;');
            $('#numOfTraversedTimeIcon-new').attr('style', 'display:none;');
            //$('#numOfTraversedTimeIcon').html('<i class="fas fa-hourglass-end fa-2x text-300"></i>');
            $('#coinGiftBoxIcon-old').attr('style', 'display:block;');
            $('#coinGiftBoxIcon-new').attr('style', 'display:none;');
            //$('#coinGiftBoxIcon').html('<i class="fas fa-gift fa-2x text-300"></i>');

        }
        connecter.setCookie('fbStatus', 'inactive', 2);
    } else if (receivedMessage.type == 'INCREASE_MINUTE') {
        if (window.location.href.includes('/dashboard/index.html')) {
            setUserData();
            $('#status').html('Bạn đang Online. Bạn sẽ nhận được <strong>Hộp quà xu</strong> trong thời gian Online của mình.');
            $('#numOfTraversedTimeIcon-old').attr('style', 'display:none;');
            $('#numOfTraversedTimeIcon-new').attr('style', 'display:block;');
            $('#coinGiftBoxIcon-old').attr('style', 'display:none;');
            $('#coinGiftBoxIcon-new').attr('style', 'display:block;');
            //$('#numOfTraversedTimeIcon').html('<img src="image/Hourglass_902x.gif" style="width: 40px; height: 40px;"/>');
            //$('#coinGiftBoxIcon').html('<img src="image/wait-coin-gift-box.gif" style="width: 40px; height: 40px;"/>');
        }
        connecter.setCookie('fbStatus', 'active', 3);
    } else if (receivedMessage.type == 'INCREASE_COIN_GIFT_BOX') {
        if (window.location.href.includes('/dashboard/index.html')) {
            setUserData();
            $('#status').html('Bạn đã nhận được 1 hộp quà xu.');
            setTimeoutStatusBox();
        }
        connecter.setCookie('fbStatus', 'active', 3);
    }


}

function createWSUrl(url, port) {
    var baseUrl = location.href;
    baseUrl = baseUrl.replace('http', 'ws');
    var _countSlash = 0;
    var newBaseUrl = '';
    for (var i = 0; i < baseUrl.length; i++) {
        if (baseUrl[i] == '/')
            _countSlash++;

        if (_countSlash != 3)
            newBaseUrl += baseUrl[i];
        else
            break;
    }

    if (port == null)
        port = 80;

    return newBaseUrl + ':' + port + url;
}

var serverConnected = false;

function listenFromServer() {
    // connect to server and subcribe channel
    var url = createWSUrl('/ws', 8083);
    stompClient = Stomp.client(url);
    //stompClient.connect({}, onConnected, onError);
    stompClient.connect({}, function() {
        stompClient.subscribe('/channel/' + userDto.username, messageReceived);
        serverConnected = true;
        if (location.href.includes('/dashboard/index.html') &&
            connecter.getCookie('fbStatus') != 'active' &&
            userDto.facebookLink != null && userDto.facebookLink != '') {
            $('#status').html('Sẵn sàng làm việc.<br><button class="form-control" onclick="start();">Bắt đầu phiên làm việc</button><br><a href="../help/start-working-session.html"><strong>Hướng dẫn xác nhận bắt đầu phiên làm việc</strong></a>.');
        }

    }, function() {
        alert("Có lỗi xảy ra hoặc bạn không còn Online nữa. Hãy tải lại trang.");
        //listenFromServer();
    });
}
listenFromServer();

function sendStatus(status) {
    var messageSocketDto = {
        receiver: "server",
        type: status,
        content: JSON.stringify({
            username: userDto.username
        })
    }
    stompClient.send("/send-fb-status", {}, JSON.stringify(messageSocketDto));
}

function logout() {
    connecter.setCookie('username', null, 1);
    connecter.setCookie('tokenCode', null, 1);
    connecter.setCookie('fbStatus', null, 1);
    if (serverConnected)
        sendStatus('FB_INACTIVE');
    var userDto = UserRequest.logout();
    if (userDto.httpStatus == "OK")
        location.href = '../../login/index.html';
}