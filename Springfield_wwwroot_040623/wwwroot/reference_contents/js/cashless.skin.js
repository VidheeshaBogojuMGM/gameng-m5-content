var statusMsg = {
    info: {
        Processing: "Transfer in processing...",
        BeforeConfirm: {
            toMachine: "You will transfer ${0} to Machine.",
            toCard: "You will transfer ${0} to Card.",
        },
        Fail: "Transfer Failed!!!",
        Success: "Transfer Succeeded!!!",
        Disabled: "Cashless is not available!",
        InvalidPin: "Invalid Pin!",
        roundAmountMsg: "As the denom is {0},the input amount is rounded."
    }
};

if (!String.prototype.splice) {
    String.prototype.splice = function (start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

function screen(name, payload) {
    return { name, payload };
}

function displayValueInDollar(input) {
    if (input == "") {
        return "0.00"
    } else {
        var result = input.toString();

        while (result.length < 3) {
            result = "0" + result
        }
        var len = result.length;
        result = result.splice(len - 2, 0, ".");
        return result;
    }
}

const cashless = window['com.igt.cashless']("#app", {
    data() {
        return {
            currentScreen: "Initiate",
            centsInput: 0,
            amountRounded: 0,
            errorMessage: "",
            transferDirection: "toCard" ////"toCard" or "toMachine" or empty when on home page
        }
    },
    methods: {
        onCreditsToCard() {
            this.transferDirection = "toCard";
            this.currentScreen = 'ChoiceOnBalance';
        },
        onCreditsToMachine() {
            this.transferDirection = "toMachine";
            this.currentScreen = 'ChoiceOnBalance';
        },
        onBackApps() {
            //navigate('./session_screen.html');
            navigate('SESSION_SCREEN');
        },
        onToHome() {
            this.transferDirection = "";
            this.centsInput = 0;
            this.$store.dispatch('onToHome');
            this.currentScreen = 'Initiate';
        },
        onOtherBack() {
            this.centsInput = 0;
            this.$store.dispatch('onClearIntermediaValue');
            this.currentScreen = 'ChoiceOnBalance';
        },
        onBeforeConfirm() {
            this.amountRounded = this.centsInput;
            if(this.centsInput == 0){
                this.errorMessage = "Invalid Number";
                return;
            }

            var value = parseInt(this.centsInput)
            var maxToTransfer = this.maxBalance > this.allBalance ? this.allBalance : this.maxBalance;

            if (value > maxToTransfer) {
                var greaterMsg = "Can't transfer amount greater than $";
                this.errorMessage = greaterMsg.translate() + maxToTransfer / 100;
                return;
            }

            if (value < this.minBalance) {
                this.errorMessage = "The minimum is {0}{1}".translate().changePlaceholder(this.currencySymbol, this.minBalance/100)
                return;
            }

            if (this.needRoundInput()) {
                this.centsInput = this.roundAmount();
            }
            this.currentScreen = 'BeforeConfirm';
        },
        onOtherPressed() {
            this.currentScreen = 'Other';
        },
        onConfirm() {
            this.currentScreen = "Processing";
            if (this.transferDirection == "toCard")
                this.$store.dispatch('transferToCard', this.centsInput);
            else
                this.$store.dispatch('transferToMachine', this.centsInput);
        },
        allowTransfer(amount) {
            if (amount == 'all' || amount == 'other')
                return this.allBalance > 0 && this.allBalance >= this.minBalance && this.maxBalance > 0 && this.minBalance > 0;

            if (amount > this.maxBalance || amount < this.minBalance) {
                return false;
            }
            return this.allBalance >= amount;
        },
        allowInput: function allowInput(value) {
            if (value == 'clear') {
                return this.centsInput == 0 ? false : true;
            }
            if (value == 'back') {
                return this.centsInput > 0;
            }
            if (value == -1)
                return this.centsInput != "";

            var addedValue = this.centsInput + value.toString();
            return addedValue <= this.maxBalance && addedValue <= this.allBalance;
        },
        input: function input(value) {
            if (value == 'clear') {
                this.centsInput = 0;
                return;
            }
            if (value == 'back') {
                if (this.centsInput >= 10) {
                    var inputDigital = this.centsInput.toString();
                    this.centsInput = inputDigital.substr(0, (inputDigital.length - 1));
                } else {
                    this.centsInput = 0;
                }
                return;
            }

            if (this.centsInput == 0) {
                this.centsInput = value;
            }
            else {
                this.centsInput += value.toString();
            }
        },
        needRoundInput: function () {
            console.log("need round input")
            if (this.transferDirection == "toCard")
                return false;
            var denom = this.$store.state.cashlessBalance.egmDenom || 1;
            return this.amountRounded % denom != 0;
        },
        roundAmount: function roundAmount() {
            try {
                var amount = this.centsInput;
                var denom = this.$store.state.cashlessBalance.egmDenom;

                // var roundValue = Math.round(amount / denom) * denom;
                var floorValue = Math.floor(amount / denom) * denom;
                console.log("amount=" + amount + " denom" + denom + " floorValue:" + floorValue);
                var max = this.$store.state.cashlessBalance.maxToEgm;
                if (floorValue > max) {
                    console.log("the maxToEgm is less than amountInput.");
                    return Math.floor(max / denom) * denom;
                } else {
                    return floorValue;
                }
            } catch (e) {
                return this.centsInput;
            }
        },
        selectAmount: function selectAmount(amount) {
            this.centsInput = amount;
            this.onBeforeConfirm();
        }
    },
    computed: {
        shouldDisabled: function () {
            return !(this.$store.state.pinIsValid && this.$store.state.enabled);
        },
        displayValue: function () {
            return displayValueInDollar(this.centsInput);
        },
        egmBalanceInDollar: function () {
            return this.$store.state.isShowBalance ? displayValueInDollar(this.$store.state.cashlessBalance.egmCents) : 0;
        },
        cardBalanceInDollar: function () {
            return this.$store.state.isShowBalance ? displayValueInDollar(this.$store.state.cashlessBalance.cardCents) : 0;
        },
        balanceOnCardInDollar: function () {
            if (this.centsInput == "") {
                return "0.00"
            } else {
                var result = this.centsInput.toString();

                while (result.length < 3) {
                    result = "0" + result
                }
                var len = result.length
                console.log("displayValue,result=" + result + " " + typeof (result));
                result = result.splice(len - 2, 0, ".");
                console.log("result", result);
                return result;
            }
        },
        displayNotificationMessage: function () {
            var msg = statusMsg.info[this.currentScreen];
            if (this.currentScreen == "BeforeConfirm") {
                msg = statusMsg.info[this.currentScreen][this.transferDirection];
            }
            if (msg && String.prototype.translate) {
                msg = msg.translate();
                msg = "".changePlaceholder.call(msg, this.displayValue).translate();
            }
            return msg
        },
        roundAmountMsg: function () {
            var placeHolder = this.$store.state.currencySymbol + (this.$store.state.cashlessBalance.egmDenom / 100);
            var msg = statusMsg.info["roundAmountMsg"];
            if (msg && String.prototype.translate) {
                msg = msg.translate();
                msg = "".changePlaceholder.call(msg, placeHolder).translate();
            }
            return msg;
        },
        allBalance: function () {
            if (this.transferDirection == "toCard")
                return this.$store.state.cashlessBalance.egmCents;
            else
                return this.$store.state.cashlessBalance.cardCents;
        },
        maxBalance: function () {
            if (this.transferDirection == "toCard")
                return this.$store.state.cashlessBalance.maxFrEgm;
            else
                return this.$store.state.cashlessBalance.maxToEgm;
        },
        minBalance: function () {
            if (this.transferDirection == "toCard")
                return this.$store.state.cashlessBalance.minFrEgm;

            else {
                if (!this.$store.state.appConfig || !this.$store.state.appConfig.mapEgmDenomToMinCentsBalance)
                    return 0;

                let miniCents = this.$store.state.appConfig.mapEgmDenomToMinCentsBalance.default;
                if (this.$store.state.appConfig.mapEgmDenomToMinCentsBalance[this.$store.state.cashlessBalance.egmDenom])
                    miniCents = this.$store.state.appConfig.mapEgmDenomToMinCentsBalance[this.$store.state.cashlessBalance.egmDenom];

                if (miniCents > this.$store.state.cashlessBalance.minToEgm)
                    return miniCents;

                return this.$store.state.cashlessBalance.minToEgm;
            }
        },
        otherValueEnabled: function () {
            var balanceAll = this.maxBalance > this.allBalance ? this.allBalance : this.maxBalance;
            if (balanceAll <= 0 || this.minBalance > balanceAll)
                return false;

            return true;
        },
        AmountGroups: function () {
            if (!this.otherValueEnabled)
                return [];

            var balanceAll = this.maxBalance > this.allBalance ? this.allBalance : this.maxBalance;
            

            let quickAmounts = this.$store.state.appConfig.cashlessMapEgmDenomButtons.default;  
            if (this.$store.state.appConfig.cashlessMapEgmDenomButtons[this.$store.state.cashlessBalance.egmDenom])
                quickAmounts = this.$store.state.appConfig.cashlessMapEgmDenomButtons[this.$store.state.cashlessBalance.egmDenom];

            const availableItems = [];
            for(let i=0;i<quickAmounts.length;i++){
                let val = quickAmounts[i]/100;
              if(val < balanceAll)
              {
                  availableItems.push(val);
              }
            }

            balanceAll = balanceAll / 100;
            if (this.transferDirection == "toCard" && !availableItems.includes(balanceAll) && balanceAll != 0) {
                availableItems.push(balanceAll);
            }
            
            if (this.transferDirection == "toMachine" && !availableItems.includes(parseInt(balanceAll)) && parseInt(balanceAll) != 0) {
                availableItems.push(parseInt(balanceAll));
            }
            return availableItems;
        },
    }
});


cashless.watch((state) => state.transferResult, function (after) {
    console.log("transfer result change:", after)
    if (after == "SUCCESS") {
        cashless.vm.currentScreen = "Success";
    }
    else if (after == "FAIL") {
        cashless.vm.currentScreen = "Fail";
    }
})

cashless.watch("shouldDisabled", function (after) {
    console.log("should disabled:", after)
    if (after) {
        cashless.vm.currentScreen = "Disabled";
    }
    else
        cashless.vm.currentScreen = "Initiate";
})

