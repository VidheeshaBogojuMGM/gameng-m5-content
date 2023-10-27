
const jackpot = window['com.igt.jackpot_screen']("#app");

jackpot.watch((state) => state.isAttendantCardInserted, function () {
    document.getElementById('attBtn').disabled = false;
});

jackpot.press("#attBtn", function () {
    jackpot.analytics.trackPress("attendantButtonPressed");
    jackpot.dispatch("buttonPressed");
    document.getElementById('attBtn').disabled = true;
});