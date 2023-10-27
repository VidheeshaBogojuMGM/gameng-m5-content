const LD = window["com.igt.lucky_draw"]("#app", {
  routes: [{
    name: "countdown",
    path: "/countdown",
    component: loadSkinTemplate("./components/lucky_draw_page_countdown.htm")
  }, {
    name: "number_assigned",
    path: "/number_assigned",
    component: loadSkinTemplate("./components/lucky_draw_page_number_assigned.htm")
  }, {
    name: "winning",
    path: "/winning",
    component: loadSkinTemplate("./components/lucky_draw_page_winning.htm")
  }],
  watch: {
    drawStatus(n) {
      if ([0, 1].includes(n)) {
        this.$router.push({
          name: "countdown"
        }).catch(err => {});
      } else if (n === 2) {
        this.$router.push({
          name: "number_assigned"
        });
      } else if ([3, 4, 5, 6].includes(n)) {
        this.updateGlobalState({
          shouldShowBannerDisplayMessage: n !== 3
        });
        this.$router.push({
          name: "winning"
        }).catch(err => {});
      } else {
        console.log("unknown draw status")
      }
    }
  }
});
