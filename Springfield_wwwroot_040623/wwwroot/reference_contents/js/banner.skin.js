
const BannerMessageComp = {
	template: `
	<div id="banner-message-wrapper" style="display: flex; flex-grow: 1; margin-left: 10vh; margin-top: 20vh">
	<img style="height: 67vh;" src="./assets/banner-message-left.png"></img>
	<div style="position: relative;overflow: hidden; background-repeat: repeat round;background-size: cover; height: 67vh; background-image: url(./assets/banner-message-bg.png); flex-grow: 1;">
		<h2 id='banner-message' style="white-space: nowrap; position:absolute;z-index:2;font-size: 40vh; font-weight: 400; left: 10px; color: white; top: -15vh;"><slot></slot></h2>
	</div>
	</div>`
}
// // import model
const Banner = window['com.igt.banner']("#app", {
	computed:{
		openClose(){
			return this.$store.state.serviceWindowOpen?"CLOSE":"OPEN";
		},
		shouldShowBannerMessage() {
			if(this.appConfig.NevadaRegulation && this.isFullScreen){
				return false;
			}
			return this.shouldShowBannerDisplayMessage && this.screenId.toLowerCase() !== "0x4b";
		},
		lastGameWinDisplay(){
			if(this.LastGameWinAmount == null) return this.currencySymbol + 0.00;
			if(isNaN(this.egmDenom) || this.egmDenom == null) return "Unsupported";
			return this.currencySymbol+ (this.LastGameWinAmount * this.egmDenom /100).toFixed(2);
		}
  },
  methods:{
    toggleServiceWindow(){
      this.$store.dispatch("toggleServiceWindow");
    },
    refreshServiceWindowOpenCloseState(){
      this.$store.dispatch("toggleServiceWindow", true);
    }
  },
	components: {
		"banner-message": BannerMessageComp
	}
});
// watch any model changes

let tween;
function checkScroll(){

  let mw = $('#banner-message').width()
  let cw = $('#banner-message-wrapper').width();
  console.log(mw, cw);
	if( mw > cw ){
    tween = anime({
      targets: document.querySelector('#banner-message'),
      translateX:[0, -mw ],
      duration: (mw + cw)  * 10,
      easing: "linear",
      loop: true,
      delay: 2000
  })
	}else{
    anime.remove(document.querySelector('#banner-message'))
    $('#banner-message').css({'transform':'translateX(0)'});
	}
}

Banner.state.screenTrggiersThatShouldInitiallyHideDisplayMessage.push("0x20", "0x21", "0x68", "0x69", "0x6A", "0x6B", "0x6C", "0x6D", "0x6E", "0x6F");
Banner.onStart(() => {

	Banner.watch(() => [Banner.vm.displayMessage, Banner.vm.contentWidth], function (newValue) {
    setTimeout(checkScroll,0);
	});


});
checkScroll();

// setTimeout((d)=>{
// 	IGTMediaElements.urlparams.getUrlParams().then((params) => {
// 		trace(JSON.stringify(params));
// 		trace("widht, bannerHeight: ", params.contentWidth, "x", params.bannerHeight);
// 	  });
// }, 4000);

function exitFullScree(){
	trace("current fullscreen state: " + Banner.state.isFullScreen + ". ShouldClaim: " + Banner.state.shouldClaimBonus);
	if(Banner.state.isFullScreen){
		IGTMediaElements.hideFullScreen().then((fs)=>{trace("hide fs returned")});
		if(Banner.state.shouldClaimBonus){
			Banner.vm.updateGlobalState({isClaimed: true});//notify fullscreen pages like CLC: you needn't claim again.
			IGTMediaElements.util.log.debug("banner content udpate global state isClaimed to true. ");
			setTimeout(()=>{IGTMediaElements.buttonPress('BONUSBUTTON');},2000);
		}
	}
}
