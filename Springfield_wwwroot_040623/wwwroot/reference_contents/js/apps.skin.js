const Apps = window['com.igt.Apps']("#app", {
  computed: {
    isHorizontal() {
      return parseInt(this.$store.state.urlparams.contentWidth) > parseInt(this.$store.state.urlparams.contentHeight);
    },
    displayedApps() {
      try{
        let result = this.apps;
        let removeMarkerTrax = false;
        
        if (!this.$store.state.isCashlessAvailable) {
          const idx =  this.apps.findIndex(app =>
            app.url.indexOf('cashless.html') > -1
          );
          result.splice(idx, 1);
        }
        
        if(!this.appConfig.markerTraxOptions.alwaysShowMarkerTraxButton)
        {
          if(this.appConfig.markerTraxOptions.onlyAllowCardlessMarkerTrax){
            if(!this.$store.state.isCashlessAvailable && !this.$store.state.isCardlessAvailable) removeMarkerTrax = true;
          }
          else{
            if(!this.$store.state.isCashlessAvailable) removeMarkerTrax = true;
          }
        }

        if(removeMarkerTrax){
          const idx =  this.apps.findIndex(app => app.url.indexOf('markertrax.html') > -1 );
          result.splice(idx, 1);
        }
      return result;
        }
      catch(e){
        console.log("appsConfig object is not ready yet. "+e);
      }
    }
  },
  methods: {
    buttonClickHandler(url) {
      if (url.indexOf('cashless.html') > -1) {
        this.navigateToCashless();
      } else if (url.indexOf('markertrax.html') > -1) {
        this.navigateToMarkerTrax();
      } else {
        navigate(url);
      }
    },
    navigateToCashless() {
      if (this.appConfig.NevadaRegulation || this.appConfig.NVCashless) {
        this.$root.$refs.mo.confirm(
          `[Licensee’s name]\n encourages you to gamble responsibly. For problem gambling information and assistance, call the 24-hour confidential Problem Gamblers HelpLine at 1- 800-522-4700, or visit www.WhenTheFunStops.org.`,
          ["YES", "NO"])
          .then(msg => {
            if (msg == "YES") {
              this.navigate('cashless.html');
            }
          });

      } else {
        this.navigate('cashless.html');
      }
    },
    navigateToMarkerTrax() {
      this.navigate('markertrax.html');
    }
  }
});
Apps.press("#back", () => {
  navigate("SESSION_SCREEN");
})

window.apps = Apps;
// trace(Apps.state.urlparams.contentWidth)
