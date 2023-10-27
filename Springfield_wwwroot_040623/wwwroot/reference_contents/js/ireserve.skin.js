window.ireserve = window['com.igt.ireserve'](
  '#app', {
    data() {
      return {
        lockOption: null,
        page: {
          options: true,
          confirmation: false,
          gameReserved: false,
          info: false,
          pin: false,
          loading: false,
          infoWithBack: false
        }
      };
    },
    created() {
      // this.$store.state.mockAPI = {
      //   "/iReserveWebPortal/api/iReserve/RetrieveOperatorInfo": {},
      //   "/iReserveWebPortal/api/iReserve/RetrieveEGMInfo": {},
      //   "/iReserveWebPortal/api/iReserve/ReserveEGM": {},
      //   "/iReserveWebPortal/api/iReserve/UnReserveEGM": {}
      // }
    },
    mounted() {
      this.switchPage(5);
    },
    computed: {
      isFullScreen() {
        return this.preferredDisplayType === 'fullscreen';
      },
      fullscreenClass() {
        return this.isFullScreen ? 'fullscreen' : '';
      },
      originalSize() {
        if (this.isFullScreen) {
          return {
            width: 720,
            height: 720
          };
        } else {
          if (this.isVertical) {
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
        }
      }
    },
    components: {
      pinpad: this.loadSkinTemplate('./components/ireserve_pinpad.htm')
    },
    watch: {
      originalSize() {
        this.resize = this.isFullScreen ? 'auto scale fit bottom' : 'preset-2';
      },
      info: {
        handler(newVal) {
          IGTMediaElements.util.log.info(`[ireserve][skin] info [${JSON.stringify(newVal)}]`);

          if (newVal.message || newVal.title) {
            this.switchPage(3);
          }
        },
        deep: true
      },
      showPin(newValue) {
        IGTMediaElements.util.log.info(`[ireserve][skin] showPin [${JSON.stringify(newValue)}]`);

        if (newValue) {
          this.switchPage(4);
          this.$store.state.preferredDisplayType = 'fullscreen';
        }
      },
      isCardout(newValue) {
        IGTMediaElements.util.log.info(`[ireserve][skin] isCardout[${newValue}] isLocked[${this.isLocked}]`);

        if (newValue && this.isLocked) {
          this.switchPage(2);
        }
      },
      shouldLock(newValue) {
        IGTMediaElements.util.log.info(`[ireserve][skin] shouldLock [${newValue}]`);
        if (newValue) {
          this.switchPage(2);

          this.$store.state.preferredDisplayType = 'fullscreen';

          var self = this;
          $('.CountdownClock').timeTo(this.lockRemainingSeconds, function () {
            self.switchPage(7);
            self.$store.dispatch('unlock', {
              IsLockingTimeExpired: true,
              IsPinValidated: false
            });
            //self.$store.state.preferredDisplayType = 'normal'; // in case of reload content or times up
          });
        } else {
          this.$store.state.preferredDisplayType = 'normal';
        }
      },
      options(newValue) {
        if (newValue) {
          this.switchPage(1);
        }
      },
      isFullScreen: { // this is a workaround for TFT to lock the machine
        handler(value) {
          IGTMediaElements.util.log.debug("IRD - will call fullscreen API to set fullscreen to: " + value);
          if (value) {
            IGTMediaElements.showFullScreen();
          } else {
            IGTMediaElements.hideFullScreen();
          }
        },
        immediate: false
      }
    },
    methods: {
      onPinExit() {
        this.switchPage(2);
      },
      onPinValid() {
        this.$store.dispatch('unlock', {
          IsLockingTimeExpired: false,
          IsPinValidated: true
        });

        if (!this.$store.state.isLocked && this.$store.getters.sessionType === 0) {
          this.exitApp();
        } else {
          this.$store.dispatch('getOptions');
        }
      },
      selectOption(option) {
        IGTMediaElements.util.log.info(`[ireserve][skin] selectOption ${JSON.stringify(option)}`);

        this.lockOption = option;

        this.checkBalance()
      },
      checkBalance() {
        var self = this;
        IGTMediaElements.cashless.getCashlessBalance().then(function (data) {
          IGTMediaElements.util.log.info(`[ireserve][skin] getCashlessBalance ${JSON.stringify(data)}`);

          if (data.egmCents > 0) {
            // self.switchPage(0)
            self.switchPage(6);
          } else {
            self.switchPage(0);
          }
        });
      },
      confirm() {
        this.switchPage(5);
        this.$store.dispatch('lock', this.lockOption);
      },
      cancel() {
        this.lockOption = null;
        this.switchPage(1);
      },
      exitApp() {
        if (m.state.playerId==="-2")
        {
          console.log ("exiting from attendand cardid = -2");
          navigate('ATTENDANT_WELCOME_SCREEN');
        }
        else
        {
          navigate('SESSION_SCREEN');
        }
      },
      backToOptions() {
        this.switchPage(1);
      },
      switchPage(pageIndex) {
        this.page.confirmation = pageIndex === 0;
        this.page.options = pageIndex === 1 || pageIndex === 0;
        this.page.gameReserved = pageIndex === 2 || pageIndex === 4;
        this.page.info = pageIndex === 3;
        this.page.pin = pageIndex === 4;
        this.page.loading = pageIndex === 5;
        this.page.infoWithBack = pageIndex === 6;
        this.page.loadingWithoutHeader = pageIndex === 7;
      }
    }
  }
);
