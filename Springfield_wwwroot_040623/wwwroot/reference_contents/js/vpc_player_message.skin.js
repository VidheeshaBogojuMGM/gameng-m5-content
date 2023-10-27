const VPC = window['com.igt.vpc']("#app", {
    data() {
        return {
            PlayerMessage: "",
            PromptMessage: "",
        }
    },
    methods: {
        okBtn() {
            IGTMediaElements.vpc.buttonPress('VPC_KEYPRESS_A');
        },
        showokBtn(){
            $(".oKBtn").css("visibility", `visible`);  
        },
        hideokBtn(){
            $(".oKBtn").css("visibility", `hidden`);  
        },
        translateMsg(msg){
            if ( msg && String.prototype.translate)
                return msg.translate();
            return msg;
        },  
    },

});

VPC.watch((state) => [state.screenId, state.displayMessage], function (after, before) {
    if (after[0] === undefined) return;
    VPC.vm.showokBtn();

    var scid = after[0].toLowerCase();
    if (scid === '0xa9'){
        // VPC Statement Available
        VPC.vm.PromptMessage = VPC.vm.translateMsg("Statement available");
        VPC.vm.PlayerMessage = VPC.vm.translateMsg("Your activity statement is now available. To see details visit www.yourpla.com.au.");
    }else if (scid === '0xa8'){
        // VPC remove card ,no ok button
        VPC.vm.PromptMessage = VPC.vm.translateMsg("Please remove your card");
        VPC.vm.PlayerMessage = VPC.vm.translateMsg("Thank you for using YourPlay");
        VPC.vm.hideokBtn();
    }else if (scid === '0xaa'){
        // VPC Login Timeout
        VPC.vm.PromptMessage = VPC.vm.translateMsg("Login timed out");
        VPC.vm.PlayerMessage = VPC.vm.translateMsg("Please re-insert your card to continue.");
    }else if (scid === '0xae'){
        // VPC Card Removed
        VPC.vm.PromptMessage = VPC.vm.translateMsg("Card removed");
        VPC.vm.PlayerMessage = VPC.vm.translateMsg("Thank you for using YourPlay");
    }else{
        const displayMessage = after[1];
        if (displayMessage && displayMessage.length > 1 && displayMessage.indexOf('@') !== -1) {    
            var msgArray = displayMessage.split('@');
            var screenIds = ['0x99','0x9a','0x9b','0x9e','0xa6'];

            if (screenIds.includes(scid)){
                VPC.vm.PromptMessage = msgArray[0];  
                VPC.vm.PlayerMessage = msgArray[1];
            }
        }else{
            VPC.vm.PlayerMessage = displayMessage;

            switch(scid){
                case '0x99':
                    // VPC Host down
                    VPC.vm.PromptMessage = VPC.vm.translateMsg("YourPlay is current unavailable");          
                    break;
                case '0x9a':
                    // VPC Invalid Card
                    VPC.vm.PromptMessage = VPC.vm.translateMsg("Invalid Card");         
                    break; 
                case '0x9b':
                    // VPC Account Cancelled Setup 
                    VPC.vm.PromptMessage = VPC.vm.translateMsg("Account cancelled");             
                    break;
                case '0x9e':
                    // VPC Card In Use 
                    VPC.vm.PromptMessage = VPC.vm.translateMsg("Account in use");             
                    break;
                case '0xa6':
                    // VPC Abandoned Card Setup 
                    VPC.vm.PromptMessage = VPC.vm.translateMsg("Abandoned card");              
                    break;

            }
        }
    }
}) 
