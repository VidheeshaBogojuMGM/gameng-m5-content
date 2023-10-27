
var helpModule = {
    data() {
        return {
            errorMessage: "",
			showConfirmButton: false,
			isResetPointsConversion: false
        }
    },
    components: {
        "message-overlay": loadSkinTemplate("./components/message_overlay.htm"),
		"amount_selection": loadSkinTemplate("./components/amount_selection.htm")
    },
    methods: {
		resetInputValues() {
			this.$store.state.DollarInput = 0;
			this.isResetPointsConversion = true;
			this.showConfirmButton = false;
            this.clearPressedPinPad();
		},
        cancelPointPlay() {
            this.resetInputValues();
            window.history.back();
        },
		cancelOtherAmount() {
			this.resetInputValues();
			leaveTo('#home');
		},
		selectOtherAmount() {
			this.resetInputValues();
			leaveTo('#other');
		},
        selectAmount: function (amount) {
            this.analytics.trackPress("SelectAmount", amount);
            this.$store.state.DollarInput = parseInt(amount);
			this.showConfirmButton = true;
        },
        clearPressedPinPad: function() {
            var pinPadNumbers = document.querySelector('.pin-numbers-container');
            if(pinPadNumbers)
            {
              for(var i= 0; i < pinPadNumbers.children.length; i++) {
                pinPadNumbers.children[i].classList.remove('pressed')
              }
            }
        },
        filledPinsValue: function (value) {
            var pinField = document.getElementById(`num-${value}`);
            if(pinField) {
              pinField.classList.add("pressed");
            }
        },
        input: function (value, isOtherAmount) {
            this.analytics.trackPress("input", value);
            //this.clearPressedPinPad();
            
            if (value == 'clear') {
                this.$store.state.DollarInput = 0;
				this.hasValidInput();
                return;
            }
            if (value == 'back') {
                this.back_input();
				this.hasValidInput();
                return;
            }
            var enterAmountToConvert = 0;
            //this.filledPinsValue(value);
            if (this.DollarInput == 0) {
                enterAmountToConvert  = this.setAmountToConvert(value.toString());
                if(isOtherAmount) {
                   enterAmountToConvert = parseInt(enterAmountToConvert.replace(".",""));
                }

                this.$store.state.DollarInput = enterAmountToConvert;
				this.hasValidInput();
            }
            else {
                if(this.DollarInput.length >= 8) {
                    return;
                }

                enterAmountToConvert  = this.setAmountToConvert(this.DollarInput + value.toString());
                if(isOtherAmount) {
                    enterAmountToConvert = parseInt(enterAmountToConvert.replace(".",""));
                }    
                this.$store.state.DollarInput = enterAmountToConvert;
                
                this.hasValidInput();
            }
        },
        setAmountToConvert: function(amount){
            var inputAmt= parseInt(amount.replace(".",""));
            return this.numberWithCommas((inputAmt / 100).toFixed(2));
                
        },
        numberWithCommas: function(x) {
            return x.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
		hasValidInput: function() {
			if(this.DollarInput == '0') {
				this.showConfirmButton = false;
			}
			else this.showConfirmButton = true
		},
        back_input: function () {
            if (this.DollarInput >= 10) {
                var inputDigital = this.DollarInput.toString();
                this.$store.state.DollarInput = inputDigital.substr(0, (inputDigital.length - 1));
            } else {
                this.$store.state.DollarInput = 0;
            }
        },
        commitConvert: function () {
            if (this.DollarInput == '0') {
                this.errorMessage = "Invalid Number";
                return;
            }
            if (this.DollarInput != 0 && parseInt(this.DollarInput) > parseInt(this.PointInDollar)) {
                this.errorMessage = "Exceed Limit";
                return;
            }

            if (this.DollarInput != 0 && parseInt(this.DollarInput) < this.PointConversionMinimumDollar) {
                this.errorMessage = "The minimum is {0}{1}".translate().changePlaceholder(this.currencySymbol, this.PointConversionMinimumDollar)
                return;
            }

            this.$store.state.DisplayMessage = 'Conversion in progress...';
            navigateWithAnimation("#operation-message");
            this.analytics.trackPress("convert");
            this.$store.dispatch('StartConvert');
            // If need to convert point to credit
            // PointPlay.dispatch('StartConvert', "TOCREDIT");
        }
    },
    filters: {
        thousandsFormatFilter(value) {
            if (value > 1000000) {
                return Math.floor(value / 1000000) + "M";
            }
            if (value >= 1000) {
                return Math.floor((value / 1000)) + "K";
            }
            return value;
        }
    },
    computed: {
        AmountGroups() {

            if (!this.$store.state.appConfig || !this.$store.state.appConfig.pointPlayMapEgmDenomButtons)
                return [];
            
            let quickAmounts = this.$store.state.appConfig.pointPlayMapEgmDenomButtons.default;  
            if (this.$store.state.appConfig.pointPlayMapEgmDenomButtons[this.$store.state.egmDenom])
                quickAmounts = this.$store.state.appConfig.pointPlayMapEgmDenomButtons[this.$store.state.egmDenom];

            const availableItems = [];
            for(let i=0;i<quickAmounts.length;i++){
                let val = quickAmounts[i]/100;
              if(val < this.$store.getters.PointInDollar)
              {
                  availableItems.push(val);
              }
            }

            if (!availableItems.includes(parseInt(this.$store.getters.PointInDollar)) && parseInt(this.$store.getters.PointInDollar) != 0) {
                availableItems.push(parseInt(this.$store.getters.PointInDollar));
            }

            return availableItems;
        }
    }
}

const PointPlay = window['com.igt.pointplay']('#app', helpModule);
function navigateWithAnimation(el) {
    $(".page").hide();
    $(el).css("display", "flex")
    TweenMax.staggerFrom(el, 0.7, { alpha: 0 }, 0.2); // 
}

PointPlay.watch((state) => state.Enabled, function () {
    if (PointPlay.state.Enabled) {
        navigateWithAnimation("#home");
    } else {
        PointPlay.state.DisplayMessage = 'Slot Dollars is not available!';
        trace(PointPlay.state.DisabledReason == null ? "Unknown reason. Could check dupulicate session, Point balance too low to convert." : PointPlay.state.DisabledReason);
        navigateWithAnimation("#operation-message");
    }

})

PointPlay.watch((state) => state.ConvertStatus, function (after, before) {
    if (after == 'SUCCEEDED') {
        PointPlay.goHomeTimer = setTimeout(() => exitToApps(), 5000);
        PointPlay.state.DisplayMessage = 'Conversion succeeded !!!';
    } else if (after == 'FAILED') {
        PointPlay.state.DisplayMessage = 'Conversion failed !!!';
        console.log('conversion failed');
    } else {
        console.log('convert status changed, no handle. From ' + before + ' to ' + after);
    }
}, this);

function leaveTo(page) {
    if(PointPlay.goHomeTimer){
        clearTimeout(PointPlay.goHomeTimer);
        PointPlay.goHomeTimer = null;
    }
    PointPlay.analytics.trackPress("LeaveToPage", page);
    if (page == '#home' || page == '#other') {
        PointPlay.state.DollarInput = 0;
        if (page == '#home') {
            PointPlay.state.DollarInput = '0';
        }
        PointPlay.state.ConvertStatus = 'Navigated';
        PointPlay.state.DisplayMessage = 'Conversion in progress...';
    }
    navigateWithAnimation(page);
}

function retry() {
    PointPlay.state.DisplayMessage = 'Conversion in progress...';
    PointPlay.state.ConvertStatus = "Retry";
    PointPlay.analytics.trackPress("retry");
    PointPlay.dispatch('StartConvert');
    // If need to convert point to credit 
    // PointPlay.dispatch('StartConvert', "TOCREDIT");
}
function exitToApps() {
    PointPlay.analytics.trackPress("exit");
    //PointPlay.navigate('./session_screen.html');
    PointPlay.navigate('SESSION_SCREEN');
}