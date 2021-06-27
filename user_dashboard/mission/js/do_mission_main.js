function doMission() {
    // get mission id 
    var missionId = connecter.getCookie('missionId');
    var missionDto = MissionRequest.findOne(missionId);
    if (missionDto.httpStatus == 'OK' && missionDto.type == 'CAPCHA' && document.referrer != 'http://olalink.co/') {
        alert('Thực hiện nhiệm vụ không thành công.');
        location.href = 'index.html';
        return;
    }

    missionDto = MissionRequest.doMission(missionId);
    alert(missionDto.message);
    location.href = 'index.html';
}


function main() {
    doMission();
}
main();