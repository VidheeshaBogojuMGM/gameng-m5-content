var animationHasBeenPlayed = false;
const propertyinfo = window['com.igt.property_info']("#app", {
  computed:{
    originalSize(){
      return {width : 840, height: 840}
    }
  },
  getters: {
    shouldShowBannerInFullscreen(state) {
      //during customization, it can return false for NV, or true for other casinos.
      return new Promise(function(resolve, reject){
        setTimeout(()=>{
          resolve(state.appConfig.NevadaRegulation);
        }, 1000)
    })}
  },
});
propertyinfo.watch("isProcessing", value=>{
  if (!value && !animationHasBeenPlayed){
    animationHasBeenPlayed = true;
    TweenMax.staggerFrom(".container>*", 0.5, { scale: 0, ease: Back.easeOut, alpha: 0 }, 0.2);
  }
})
$('#close-map').click(function () {
  if(propertyinfo.state.appConfig.NevadaRegulation){
    IGTMediaElements.hideFullScreen().then((fs)=>{trace("hide fs returned, game unlocked.")});
  }
  propertyinfo.navigate('idle_screen.html');
});

setTimeout(()=>{
  if(propertyinfo.getters.displayName != "TFT"){
    propertyinfo.state.preferredDisplayType = "fullscreen";
  }
},300)

propertyinfo.onStart(() => {
  propertyinfo.vm.updateGlobalState({shouldClaimBonus:false});
});