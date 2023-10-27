let currentScreenId = "";
let timeoutIntervalId;
let isVertical, attendantScreenURL;

function shouldLoadAttendantContent() {
    let rst = !["0x4b", "0x4c", "0x13", "0x40"].includes(currentScreenId);
    console.log("should load attendant content: ", rst);
    return rst;
}

function clearDelayCheck(){
    if(timeoutIntervalId){
        clearTimeout(timeoutIntervalId);
        delete timeoutIntervalId
    }
}

IGTMediaElements.urlparams.getUrlParams().then(({ contentWidth, contentHeight }) => {
	isVertical = Number(contentWidth) < Number(contentHeight);
	attendantScreenURL = isVertical ? "system/attendantWelcome.html" : "system/attendantWelcomeHoriz.html"
});
IGTMediaElements.subscribeAllScreenTriggers(function (screenTrgger) {
	currentScreenId = screenTrgger.screenId.toLowerCase();
});

IGTMediaElements.subscribeToken("0x45", function (playerId) {
	console.log("get player Id", playerId);
	if (playerId === "-2") {
		if (shouldLoadAttendantContent()) {
			clearDelayCheck()
			timeoutIntervalId = setTimeout(function () {
				clearDelayCheck();
				if (shouldLoadAttendantContent()) {
                    console.log(`Attendant PlayerID detected during screen ${currentScreenId}. Start loading attendant welcome screen at ${window.location.origin}/${attendantScreenURL}`);
					IGTMediaElements.loadContent(`${window.location.origin}/${attendantScreenURL}`);
				}
			}, 5000);
		}
	}
})