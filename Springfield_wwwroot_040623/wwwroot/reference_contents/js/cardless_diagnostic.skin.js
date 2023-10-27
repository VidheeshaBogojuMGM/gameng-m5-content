let cardlessStatusMap = {
    version: {
        "-1": "connection error",
        "0": "Version 0",
        "1": "Version 1",
        "2": "Version 1.1",
        "3": "Version 1.2",
        "4": "Version 1.3",
        "5": "Version 5"
    },
    disconnectReason: {
        "1": "no activity",
        "2": "physical card detected",
        "3": "cashout button pressed",
        "4": "busy",
        "5": "e-card out",
        "6": "abandoned card",
        "7": "bad nonce",
        "8": "bad challenge response",
        "9": "disapproved SDK",
        "10": "unknown / no reason",
        "50": "connection timer timeout",
        "51": "zombie timer timeout",
        "52": "walk away detected",
        "53": "BLE unknown message",
        "54": "BLE disconnect error",
        "55": "serial port error",
        "56": "serial port removed",
        "57": "NFC bad card read",
        "58": "NFC pass not found"
    }
}

const Cardless = window['com.igt.cardlessStatus']("#app", {
    data() {
        return {
            pageShow: "current",
            openDetail: "",
            connectedDetail: "",
            disconnectedDetail: "",
            closedDetail: ""
        }
    },
    mounted() {
        $("#current-status").addClass("button-show");
        $("#history-status").removeClass("button-show");
    },
    computed: {
        disconnectReason() {
            console.log("disconnectReasonCode:" + this.$store.state.disconnectedReasonCode);
            if (this.$store.state.connectStatus === "closed")
                return this.lastDisconnectReason;
            else if (this.$store.state.connectStatus === "disconnected")
                return cardlessStatusMap['disconnectReason'][this.$store.state.disconnectedReasonCode] || `Code:${this.$store.state.disconnectedReasonCode}`;
            else
                return "N/A";
        },
        lastDisconnectReason() {
            return cardlessStatusMap['disconnectReason'][this.$store.state.lastDisconnectReasonCode] || `Code:${this.$store.state.lastDisconnectReasonCode}`;
        },
        version() {
            return cardlessStatusMap['version'][this.$store.state.versionCode] || "N/A";
        },
        appLabelShow(){
            return this.$store.state.appLabel || "N/A";
        },
        mobileShow(){
            return this.$store.state.mobile || "N/A";
        }
    },
    watch: {
        historyStatusData(newVal) {
            this.getValueForHistoryStatus();
        }

    },
    methods: {
        onCurrentButton() {
            $("#current-status").addClass("button-show");
            $("#history-status").removeClass("button-show");
            this.pageShow = "current";
        },
        onHistoryButton() {
            $("#history-status").addClass("button-show");
            $("#current-status").removeClass("button-show");
            this.pageShow = "history";
            this.$store.dispatch('onGetCardlessStatusHistory');
        },
        getCardlessEventString(data, eventType) {
            var returnString = "Not Available";

            if (data && data.interface && data.status) {
                returnString = "I: " + data.interface;
                if (data.interface === 'NFC') {
                    if (data.hasOwnProperty('mobile')) {
                        returnString += " M: " + data.mobile;
                    }
                    if (data.hasOwnProperty('app_label')) {
                        returnString += " A: " + data.app_label;
                    }
                }

                if (eventType === 'open') { } else if (eventType === 'connected') {
                    returnString += " V: " + data.version;
                } else if (eventType === 'disconnected') {
                    if (data.hasOwnProperty('disconnectReason')) {
                        returnString += " R: " + cardlessStatusMap['disconnectReason'][data.disconnectReason];
                    }
                } else if (eventType === 'closed') {
                    if (data.hasOwnProperty('lastDisconnectReason')) {
                        returnString += " R: " + cardlessStatusMap['disconnectReason'][data.lastDisconnectReason];
                    }
                }

            }
            return returnString;
        },
        getValueForHistoryStatus() {
            let data = this.$store.state.historyStatusData;
            if (data && data.length > 0) {
                data.forEach(el => {
                    if (el.status == "open") {
                        this.openDetail = this.getCardlessEventString(el, "open");
                    } else if (el.status == "connected") {
                        this.connectedDetail = this.getCardlessEventString(el, "connected");
                    } else if (el.status == "disconnected") {
                        this.disconnectedDetail = this.getCardlessEventString(el, "disconnected");
                    } else if (el.status == "closed") {
                        this.closedDetail = this.getCardlessEventString(el, "closed");
                    } else {
                        console.log('unknown status found');
                    }
                });
            }
        },
        backToHome() {
            this.analytics.trackPress("backToSession");
            window.history.back();
        },

    },


});