const MJT = window["com.igt.MJT"]("#app", {
  methods: {
    formattedTimer() {
      var m = Math.floor(this.RemainingTime / 60);
      var minutes = m < 10 ? '0' + m : m.toString();
      var sec = this.RemainingTime - minutes * 60;
      var seconds = sec < 10 ? '0' + sec : sec.toString();
      return minutes + " : " + seconds;
    },
    formattedTimes() {
      var ft = this.RemainingTime + "";
      while (ft.length < 3)
        ft = "0" + ft;
      return ft;
    }
  },
  computed: {
    countDownValue() {
      if (this.screenId == "0x5F") {
        $(".countDown").css("background-image", `url(./assets/mjt-times.png)`);
        return this.formattedTimes();
      } else {
        $(".countDown").css("background-image", `url(./assets/mjt-timer.png)`);
        return this.formattedTimer();
      }
    }
  }
});