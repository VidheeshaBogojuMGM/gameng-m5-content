const cld = window["com.igt.carded_lucky_draw"]("#app", {
    routes: [{
        name: "WINNER",
        path: "/winner",
        component: loadSkinTemplate("./components/cld_winner.htm")
    }, {
        name: "CELEBRATIONWINNER",
        path: "/celebrationwinner",
        component: loadSkinTemplate("./components/cld_celebration.htm")
    }, {
        name: "WINNERFOUND",
        path: "/winnerfound",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "WINNERNOTFOUND",
        path: "/winnernotfound",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "SEARCHINGFORWINNER",
        path: "/searchingforwinner",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "VERIFYWINNER",
        path: "/verifywinner",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "VERIFYING",
        path: "/verifying",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "DENIED",
        path: "/denied",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "REDRAW",
        path: "/redraw",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "SELECTING",
        path: "/selecting",
        component: loadSkinTemplate("./components/cld_message.htm")
    }, {
        name: "UNKNOWN",
        path: "/unknown",
        component: loadSkinTemplate("./components/cld_message.htm")
    }]
});


cld.watch("CurrentScreen", (n, o) => {
	let name = n;
	if(cld.vm.$router.currentRoute.name !== name) {
		cld.vm.$router.push({
			name: name
		})
	}
})


cld.state.cldMessagePattern.WINNER = "Congratulations.*won the Mystery bonus!"
cld.state.cldMessagePattern.WINNERFOUND = "Lucky member.*has been found."
cld.state.cldMessagePattern.WINNERNOTFOUND = "Lucky member.*has not been found."
cld.state.cldMessagePattern.SEARCHINGFORWINNER = "Now searching for.*"
cld.state.cldMessagePattern.VERIFYWINNER = "Lucky member.*selected as the winner!"
cld.state.cldMessagePattern.CELEBRATIONWINNER = "You've won.*celebration prize!"
cld.state.cldMessagePattern.VERIFYING = "Verification in progress for Lucky member.*"
cld.state.cldMessagePattern.DENIED = "Mystery bonus denied for Lucky Member.*"
cld.state.cldMessagePattern.REDRAW = "Mystery bonus redraw.*"
cld.state.cldMessagePattern.SELECTING = "Mystery bonus selecting.*"
