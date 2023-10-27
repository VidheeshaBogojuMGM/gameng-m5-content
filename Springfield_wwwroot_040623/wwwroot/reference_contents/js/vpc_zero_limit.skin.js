const lossmessage = "You've chosen not to spend any money on gaming machines by setting a money limit of zero dollars.";
const timemessage = "You've chosen not to spend any time on gaming machines by setting a time limit of zero minutes.";
const losstimemessage = "You've chosen not to spend any money and time on gaming machines by setting a zero time and zero loss limit.";
const zerolimitheadingboth = "You have reached both of your limits";
const zerolimitheading = "You have reached your {0} {1} limit";

const VPC = window['com.igt.vpc']("#app", {
    data() {
        return {
            continuePlay: false,      
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
        continuePlayingConfirmBtn(){
            this.$store.dispatch("buttonPressed", "VPC_KEYPRESS_C");
        },
        continuePlayingZeroLimitBtn(){
            this.continuePlay = true;
            $("#logo").css("opacity", `0.1`);
        }, 
        translateMsg: function (msg, p1,p2){
            if (msg && String.prototype.translate) {
                msg = msg.translate();
                if (p1 && p2)
                    msg = "".changePlaceholder.call(msg, p1, p2).translate();
            }else{
                if (p1 && p2){
                    msg = msg.replace('{0}', p1);
                    msg = msg.replace('{1}', p2);
                }
            }
            return msg;
        },
    },
    computed: {
        smallHoriz() {
            return this.contentWidth / this.contentHeight < 4.5 && this.contentWidth > this.contentHeight && !this.fullscreen;
        },
        PlayerMessage(){    
            let rst = "";       
            let vpcPlayerData  = this.vpcPlayerData;
            if (this.screenId.toLowerCase() === '0x9d') {              
                if (this.displayMessage.indexOf('@') === -1) {
                    if (this.displayMessage.length > 2)
                        rst =  this.displayMessage;
                }
                else {
                    var msgArray = this.displayMessage.split('@');
                    if (vpcPlayerData && vpcPlayerData.playerMessage && vpcPlayerData.playerMessage.length > 2) {
                        rst = vpcPlayerData.playerMessage;
                    }
                    else if (msgArray.length === 2) {
                        rst  = msgArray[1];
                    }
                }
            }

            if (vpcPlayerData && vpcPlayerData.PlayerMessage && vpcPlayerData.PlayerMessage.length > 2) {
                rst = vpcPlayerData.PlayerMessage;
            }
            return rst;
        },
        ZerolimitHeader() {
            var newVal = this.vpcPlayerData;
            let rst = ""
            
            var isLimit1ZeroLimit = (newVal && newVal.Limit1) ? newVal.Limit1.ZeroLimit : false;
            var isLimit2ZeroLimit = (newVal && newVal.Limit2) ? newVal.Limit2.ZeroLimit : false;
           
            if ((isLimit1ZeroLimit) && (isLimit2ZeroLimit)) {
              rst = this.translateMsg(zerolimitheadingboth);
            } else if (isLimit1ZeroLimit) {
              var limittype = newVal.Limit1.Type.toLowerCase();
              var limitperiod = newVal.Limit1.Period;
              rst = this.translateMsg(zerolimitheading, limitperiod, limittype);
              } else if (isLimit2ZeroLimit) {
              var limittype = newVal.Limit2.Type.toLowerCase();
              var limitperiod = newVal.Limit2.Period;
              rst = this.translateMsg(zerolimitheading, limitperiod, limittype);
            }
            else { // this came from the "zero limit" flag assume both limits are zeroed regards of the values
              rst = this.translateMsg(zerolimitheadingboth);
            }
            return rst;
          },
        ZerolimitMessage(){
            var newVal = this.vpcPlayerData;
            let rst = ""
            
            var isLimit1ZeroLimit = (newVal && newVal.Limit1) ? newVal.Limit1.ZeroLimit : false;
            var isLimit2ZeroLimit = (newVal && newVal.Limit2) ? newVal.Limit2.ZeroLimit : false;
           
            if ((isLimit1ZeroLimit) && (isLimit2ZeroLimit )) {                
                rst = this.translateMsg(losstimemessage);
            }else if (isLimit1ZeroLimit ) {
                var limittype = newVal.Limit1.Type.toLowerCase();
                rst = limittype === "loss"? this.translateMsg(lossmessage):(limittype === "time"? this.translateMsg(timemessage):"");
            }else if (isLimit2ZeroLimit) {
                var limittype = newVal.Limit2.Type.toLowerCase();
                rst = limittype === "loss"? this.translateMsg(lossmessage):(limittype === "time"? this.translateMsg(timemessage):"");              
            }
            else { // this came from the "zero limit" flag assume both limits are zeroed regards of the values
                rst = this.translateMsg(losstimemessage);              
            }
            return rst;
        }
    },
    watch: {      
    }
});


