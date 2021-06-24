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

function getPostCheckIn() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var missionDto = MissionRequest.findOne(id);
    document.getElementById('mission-title').innerText = missionDto.name;
    document.getElementById('mission-content').innerText = missionDto.description;
    document.getElementById('mission-num-of-star').innerText = missionDto.numOfStar;
}

function main() {
    setActiveAtSideBar();
    getPostCheckIn();
}

$("#do-check-in").click(function() {
    var userDto = UserRequest.checkIn();
    if (userDto.httpStatus == 'OK') {
        alert(userDto.message);
        location.href = "index.html";
    }
});