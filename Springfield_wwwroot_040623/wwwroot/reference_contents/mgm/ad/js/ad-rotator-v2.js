var AdRotatorV2 = function() { };

AdRotatorV2.fetchAppboxAds = function(channelOpts, machineNumber, appboxServer) {
		var player;
		if (channelOpts) {
			player = new AppboxPlayer({
				id: machineNumber,
				channels: channelOpts
			});
		}
		else {
			player = new AppboxPlayer({
				id: machineNumber,
				channels: { 'channel-main': 'main' }
			});
		}
		player.connect(appboxServer);
		//console.log("fetchAppboxAds try: "+try);
		appboxIsAlreadyRunning = true;
}

AdRotatorV2.fetchIGTAds = function(containerId, adsId) {
	var lang = Resources.language();
	if (lang.length > 2)
		lang = lang.substring(0, 2);

	//var context = PropertyInfo.getActiveNodeContent();
	var adUriId = adsId || "ads";
	var playlist = `${adUriId}_${lang}_${window.innerWidth}x${window.innerHeight}`;
	console.log(`${containerId} ad: ` + playlist);

	var currentPlaylist = "";

	if (currentPlaylist != playlist) {
		var server = serviceConfigs.adServer || (location.protocol + '//' + location.host);
		document.getElementById(`${containerId}_ads`).src = server + '/ad-service/client/?name=' + playlist;
		currentPlaylist = playlist;
		console.log(`${containerId} ad server: ` + server);
	}
}

AdRotatorV2.checkAdsRotator = function(containerId, adsId, serviceConfigAdImagesKey, imageFiles) {
	var iframeId = `#${containerId}_ads`;
	var adsRotatorWrapperId = `#${containerId}_orion_ads_rotator_wrapper`;
	var adsRotatorId = `#${containerId}_orion_ads_rotator`;
	var adsNextBtnId = `#${containerId}_next_ads`;
	var adsPrevBtnId = `#${containerId}_prev_ads`;

	if (!serviceConfigs.enableIGTAdService) {
		$(iframeId).hide();
		$(adsRotatorWrapperId).show();

		if ($(adsRotatorId).hasClass('slick-initialized')) {
			$(adsRotatorId).slick('unslick');

			$(adsPrevBtnId).show();
			$(adsNextBtnId).show();
			AdRotatorV2.renderRotatorImages(containerId, serviceConfigAdImagesKey, imageFiles);
		} else {

			$(adsPrevBtnId).show();
			$(adsNextBtnId).show();
			AdRotatorV2.renderRotatorImages(containerId, serviceConfigAdImagesKey, imageFiles);
		}
	} else {
		$(iframeId).show();
		$(adsRotatorWrapperId).hide();
		AdRotatorV2.fetchIGTAds(containerId, adsId);
		$(adsPrevBtnId).hide();
		$(adsNextBtnId).hide();
	}
}

AdRotatorV2.renderRotatorImagesRetryTimeout = 0;

AdRotatorV2.renderRotatorImages = function(containerId, imageFiles, carouselInterval, autoplay) {
	var adsRotatorId = `#${containerId}`;
	var adsNextBtnId = `#${containerId}_next_ads`;
	var adsPrevBtnId = `#${containerId}_prev_ads`;

	//var lang = Resources.language();

	//clearTimeout(AdRotatorV2.renderRotatorImagesRetryTimeout);

	// if (lang.length > 2) {
	// 	lang = lang.substring(0, 2);
	// }
	var noAds = '<div class="no-ads-available"><div>No Ads Available</div></div>';
	$(adsRotatorId).html("");

	// if (serviceConfigs.rotatorImages == null) {
	// 	console.log('Rotator images is null');
	// 	$(adsRotatorId).html(noAds);
	// 	$(adsPrevBtnId).hide();
	// 	$(adsNextBtnId).hide();

	// 	AdRotatorV2.renderRotatorImagesRetryTimeout = setTimeout(AdRotatorV2.renderRotatorImages, 1000);
	// 	return;
	// }

	var carouselTimer =  carouselInterval || 5000;

	//var u3ImageWidth = serviceConfigs.rotatorImages[serviceConfigAdImagesKey].u3.width;
	//var u3ImageHeight = serviceConfigs.rotatorImages[serviceConfigAdImagesKey].u3.height;

	//var tftImageWidth = serviceConfigs.rotatorImages[serviceConfigAdImagesKey].tft.width;
	//var tftImageHeight = serviceConfigs.rotatorImages[serviceConfigAdImagesKey].tft.height;

	var imgWidth = '100%';
	var imgHeight = '100vh';
	// if (serviceConfigs.orientation == 'vertical') {
	// 	imgWidth = u3ImageWidth || '100%';
	// 	imgHeight = u3ImageHeight || '100%';
	// } else {
	// 	imgWidth = tftImageWidth || '100%';
	// 	imgHeight = tftImageHeight || '100%'
	// }

	imageSize = `style="width: ${imgWidth}; height: ${imgHeight};"`

	$(adsRotatorId).empty();

	//console.log("imageFiles: " + JSON.stringify(imageFiles));

	if (imageFiles != null && imageFiles.length != 0) {
		for (var f = 0; f < imageFiles.length; f++) {
			var content = "";
			content += '<img src="' + imageFiles[f] + '" ' + imageSize + ' />';
			$(adsRotatorId).append(content);
		}
		console.log('passed me');
		console.log($('#adsRotatorId'))
		$(adsRotatorId).not('.slick-initialized').slick({
			dots: false,
			infinite: true,
			autoplay: autoplay,
			autoplaySpeed: carouselTimer,
			speed: 300,
			slidesToScroll: 1,
			arrows: false,
			prevArrow: false,
			nextArrow: false
		});
	} else {
		$(adsRotatorId).html(noAds);
		$(adsPrevBtnId).hide();
		$(adsNextBtnId).hide();
	}
}
