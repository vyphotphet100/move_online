function doMission() {
    // get mission id 
    var missionId = connecter.getCookie('missionId');
    var missionDto = MissionRequest.findOne(missionId);
    if (missionDto.httpStatus == 'OK' &&
        missionDto.type == 'CAPCHA' &&
        document.referrer != 'http://olalink.co/') {

        alert('Bạn chưa xác nhận capcha.');
        location.href = 'index.html';
        return;
    }

    if (missionDto.type != 'CAPCHA' &&
        document.referrer.includes(connecter.baseUrl)) {
        alert('Có lỗi xảy ra.');
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