try {
	(new Date()).toLocaleTimeString()
} catch (e) {
  Date.prototype.toLocaleTimeString = function () {
    var h = this.getHours();
    var m = this.getMinutes();
    var s = this.getSeconds();
    var suffix = h > 12 ? "PM" : "AM";
    h = h % 12;
    m = `00${m}`.substr(-2, 2);
    s = `00${s}`.substr(-2, 2);
    return `${h}:${m}:${s} ${suffix}`
  }
}

window.award = window['com.igt.RR.award'](
  '#app', {
    data () {
      return {
        spinHome: true,
        spinning: false,
        spinComplete: false,
        infoPage: false,
        prizesContent: '',
        classObject: {
          fs: ''
        }
      }
    },
    mounted () {
      $('#wheel-btn').hide()
    },
    computed: {
      isLuckySpinner () {
        return Theme.isLuckySpinner(this.currentTheme)
      },
      isFullScreen () {
        return this.preferredDisplayType === 'fullscreen'
      },
      originalSize () {
        if (this.isFullScreen) {
          return {
            width: 720,
            height: 720
          }
        } else {
          if (this.isVertical) {
            return {
              width: 256,
              height: 956
            }
          } else {
            return {
              width: 960,
              height: 224
            }
          }
        }
      },
      wheelTransform () {
        if (Theme.isLuckySpinner(this.currentTheme)) {
          return 'transform: scale(1.1);'
        } else {
          if (this.displayName === 'U6') {
            return 'transform: translateY(50px) scale(1.4);'
          } else if (this.displayName === 'U2') {
            return 'transform: scale(1.05);'
          } else {
            return ''
          }
        }
      },
      TFTButtonStyle () {
        if (this.displayName === 'TFT' && this.preferredDisplayType !== 'fullscreen') {
          return 'height: 3rem; font-size: 1rem'
        }
      },
      radius () {
        if (this.isFullScreen) return 135

        if (this.isVertical) {
          return Theme.isLuckySpinner(this.currentTheme) ? 48 : 100
        } else {
          return Theme.isLuckySpinner(this.currentTheme) ? 43 : 70
        }
      }
    },
    watch: {
      originalSize () {
        this.resize = this.isFullScreen ? 'auto scale fit bottom' : 'preset-2'
      },
      award (newVal) {
        if (!newVal) {
          return
        }

        $('#wheel-btn').fadeIn()

        const formatedAwards = newVal.awards.map((a) => {
          return parseInt(a)
        })

        Animation.spinWheel(this.currentTheme, $('#wheelcontainer'), formatedAwards, parseInt(newVal.award), this.radius)
      },
      errorMessage () {
        if (this.supportFullScreen) {
          this.$store.state.preferredDisplayType = 'normal'
        }
        this.switchPage(3)
      },
      awardNotification (newVal) {
        if (newVal) {
          this.switchPage(3)
        }
      },
      currentTheme (newVal, oldVal) {
        Theme.switch(newVal, oldVal)
        if (this.supportFullScreen && Theme.isLuckySpinner(newVal) && !this.awardNotification) {
          this.$store.state.preferredDisplayType = 'fullscreen'
        } else {
          this.$store.state.preferredDisplayType = 'normal'
        }
      },
      preferredDisplayType (newVal) {
        
        IGTMediaElements.util.log.info(`rr-award-skin [${this.supportFullScreen}][${newVal}]`)
          
        if (this.supportFullScreen) {
          this.classObject.fs = newVal === 'fullscreen' ? 'fullscreen' : ''
          if(newVal === 'fullscreen') {
            IGTMediaElements.util.log.info(`rr-award-skin showFullScreen`)
            IGTMediaElements.showFullScreen()
          } else {
            IGTMediaElements.util.log.info(`rr-award-skin hideFullScreen`)
            IGTMediaElements.hideFullScreen()
          }
        } else {
          this.classObject.fs = 'sw'
        }
      },
      displayMessage(newVal, oldVal) {
        if(newVal && newVal.includes('|-|') && newVal !== oldVal) {
          this.updateGlobalState({ shouldShowBannerDisplayMessage: false, displayMessage: newVal.trim().split('|-|')[0].substring(1) })
        }
      }
    },
    methods: {
      spinWheelBtnClick () {
        this.switchPage(1)

        var self = this
        setTimeout(() => {
          Animation.rotate(this.currentTheme, $('#wheelcontainer'), function (result) {
            if (result) {
              self.prizesContent = `${result.join(' + ')} = ${parseInt(self.award.award)}`
            }
            self.switchPage(2)
            self.updateGlobalState({ shouldShowBannerDisplayMessage: true })
          })
        }, 1000)
      },
      close () {
        if (this.supportFullScreen) {
          this.$store.state.preferredDisplayType = 'normal'
        }
        this.navigate('SESSION_SCREEN')
      },
      switchPage (pageIndex) {
        this.spinHome = pageIndex === 0
        this.spinning = pageIndex === 1
        this.spinComplete = pageIndex === 2
        this.infoPage = pageIndex === 3
      }
    }
  }
)
