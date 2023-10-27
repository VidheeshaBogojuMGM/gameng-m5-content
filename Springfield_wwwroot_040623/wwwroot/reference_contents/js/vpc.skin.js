const pagesMap = {
    LIMIT_PAGE: 0,
    LIMIT_HELP: 1,
    NOLIMIT_HELP1: 2,
    NOLIMIT_HELP2: 3,

    OVERLIMIT_HELPPAGE: 0,
    UNDERLIMIT_HELPPAGE: 1,
    TRACKPLAY_HELPPAGE: 2,
}

const VPC = window['com.igt.vpc']("#app", {
    data() {
        return {
            PlayerMessage: "",
            PromptMessage: "",
            RemainingText: "",
            RemainingAmount: "",
            SessionText: "",
            SessionAmount: "",
            TotalText: "",
            TotalAmount: "",
            Percentage: 0,
            LimitSummary: "",
            OverlimitAmount: "",
            isLimit1: false,
            isLimit2: false,
            page: {
                LimitPage: true,
                LimitHelp: false,
                NoLlimitHelp1: false,
                NoLlimitHelp2: false
            },
            helpPage: {
                OverlimitHelpPage: false,
                UnderlimitHelpPage: false,
                TrackplayHelpPage: false,
            }
        }
    },
    components: {
        "circular-progress-bar": loadSkinTemplate("./components/circular_progress_bar.htm")
    },
    mounted() {
    },
    methods: {
        limit1BtnClick() {
            this.isLimit1 = true;
            this.isLimit2 = false;
        },
        limit2BtnClick() {
            this.isLimit1 = false;
            this.isLimit2 = true;
        },
        okBtn() {
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_A")
        },
        hideBtn() {
            IGTMediaElements.hideWindow();
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_A")
        },
        helpBtn() {
            this.switchPage(pagesMap.LIMIT_HELP);

            if (((this.vpcPlayerData.Limit1.Hit === 1) && this.isLimit1) || (this.isLimit2 && (this.vpcPlayerData.Limit2.Hit === 1))) {
                this.switchLimitHelpPage(pagesMap.OVERLIMIT_HELPPAGE);
            } else if ((this.isLimit1 && (this.vpcPlayerData.Limit1.Type === "No Limit Loss" || this.vpcPlayerData.Limit1.Type === "No Limit Time"))
                || (this.isLimit2 && (this.vpcPlayerData.Limit2.Type === "No Limit Loss" || this.vpcPlayerData.Limit2.Type === "No Limit Time"))) {
                this.switchLimitHelpPage(pagesMap.TRACKPLAY_HELPPAGE);
            } else {
                this.switchLimitHelpPage(pagesMap.UNDERLIMIT_HELPPAGE);
            }
        },
        learnBtn() {
            this.switchPage(pagesMap.NOLIMIT_HELP1);
        },
        nolimit1backbtn() {
            this.switchPage(pagesMap.LIMIT_PAGE);
        },
        nolimit1helpnextbtn() {
            this.switchPage(pagesMap.NOLIMIT_HELP2);
        },
        nolimit2backbtn() {
            this.switchPage(pagesMap.NOLIMIT_HELP1);
        },
        nolimit2helpendbtn() {
            this.switchPage(pagesMap.LIMIT_PAGE);
        },
        helpcancelclicked() {
            this.switchPage(pagesMap.LIMIT_PAGE);
        },
        switchPage(pageIndex) {
            this.page.LimitPage = pageIndex === 0;
            this.page.LimitHelp = pageIndex === 1;
            this.page.NoLlimitHelp1 = pageIndex === 2;
            this.page.NoLlimitHelp2 = pageIndex === 3;
        },
        switchLimitHelpPage(pageIndex) {
            this.helpPage.OverlimitHelpPage = pageIndex === 0;
            this.helpPage.UnderlimitHelpPage = pageIndex === 1;
            this.helpPage.TrackplayHelpPage = pageIndex === 2;
        },
        updateContentWithLimit1() {
            this.LimitSummary = this.vpcPlayerData.Limit1.LimitSummary;
            this.RemainingText = this.vpcPlayerData.Limit1.RemainingText;
            this.RemainingAmount = this.vpcPlayerData.Limit1.RemainingAmount;
            this.SessionText = this.vpcPlayerData.Limit1.SessionText;
            this.SessionAmount = this.vpcPlayerData.Limit1.SessionAmount;
            this.TotalText = this.vpcPlayerData.Limit1.TotalText;
            this.TotalAmount = this.vpcPlayerData.Limit1.TotalAmount;
            this.OverlimitAmount = this.vpcPlayerData.Limit1.OverlimitText;
            this.Percentage = this.vpcPlayerData.Limit1.Percentage;
        },
        updateContentWithLimit2() {
            this.LimitSummary = this.vpcPlayerData.Limit2.LimitSummary;
            this.RemainingText = this.vpcPlayerData.Limit2.RemainingText;
            this.RemainingAmount = this.vpcPlayerData.Limit2.RemainingAmount;
            this.SessionText = this.vpcPlayerData.Limit2.SessionText;
            this.SessionAmount = this.vpcPlayerData.Limit2.SessionAmount;
            this.TotalText = this.vpcPlayerData.Limit2.TotalText;
            this.TotalAmount = this.vpcPlayerData.Limit2.TotalAmount;
            this.OverlimitAmount = this.vpcPlayerData.Limit2.OverlimitText;
            this.Percentage = this.vpcPlayerData.Limit2.Percentage;
        }
    },
    computed: {
        smallHoriz() {
            return this.contentWidth / this.contentHeight < 4.5 && this.contentWidth > this.contentHeight && !this.fullscreen;
        },
        limit1Name() {
            return this.vpcPlayerData.Limit1.Name;
        },
        limit2Name() {
            return this.vpcPlayerData.Limit2.Name;
        },
        isNoLimit() {
            if (!this.vpcPlayerData.Limit1.Hit && this.isLimit1) {
                return ((this.vpcPlayerData.Limit1.Type === "No Limit Loss") || (this.vpcPlayerData.Limit1.Type === "No Limit Time"));
            }
            if (!this.vpcPlayerData.Limit2.Hit && this.isLimit2) {
                return (this.vpcPlayerData.Limit2.Type === "No Limit Loss" || this.vpcPlayerData.Limit2.Type === "No Limit Time");
            }
            return false;
        },
        isUnderLimit() {
            return !this.isOverLimit && !this.isNoLimit && !this.isNotSetAll;
        },
        isOverLimit() {
            return (this.vpcPlayerData.Limit1.Hit && this.isLimit1) || (this.vpcPlayerData.Limit2.Hit && this.isLimit2);
        },
        isNotSetAll() {
            if ((this.vpcPlayerData.Limit1.Type === "No Limit") && (this.vpcPlayerData.Limit2.Type === "No Limit"))
                return true;
            return false;
        },
        showtype() {
            if (this.vpcPlayerData.Limit1.Type === "No Limit" || this.vpcPlayerData.Limit2.Type === "No Limit")
                return "hidden";
            return "visible";
        }
    },
    watch: {
        vpcPlayerData(newVal) {
            if (newVal === null || newVal === undefined)
                return;

            if (newVal.LimitToShow === 0) {
                if (newVal.Limit1.Type === "No Limit") {
                    this.updateContentWithLimit2();
                } else {
                    this.isLimit1 = true;
                    this.isLimit2 = false;
                    this.updateContentWithLimit1();
                }
            }
            else if (newVal.LimitToShow === 1) {
                if (newVal.Limit2.Type === "No Limit") {
                    this.updateContentWithLimit1();
                } else {
                    this.isLimit2 = true;
                    this.isLimit1 = false;
                    this.updateContentWithLimit2();
                }
            }

            this.PlayerMessage = newVal.PlayerMessage;

        },
        displayMessage(newVal) {
            if (newVal.indexOf('@') === -1) {
                this.PromptMessage = newVal;
            }
            else {
                var msgArray = newVal.split('@');
                this.PromptMessage = msgArray[0];
                this.PlayerMessage = msgArray[1];
            }
        },
        isLimit1(newVal) {
            if (newVal) {
                this.updateContentWithLimit1();
            }
        },
        isLimit2(newVal) {
            if (newVal) {
                this.updateContentWithLimit2();
            }
        },
    }
});