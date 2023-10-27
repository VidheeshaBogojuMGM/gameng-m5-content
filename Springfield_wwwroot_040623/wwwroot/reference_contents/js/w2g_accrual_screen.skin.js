const W2G = window["com.igt.w2g_accrual_screen"]("#app", {
  routes: [{
    name: "player",
    path: "/player",
    component: loadSkinTemplate("./components/w2g_player.htm"),
    props: true
  }, {
    name: "attendant",
    path: "/attendant",
    component: loadSkinTemplate("./components/w2g_attendant.htm"),
    props: true
  }, {
    name: "witness",
    path: "/witness",
    component: loadSkinTemplate("./components/w2g_witness.htm"),
    props: true
  }],
  watch: {
    currentView(n) {
      // resolve duplicated navigation issue
      if (this.$router.history.current.name === n) return;

      if (n === "player") {
        this.$router.push({
          name: "player"
        });
      }
      if (n === "attendant") {
        this.$router.push({
          name: "attendant"
        });
      }
      if (n === "witness") {
        this.$router.push({
          name: "witness"
        });
      }
    },
    isCancelled(n) {
      if (n) {
        setTimeout(() => {
          navigate("JACKPOT_SCREEN");
        }, 2000);
      }
    },
    transactionID(n, o) {
      IGTMediaElements.util.log.info(`[w2g][skin] before[${o}] after[${n}]`);

      // reset states of non-completed w2g by refreshing web page
      if (o !== null && n !== o) {
        IGTMediaElements.loadContent(`${location.origin}${location.pathname}?tid=${n}`);
      }

      this.$store.dispatch("initW2G");
    }
  }
});
