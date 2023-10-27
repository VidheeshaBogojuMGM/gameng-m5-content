
const handpay = window['com.igt.handpay_jackpot']("#app");

handpay.watch((state) => state.isAttendantCardInserted, function (newValue) {
    document.getElementById('attBtn').disabled = false;
});

handpay.press("#attBtn", function () {
    handpay.analytics.trackPress("attendantButtonPressed");
    handpay.dispatch("buttonPressed");
    document.getElementById('attBtn').disabled = true;
});
