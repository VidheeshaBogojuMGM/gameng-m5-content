const Bonus = window['com.igt.Bonus']("#app", {
  data() {
    return {
      isAttendantBtnEnabled: false,
      isExecuted: false
    }
  },
  state: {
    isClaimed: false
  },
  mounted() {
    // NOTE: use following statement to enable fullscreen once getting bonus award
    if(this.displayName != "TFT"){
      this.$store.state.preferredDisplayType = 'fullscreen'
    }
  },
  methods: {
    claimBonus() {
      setTimeout(function(){
        IGTMediaElements.buttonPress('BONUSBUTTON');
      }, 3000);
      if(this.displayName != "TFT"){

        //in case MBE2 hard reset and ADV won't send fullscreen to M5. Add this code to unlock EGM in order to claim bonus
        if(!this.$store.state.isFullScreen){
          IGTMediaElements.hideFullScreen();
        }
        
        this.$store.state.preferredDisplayType = 'normal'
      }
        // this.updateGlobalState({shouldShowBannerDisplayMessage: true});
        this.updateGlobalState({shouldShowBannerDisplayMessage: true, displayMessage: `${this.displayMessage}. What a pleasure!!`});
        this.updateGlobalState({shouldClaimBonus: false});
        this.updateGlobalState({isClaimed: true});
    },
    onAttendant(){
      this.isAttendantBtnEnabled = true;
      this.$store.state.displayMessage = "Welcome attendant";
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
  computed: {
    smallHoriz() {
      return this.contentWidth / this.contentHeight < 4.5 && this.contentWidth > this.contentHeight && !this.fullscreen;
    },
    originalSize() {
      if (this.isFullScreen) {
        return {
          width: 720,
          height: 450
        };
      } else if (this.isVertical) {
        return {
          width: 256,
          height: 956
        };
      } else {
        return {
          width: 960,
          height: 224
        };
      }
    },
    cusomizedDisplayMessage() {
      let style = "";
      if (this.$store.state.WinAmountDollars && this.isVertical ) {
        let fontsize = "30px";
        if (this.$store.state.WinAmountDollars.length <= 8)
          fontsize = "50px";
        else if (this.$store.state.WinAmountDollars.length <= 10)
          fontsize = "40px";
        else if (this.$store.state.WinAmountDollars.length <= 11)
          fontsize = "35px";

        style = `style="font-size: ${fontsize}"`;
      }

      return `<p>YOU HAVE WON</p><p ${style}>${this.$store.state.WinAmountDollars}</p><p>CREDITS</p>`;
    }
  },
  watch: {
    isFullScreen(newVal, oldVal) {
      if (newVal) {
        this.resize = 'auto scale fill';

        if(!this.isExecuted) {
          $(".infoarea").hide();
          $("#claimBtn").hide();
          var promise = $("video")[0].play();
          // code to deal with autoplay policy changes
          if (promise !== undefined) {
            promise.then(() => {}).catch(() => {
              $(".infoarea").show();
              $("#claimBtn").show();
              $("#app").prepend('<p id="tm" style="z-index:1;font-size:0.5rem;text-transform:uppercase;position:absolute;top:10rem;width:100%;margin-left:-10px;">play video</p>');
              $("body")[0].addEventListener("click", function () {
                $("#tm").remove();
                $("video")[0].play();
              });
            });
          }
          this.isExecuted = true;
        }
      } else {
        if(oldVal == true && this.appConfig.NevadaRegulation){
          IGTMediaElements.hideFullScreen();
        }
        this.resize = "preset-2";
      }
    }
  },
});

let delayedShow = false
$("video")[0].addEventListener("timeupdate", function (e) {
  if (e.timeStamp > 3000 && !delayedShow) {
    $(".infoarea").fadeIn();
    $("#claimBtn").fadeIn();
    delayedShow = true;
  }
})

Bonus.onStart(() => {
  Bonus.vm.updateGlobalState({shouldClaimBonus:true});
  Bonus.vm.updateGlobalState({isClaimed:false})
  trace("main win updated isClaim to false " + Bonus.state.isClaimed);
});