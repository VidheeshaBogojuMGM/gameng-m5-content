const PointPlay = window['com.igt.pointplay']();
const XC = window['com.igt.xtracredit']();
const Patron = window['com.igt.session_screen']("#app", {
  data: {
    errorMessage: ""
  },
  components: {
    "Session": loadSkinTemplate("./components/spa_session_component.htm")
  },
  computed: {
    themeName() {
      if (this.appConfig.PlayerLevelTheme) {
        return this.appConfig.PlayerLevelTheme[this.PlayerLevel];
      }
      return "defaultTheme";
    },
  },
  methods: {
    changeTheme() {
      //MGM: removed tier background logic 
      // var suffix = Number(this.PlayerLevel) == 2 ? "_lv2" : "";
      // $("body").css({
      //   "background-image": `url(../assets/bg${suffix}.png)`
      // });
    },
  },
  watch: {
    PlayerLevel() {
      this.changeTheme();
    },
  },
  modules: {
    PointPlay: PointPlay,
    XC: XC
  }
});
