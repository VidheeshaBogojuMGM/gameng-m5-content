var isServiceOn = false;
function callAttendant() {
	if (!isServiceOn) {
		IGTMediaElements.hostEventButtonPress(0, 2, false, 34);
	}
	isServiceOn = !isServiceOn;
	return isServiceOn;
}

function toggleBtn(_isServiceOn){
	if (_isServiceOn) {
		$('.call-attendant').addClass('active');
	}
	else {
		$('.call-attendant').removeClass('active');
	}
}
function handleOnCall() {
	if (window.top.document.getElementById('BannerFrame').contentWindow.callAttendant) {
		var _isServiceOn = window.top.document.getElementById('BannerFrame').contentWindow.callAttendant();
		toggleBtn(_isServiceOn);
	}
}
function onLoad(){
	if(window.top.document.getElementById('BannerFrame').contentWindow) {
		var _isServiceOn = window.top.document.getElementById('BannerFrame').contentWindow.isServiceOn;
		toggleBtn(_isServiceOn);
	}
}
onLoad();
setTimeout(function(){
	onLoad();
},1000);
