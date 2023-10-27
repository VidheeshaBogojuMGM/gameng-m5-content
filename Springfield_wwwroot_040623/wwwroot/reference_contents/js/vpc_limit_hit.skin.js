const VPC = window['com.igt.vpc']("#app", {
    data() {
        return {
            LimitHitContinuePlay: false,         
        }
    },
    components: {
        "circular-progress-bar": loadSkinTemplate("./components/circular_progress_bar.htm")
    },
    mounted() {

    },
    methods: {
        stopBtn(){
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_S");
        },
        continuePlayingLimitHitConfirmBtn(){
            /* request the live action summary to be shown */
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_L");
            /* acknowledge to continue playing */
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_C");
        },
        continuePlayingConfirmBtn(){
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_C");
        },
        continuePlayingLimitHitBtn(){
            this.LimitHitContinuePlay = true;
            $("#logo").css("opacity", `0.1`);    
        },
    },
    computed: {
        smallHoriz() {
            return this.contentWidth / this.contentHeight < 4.5 && this.contentWidth > this.contentHeight && !this.fullscreen;
        },
        PromptMessage(){        
            let rst = "";
            let screenIds = ["0x9f","0xa0","0xa1"];
            let screenId = this.screenId.toLowerCase();

            if (screenIds.includes(screenId)){
                let displayMessage = this.displayMessage;
                if ( displayMessage) {
                    if (displayMessage.indexOf('@') === -1) {
                        rst = displayMessage;
                    }
                    else {
                        let msgArray = displayMessage.split('@');
                        rst = msgArray[0];
                    }
                }
            }
            return rst;
        },
        PlayerMessage(){
            let vpcPlayerData = this.vpcPlayerData;
            let rst = "";

            let screenIds = ["0x9f","0xa0","0xa1"];
            let screenId = this.screenId.toLowerCase();

            if (screenIds.includes(screenId)){
                let displayMessage = this.displayMessage;
                if ( displayMessage) {
                    if (displayMessage.indexOf('@') === -1) {
                        rst = "";
                    }
                    else {
                        let msgArray = displayMessage.split('@');
                        rst = msgArray[1];
                    }
                }
            }

            if (vpcPlayerData && vpcPlayerData.PlayerMessage && vpcPlayerData.PlayerMessage.length > 2) {
                rst = vpcPlayerData.PlayerMessage;
            }
            return rst;
        },
        LimithitData(){
            let rst = {
                RemainingText: "",
                RemainingAmount: "",
                SessionText: "",
                SessionAmount: "",
                TotalText: "",
                TotalAmount: "",
                Percentage: 0,
            };
            if (this.vpcPlayerData && this.vpcPlayerData.LimitToShow === 0) {
                rst = {
                    RemainingText: this.vpcPlayerData.Limit1.RemainingText,
                    RemainingAmount: this.vpcPlayerData.Limit1.RemainingAmount,
                    SessionText: this.vpcPlayerData.Limit1.SessionText,
                    SessionAmount: this.vpcPlayerData.Limit1.SessionAmount,
                    TotalText: this.vpcPlayerData.Limit1.TotalText,
                    TotalAmount: this.vpcPlayerData.Limit1.TotalAmount,
                    Percentage: this.vpcPlayerData.Limit1.Percentage,
                };  
            }
            else if (this.vpcPlayerData && this.vpcPlayerData.LimitToShow === 1) {
                rst = {
                    RemainingText: this.vpcPlayerData.Limit2.RemainingText,
                    RemainingAmount: this.vpcPlayerData.Limit2.RemainingAmount,
                    SessionText: this.vpcPlayerData.Limit2.SessionText,
                    SessionAmount: this.vpcPlayerData.Limit2.SessionAmount,
                    TotalText: this.vpcPlayerData.Limit2.TotalText,
                    TotalAmount: this.vpcPlayerData.Limit2.TotalAmount,
                    Percentage: this.vpcPlayerData.Limit2.Percentage,
                };
            }
            return rst;
        },
    },
});