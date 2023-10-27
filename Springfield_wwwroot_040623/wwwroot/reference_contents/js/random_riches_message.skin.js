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

window.RR_message = window['com.igt.RR.message'](
  '#app', {
    data () {
      return {}
    },
    methods: {
      back () {
        this.navigate('SESSION_SCREEN')
      }
    },
    watch: {
      currentTheme (newVal, oldVal) {
        Theme.switch(newVal, oldVal)
      },
      displayMessage(newVal, oldVal) {
        if(newVal && newVal.includes('|-|') && newVal !== oldVal) {
          this.updateGlobalState({ shouldShowBannerDisplayMessage: true, displayMessage: newVal.trim().split('|-|')[0].substring(1) })
        }
      }
    }
  }
)
