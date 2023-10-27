let timeoutIntervalId;
let currentPlayerId;

//add screen ids which will not load attendant welcome screen
function shouldLoadAttendantContent() {
  //check attendant card still card in
  if (currentPlayerId !== "-2") return false;
  const rst = !["0x4B", "0x4C", "0x13", "0x40"].includes(Banner.state.screenId);
  console.log("should load attendant content: ", rst);
  return rst;
}

function clearDelayCheck(){
  if(timeoutIntervalId){
      clearTimeout(timeoutIntervalId);
      timeoutIntervalId = null;
  }
}

Banner.mapToken("0x45", "playerId");
Banner.watch("ext.playerId", function(playerId){
  currentPlayerId = playerId;
  console.log("get player Id", playerId);
	if (shouldLoadAttendantContent()) {
		clearDelayCheck()
		timeoutIntervalId = setTimeout(function () {
			clearDelayCheck();
			if (shouldLoadAttendantContent()) {
        const attendantScreenURL = Banner.state.urlMaps.screenIdMap["ATTENDANT_WELCOME_SCREEN"];
				console.log(`Attendant PlayerID detected during screen ${Banner.state.screenId}. Start loading attendant welcome screen at ${window.location.origin}/${attendantScreenURL}`);
				IGTMediaElements.loadContent(`${window.location.origin}/${attendantScreenURL}`);
			}
    }, 5000);
  }
})


