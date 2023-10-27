//const Idle = window['com.igt.idle_screen']();
const PointPlay = window['com.igt.pointplay']();
const XC = window['com.igt.xtracredit']();

function allNotEmpty(...args) {
  for (var i of args) {
    if (i == "" || i == null) {
      return false;
    }
  }
  return true;
}

const Patron = window['com.igt.spa.session_screen']("#app", {
  state: {
    // adPlayerHost: "http://10.222.41.95/simulator",
    // adPlayerSelecterList: ["#adplayer"]
    // preferredDisplayType : "any"
  },
  data: {
    errorMessage: ""
  },
  routes: [{
      name: "session",
      path: "/",
      component: loadSkinTemplate("./components/spa_session_component.htm")
    },
    {
      name: "welcome",
      path: "/welcome",
      component: loadSkinTemplate("./components/spa_welcome_component.htm")
    },
    {
      name: "birthday",
      path: "/birthday/:duration",
      component: loadSkinTemplate("./components/spa_birthday_component.htm")
    }
    // {
    //   name: "idle",
    //   path: "/idle",
    //   component: loadSkinTemplate("./components/spa_idle_component.htm")
    // }
  ],
  computed: {
    originalSize() {
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
    },
    // sessionIsReady() {
    //   return this.PlayersPreferredName != "Player" && allNotEmpty(this.CompBalanceMoneyToken, this.PlayerPointsEarnedSession);
    //   // return allNotEmpty(this.CompBalanceMoneyToken, this.PlayerPointsEarnedSession, this.XC.XtraCreditInactiveAmount);
    // },
    themeName() {
      if (this.appConfig.PlayerLevelTheme) {
        return this.appConfig.PlayerLevelTheme[this.PlayerLevel];
      }
      return "defaultTheme";
    },
    isSessionReady() {
      return allNotEmpty(this.CompBalanceMoneyToken, this.PlayerPointsEarnedSession, this.cardId /* this.floorLocation */);
    }
  },
  methods: {
    changeTheme() {
      var suffix = Number(this.PlayerLevel) == 2 ? "_lv2" : "";
      var patronRanking = Number(this.PlayerLevel);
      //MGM: removed tier background logic
      // $("body").css({
      //   "background-image": `url(../assets/bg${suffix}.png)`
      // });
      var patronRankingCss = {};
      switch(patronRanking) {
        case 1:
          //Saphire
          patronRankingCss = {
            "background-image": "url(./mgm/images/sapphire_tier_border.png)",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "color": "#fff",
            "border": "none"
          }
          break;
        case 2:
          //Gold
          patronRankingCss = {
            "background-image": "url(./mgm/images/gold_tier_border.png)",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
             "color": "#fff",
             "border": "none"
          }
        break;
          case 3:
          //Pearl
          patronRankingCss = {
            "background-image": "url(./mgm/images/pearl_tier_border.png)",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "color": "black",
            "border": "none"
          }
          break;
        case 4:
          //Platinum
          patronRankingCss = {
            "background-image": "url(./mgm/images/platinum_tier_border.png)",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
             "color": "#fff",
             "border": "none"
          }
          break;
        case 5:
          //NOIR
          patronRankingCss = {
            "background-image": "url(./mgm/images/rank-noir-u3.png)",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "color": "#fff",
            "border": "none"
          }
          break;
        default:
          patronRankingCss = {
            "background-color": "transparent",
            "color": "#fff",
            "border": "1px solid #fff"
          }
          break;
      }
      $("#player-name").css(patronRankingCss);
    },
    getNextScreen() {
      let currentScreen = this.$route.name
      return "session"
    },
    onFinishCurrentScreen() {
      this.$router.push({name: this.getNextScreen()})
    }
  },
  watch: {
    PlayerLevel() {
      this.changeTheme();
    },
  },
  modules: {
    XC,
    PointPlay,
    //Idle
  }
});

var pcb = Patron.analytics.willTriggerBusiness("CardInPerformance");
Patron.watch("isSessionReady", function (value) {
  if (value) {
    if (Patron.vm.$route.name == "welcome") {
      console.log("$cskip to session", "color: red");
      Patron.vm.$router.push({
        name: "session"
      })
    }

    performance.clearMarks();
    performance.clearMeasures();
    performance.mark("render:end");
    performance.measure("render", undefined, "render:end");
    pcb(performance.getEntriesByName("render")[0]);
    // IGTMediaElements.util.log.debug("Analytics: Performance "+JSON.stringify(performance.getEntriesByName("render")[0]));
    performance.clearMarks();
    performance.clearMeasures();
  }
}, {
  immediate: true
})
