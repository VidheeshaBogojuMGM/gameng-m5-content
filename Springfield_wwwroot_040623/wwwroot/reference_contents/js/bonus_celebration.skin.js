let guardTimoutId;
const Bonus = window['com.igt.Bonus']("#app", {
  data() {
    return {
      isAttendantBtnEnabled: false,
      autoAcknowledgeTime: 10, //seconds
      isExecuted: false
    }
  },
  state: {
    isClaimed: false
  },
  mounted() {
    // NOTE: use following statement to enable fullscreen once getting bonus award
    if (this.displayName != "TFT"){
      this.$store.state.preferredDisplayType = 'fullscreen';
    }

    setTimeout(() => {
      this.claimBonus();
      $("#tm").remove();
    }, this.autoAcknowledgeTime * 1000);
  },
  methods: {
    claimBonus() {
      let self = this;
      if (this.displayName != "TFT"){

        //in case MBE2 hard reset and ADV won't send fullscreen to M5. Add this code to unlock EGM in order to claim bonus
        if(!this.$store.state.isFullScreen){
          IGTMediaElements.hideFullScreen();
        }

        this.$store.state.preferredDisplayType = 'normal'
      }
      if (!this.$store.state.isClaimed) {
        this.$store.state.isClaimed = true;
        this.updateGlobalState({ isClaimed: true });
        this.updateGlobalState({ shouldShowBannerDisplayMessage: true });
        setTimeout(function () {
          IGTMediaElements.buttonPress('BONUSBUTTON');
        }, 3000)
        if(guardTimoutId){
          clearTimeout(guardTimoutId);
          guardTimoutId = undefined;
        }
        guardTimoutId = setTimeout(function () {
          self.$store.state.screenTrigger = Object.assign({}, self.$store.state.screenTrigger);
        }, 13000)
        this.updateGlobalState({ shouldClaimBonus: false });
      }
    }
  },
  getters: {
    shouldShowBannerInFullscreen(state) {
      //during customization, it can return false for NV, or true for other casinos.
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve(state.appConfig.NevadaRegulation);
        }, 1000)
      })
    }
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
      return "<p>YOU HAVE WON</p><p>" + this.$store.state.WinAmountDollars + "</p><p>CREDITS</p>";
    }
  },
  watch: {
    screenTrigger() {
      this.$store.state.isClaimed = false;
      this.isAttendantBtnEnabled = false;
    },
    isFullScreen(newVal, oldVal) {
      if (newVal) {
        this.resize = 'auto scale fill';

        if (!this.isExecuted) {
          $(".infoarea").hide();
          $("#claimBtn").hide();
          var promise = $("video")[0].play();
          // code to deal with autoplay policy changes
          if (promise !== undefined) {
            promise.then(() => { }).catch(() => {
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
        if (oldVal == true && this.appConfig.NevadaRegulation) {
          IGTMediaElements.hideFullScreen();
        }
        this.resize = "preset-2";
      }
    }
  },
});

let delayedShow = false
$("video")[0].addEventListener("timeupdate", function (e) {
  if (e.timeStamp > 4000 && !delayedShow) {
    $(".infoarea").fadeIn();
    $("#claimBtn").fadeIn();
    delayedShow = true;
  }
})
Bonus.onStart(() => {
  Bonus.vm.updateGlobalState({ shouldClaimBonus: true })
  Bonus.vm.updateGlobalState({ isClaimed: false })
});
