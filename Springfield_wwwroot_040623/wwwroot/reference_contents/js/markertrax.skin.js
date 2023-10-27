var helpModule = {
    computed: {},
    data() {
        return {
            errorMessage: ""
        };
    },
    state: {
        showBalances: false,//used to show balances screen
        showMTXInputPad:false,//used to enter pinpad input for a download
        showConfirm:false,//show confirm screen
        showOpDollar:false,//show dollar value
        showEnterButton: false,//show "Enter pin on egm" button
        showCancelButton: false,//show a cancel button
        showBackButton: false,//show a back button, will trigger timeout
        showWorkflowBackButton:false,//show a back button that navigates to an earlier part of the workflow
        navReturnToBalances:false,//when true, ensures a timeout navigates back to the balances screen.
        mobilePinAccepted: false,//used when a mobile pin is valid
        showCreditLine:false,//hide or show credit line
        showBalanceLine:false,//hide or show balance line
        currentNavigationState:"none",//tracks navigation through the app
        loadingMessage:"none",//message used when loading screen is shown
        opMessage:"none"//used for localization of operation-messages
    },
    components: {

    },
    methods: {
        showTransferFromCardTimeoutErrorMessage: function () {
            markertrax.state.showOpDollar = false;
            markertrax.state.navReturnToBalances = true;
            markertrax.state.opMessage = customMessages.cashless.failure;
            navigateInPage("#operation-message");
            clearTimeout(initiateTransferFromCardTimeout);
        },
        getDemoValidatePin: function(){
            console.log("Demo  Mode: Pin Response Occurred");
            markertrax.state.isPinValid = true;
            //you can cause an invalid pin for demos here:
            //displayOpMessage("Invalid Mobile Pin Etc");
            //markertrax.state.showEnterButton = true;
        },
        getDemoDownloadData: function () {
            return {
                "isSuccess": true,
                "ErrorCode": "111",
                "Message": "Marker transactions has been processed."
            };
        },
        getDemoBalanceData:function(){
            return {
                "isSuccess": true,
                "Message": "Information has been retrieved.",
                "player_card_number": "10004115",
                "name_first": "John",
                "name_last": "Smith",
                "advance_line_limit": 750.00,
                "available_line_limit": 549.13,
                "total_marker_balance": 200.87,
                "Data": [
                    {
                        "property_id": 118399936,
                        "marker_balance": -10972.24
                    },
                    {
                        "property_id": 123456,
                        "marker_balance": -511.00
                    }
                ]
            }
        },
        getDemoMobilePin:function(){
                console.log ("mobile pin call");
                markertrax.vm.handleMTXPin({
                    'cmd': 'mobilePin',
                    'ver': '1.0',
                    'mobilePin': {
                        'pin': '1234',
                        'nonce': 1,
                        'error': false
                    }
                });
        },
        handleMTXPin: function (mobilePinResponse) {
            //handles pin validation. mobilePinResponse is empty unless this is called through mobilepin workflow
            if (m.state.isDemo)
            {
                console.log ("Demo Mode: mock validation of pin... in "+(demoTimer/1000).toFixed(1)+" seconds see getDemoValidatePin to edit options");
                clearTimeout(demoTimeout);
                demoTimeout = setTimeout(function(){markertrax.vm.getDemoValidatePin();}, demoTimer);
                return;
            }
            if (markertrax.state.mobilePinAccepted) { //if we've already accepted a mobile pin, do nothing
                markertrax.state.checkingMobilePin = false;
                return;
            }
            var pinString;
            if (mobilePinResponse) {
                //if our mobile pin response is a blank pin, that's a pin cancel and we exit.
                if (!mobilePinResponse.mobilePin.pin || mobilePinResponse.mobilePin.pin.length === 0) {
                    exitApp();
                    return;
                }
                else{
                    pinString = mobilePinResponse.mobilePin.pin;
                }
            }
            var isMobilePin = (pinString && pinString.length > 0);

            IGTMediaElements.validatePin(pinString).then(function(status){
                if (status === IGTMediaElements.statuses.pin.validate[1]){
                    //success goes into watch state for isPinValid
                    markertrax.state.checkingMobilePin = false;
                    markertrax.state.mobilePinAccepted = isMobilePin;
                    markertrax.state.isPinValid = true;
                }
            }).catch(function(status){
                if (status === IGTMediaElements.statuses.pin.validate[2])
                {
                    if (isMobilePin){
                        clearTimeout(exitAppTimer);
                        exitAppTimer = setTimeout(() => {
                            exitApp();
                        }, markertrax.state.Options.timeoutInCardlessMilliseconds);
                        //Waits for a mobile pin response
                        markertrax.state.opMessage = customMessages.cardless.invalidPin;
                        waitForMobilePin();
                    }
                    else {
                        console.log ("recall");
                        markertrax.vm.handleMTXPin();
                    }
                }
                else {
                    IGTMediaElements.pinEntryComplete();
                    displayOpMessage(status);
                }
            });
        },
        getLockedNumbers() {
            let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            let invalidNumbers = [];

            numbers.forEach(number => {
                result = this.isAmountValid(number);
                if (!result.isValid) {
                    invalidNumbers.push(number);
                }
            })

            return invalidNumbers;

        },
        checkAndConvertToDecimal(value) {

            var amount = "";
            var input = this.DollarInput.toString();

            var idx = input.indexOf(".");
            if (idx === -1) {
                amount = input.substr(0, amount.length - 2) + "." + input.substr(amount.length - 2) + value;
                return amount;
            } else {
                var newAmount = input.split(".");
                if (newAmount[1].length >= 1) {
                    amount = newAmount[0] + newAmount[1].slice(0, 1) + "." + newAmount[1].slice(1) + value;
                }
                return amount;
            }
        },
        isAmountValid: function (value) {
            var result = {
                isValid: false,
                amount: 0
            }

            var prevAmount = this.DollarInput + value.toString();
            var nextAmount = this.checkAndConvertToDecimal(value.toString());

            if (nextAmount <= this.AvailableCredit) {
                result.isValid = true;
                result.amount = nextAmount;
            } else {
                result.amount = prevAmount;
            }

            return result;

        },
        removeStyleForInvalidNumbers() {
            let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            numbers.forEach(number => {
                $("#num-" + number).prop("disabled", false);
            });
        },
        lockPinPadNumbers(invalidNumbers) {
            this.removeStyleForInvalidNumbers();
            invalidNumbers.forEach(number => {
                $("#num-" + number).prop("disabled", true);
            });
            this.$store.state.invalidNumbers = invalidNumbers;
        },
        input: function (value) {
            this.analytics.trackPress("input", value);
            if (value == 'clear') {
                this.$store.state.DollarInput = 0;
                this.removeStyleForInvalidNumbers();
                this.$store.state.invalidNumbers = [];
                return;
            }
            if (value == 'back') {
                this.back_input();
                return;
            }

            var newAmount = this.isAmountValid(value);
            var invalidNumbers = [];

            // cancel the actions when click on invalid numbers
            isInvalidNumber = markertrax.state.invalidNumbers.find(number => number === parseInt(value));

            if (isInvalidNumber) return;

            if (this.DollarInput == 0) {
                if (newAmount.isValid) {
                    this.$store.state.DollarInput = newAmount.amount;
                    invalidNumbers = this.getLockedNumbers();
                    this.lockPinPadNumbers(invalidNumbers);
                }
            }
            else {
                if (this.DollarInput.length >= 8)
                    return;

                if (newAmount.isValid) {
                    this.$store.state.DollarInput = newAmount.amount;
                    var strAmount = this.DollarInput.toString().split(".");
                    if (strAmount.length > 1) {
                        if (strAmount[0].length > 1 && this.DollarInput[0] == "0") {
                            // Removing first ZERO at the left
                            strAmount = this.DollarInput.substring(1, this.DollarInput.length);
                            this.$store.state.DollarInput = strAmount;
                        }
                    }
                    invalidNumbers = this.getLockedNumbers();
                    this.lockPinPadNumbers(invalidNumbers);
                }
            }
        },
        back_input: function () {
            //undo last keypress on the pinpad for amounts
            var newAmount = this.DollarInput.toString();
            if (this.DollarInput > 0) {
                var idx = newAmount.indexOf(".");

                newAmount = newAmount.replace(".", "");

                tmpNewAmount = newAmount.split('');

                if (parseFloat(newAmount) >= 1) {
                    tmpNewAmount.splice(idx - 1, 0, ".");
                    newAmount = tmpNewAmount.join('');
                    newAmount = newAmount.substring(0, newAmount.length - 1);
                } else {
                    newAmount = tmpNewAmount.join('');
                }
            }

            this.$store.state.DollarInput = newAmount;

            if (this.DollarInput === ".") {
                this.$store.state.DollarInput = "0";
            } else {
                var strAmount = this.DollarInput.split(".");
                if (strAmount[0] == "") {
                    this.$store.state.DollarInput = "0" + this.DollarInput;
                }
            }
            if (parseFloat(this.DollarInput) == 0) {
                this.$store.state.DollarInput = "0";
            }
            var invalidNumbers = this.getLockedNumbers();
            this.lockPinPadNumbers(invalidNumbers);
        },
        resetMarkertraxComponents() {
            this.$store.state.DollarInput = "0";
            this.$store.state.invalidNumbers = [];
        },
        findStatusMessageByType(type, key){
          if (customMessages[type]){
              if (customMessages[type][key]){
                  return customMessages[type][key];
              }
          }
          return "";
        }
    },
    filters: {
        thousandsFormatFilter(value) {
            //Added to avoid null or undefined values.
            if((typeof value !== "number" && typeof value !== "string") || isNaN(value)){                
                value = 0;
            }
            if (value > 1000000) {
                return Math.floor(value / 1000000) + "M+";
            }
            return parseFloat(value*1).toFixed(2);
        }
    },
}

const markertrax = window['com.igt.markertrax']('#app', helpModule);

let customMessages ={ //note: this can be overwritten by available statusMap.json messaging, simply overwrite this obj
     general:{
         failure: "Sorry, Unable to Complete Operation."
     },
     cardless:{
         noCardless: "Sorry, MarkerTrax requires a Cardless Connection.",
         detection: "Cardless Session detected. Please Enter PIN on your Mobile Device.",
         invalidPin: "Your Cardless PIN was invalid. Please Try Again."
     },
     cashless:{
         noCashless: "Sorry, MarkerTrax is not available. Could not detect Cashless Account.",
         transfer: "Marker Has been downloaded. Transferring the following amount to your Machine:",
         success: "Your Marker was successfully downloaded to the game for a value of:",
         failure: "Your Marker was downloaded to your Cashless Account, but was not able to transfer to the EGM. Please use the Cashless App to transfer credits to your Machine."
     },
     balance:{
         103: "Unable to get Marker",
         failure: "Unable to Retrieve Balances.",
         update: "Updating Your Balances...",
         retrieval: "Retrieving Your Balances..."
     },
     download:{
         processing:"Downloading the following amount:",
         success:"Your Marker for the following amount was downloaded to the Machine:",
         100: "Invalid Token",
         101: "Invalid valid player card number",
         102: "Invalid Property",
         201: "Invalid transaction id",
         202: "Invalid amount",
         203: "Invalid session id",
         204: "Invalid asset id",
         205: "Invalid gaming date",
         206: "Line limit exceeded",
         207: "Transaction id already exist",
         208: "Unable to process download transaction"
     }
};

let exitAppTimer; //It will be used to activate a timer to automatically navigate to apps page
let markerTraxURL; //url filled by appconfig
let markerBalances; //object populated by getBalances
let jwtToken; //stores our generated jwtToken
let playerIdToken; //playerId used for MTX API requests
let session_id;//used in download calls. This is the cardinCount token 0x48
let asset_id;//used in download calls. This is token 0x10
let property_id;//used in download calls. will eventually be configured by appconfig

let stateLockForDemo = false; //used in demo mode to stop state from constantly refreshing while we update data
let demoTimer = 5000; //timer used for mock function delay
let demoTimeout; //used to handle pin functions

let initiateTransferFromCardTimeout;
let initiateTransferFromCardTimer = 60000;

//Watches for changes in Options state
markertrax.watch((state) => state.Options, function () {
   if (stateLockForDemo){
       return;
   }
   console.log ("Options loaded. Setting Variables");

   if (m.state.isDemo){
       console.log ("in Demo state... using mock functions");
   //set all demo variables here
       stateLockForDemo = true;
       playerIdToken = "10004115";
       session_id = "123";
       asset_id="10A45";
       markertrax.state.isCashlessAvailable = true;
       markertrax.state.isCardlessAvailable = true;
       markertrax.state.showCreditLine = true;
       markertrax.state.showBalanceLine = true;
       markertrax.state.showCreditLine = true;
       markertrax.state.Options ={
           onlyAllowCardlessMarkerTrax: false
       }
       markerTraxURL = "https://mtuacore-igt-sandbox.markertrax.io/IGT";
   }
   else{
       if (markertrax.state.appConfig.markerTraxOptions.showMarkerBalance){
           markertrax.state.showBalanceLine = markertrax.state.appConfig.markerTraxOptions.showMarkerBalance;
       }
       if (markertrax.state.appConfig.markerTraxOptions.showTotalCreditLine){
           markertrax.state.showCreditLine = markertrax.state.appConfig.markerTraxOptions.showTotalCreditLine;
       }
       markerTraxURL = markertrax.state.appConfig.markerTraxOptions.markertraxURL;
       playerIdToken = markertrax.state.playerId;
       asset_id = markertrax.state.assetId;
       IGTMediaElements.getCurrentTokenValue("0x48").then(function (tokenData) {
           session_id = tokenData.token.value;
           if (!session_id || session_id.length === 0 || session_id === "Unk Tok") {
             session_id = IGTMediaElements.util.generateTransactionId();
             IGTMediaElements.util.log.debug("MarkerTrax: Could not find Card insertion counter token (0x48) = "+ tokenData.token.value + " , set to GUID: "+ session_id);
           }
           //session_id = "123";
       });
           //asset_id="10A45";
   }

  ////TEST DATA
//markertrax.state.isCashlessAvailable = true;
//markertrax.state.isCardlessAvailable = true;
// playerIdToken = "10004115";//*/
////

  //If user is not in a cashless session
  if(!markertrax.state.isCashlessAvailable) {
    //Displays markertrax is not available screen (1B)
    displayMTXNotAvailable();
  }
  //If user is in a cardless + cashless session
  else if(markertrax.state.isCardlessAvailable && markertrax.state.isCashlessAvailable) {
    //If the onlyAllowCardlessMarkerTrax option is true in appconfig.json
    if(markertrax.state.Options.onlyAllowCardlessMarkerTrax) {
      //Displays cardless session detected screen with Enter button hidden(1A)
      displayCardlessSessionDetected(false);
    } else {
      //Displays cardless session detected screen with Enter button showing (1A)
      displayCardlessSessionDetected(true);
    }
  }
  //If user is in a carded + cashless session
  else if(!markertrax.state.isCardlessAvailable && markertrax.state.isCashlessAvailable) {
    //If the onlyAllowCardlessMarkerTrax option is true in appconfig.json
    if (markertrax.state.Options.onlyAllowCardlessMarkerTrax) {
      //Displays markertrax requires a cardless connection screen (1E)
      displayMTXRequiresCardless();
    } else {
      //Displays pin pad screen (1C)
      clearTimeout(exitAppTimer);
      markertrax.vm.handleMTXPin();
    }
  }
});

//Watches for changes in showBackButton state
markertrax.watch((state) => state.showBackButton, function () {
  //If showBackButton state
  if(markertrax.state.showBackButton) {
      //don't time out once we make it to the balances screen
      if (markertrax.state.currentNavigationState !== "#mtx-workflow") {
          setExitTimeout();
      }
  }
});

//Watches for changes in navReturnToBalances state
markertrax.watch((state) => state.navReturnToBalances, function () {
    //If navReturnToBalances state
    if(markertrax.state.navReturnToBalances) {
        setExitTimeout();
    }
});

//Watches for changes in isPinValid state
markertrax.watch((state) => state.isPinValid, function () {
  //If the PIN entered is valid
  if (markertrax.state.isPinValid) {
    //Gets markertrax balances
    getBalances();
  }
  else {
    //Display pin error screen (1D)
    displayOpMessage();
  }
})

function navigateInPage(el) {
  markertrax.state.currentNavigationState = el;
  if (markertrax.state.currentNavigationState === "#mtx-loading"){
      markertrax.state.isLoading = true;
  }
  else{
      markertrax.state.isLoading = false;
  }
  $(".page").hide();
  $(el).css("display", "flex")
  TweenMax.staggerFrom(el, 0.7, { alpha: 0 }, 0.2); //
}

function handlePinFromButton(){
    IGTMediaElements.cancelMobilePin();
    markertrax.state.checkingMobilePin = false;
    clearTimeout(exitAppTimer);
    markertrax.vm.handleMTXPin();
}
//set timeout to nav back
function setExitTimeout(customTimer){
    if (!customTimer){
        if (m.state.isDemo){
            customTimer = 6000;
        }
        else {
            customTimer = markertrax.state.appConfig.markerTraxOptions.redirectTimeOutMilliseconds;
        }
    }
    clearTimeout(exitAppTimer);
    exitAppTimer = setTimeout(() => {
        if(markertrax.state.navReturnToBalances){
            getBalances();
        }
        else{
          exitApp();
       }
    }, customTimer);
}
//Navigates back to apps page
function exitApp() {
  markertrax.analytics.trackPress("exit");
  if (m.state.isDemo){
    console.log ("Demo Mode: exit to ./apps.html Triggered. Ignoring for Demo Mode");
  }
  else {
      if (markertrax.state.checkingMobilePin){
        IGTMediaElements.cancelMobilePin();
      }
      markertrax.navigate('./apps.html');
  }
}

//Display the MarkerTrax is not available message (1B)
function displayMTXNotAvailable() {
  markertrax.state.opMessage = customMessages.cashless.noCashless;
  markertrax.state.showBackButton = true;
  navigateInPage("#operation-message");
}

//Display player is using a physical card message (1E)
function displayMTXRequiresCardless() {
  markertrax.state.opMessage = customMessages.cardless.noCardless;
  markertrax.state.showBackButton = true;
  navigateInPage("#operation-message");
}

//Display the player was detected in a Cardless session message (1A)
function displayCardlessSessionDetected(shouldShowEnterButton) {
  markertrax.state.checkingMobilePin = true;
  let exitTimeOut = 0;
  markertrax.state.opMessage = customMessages.cardless.detection;
  markertrax.state.showEnterButton = shouldShowEnterButton;
  markertrax.state.showCancelButton = true;

  //Checks if timeoutInCardless in appconfig is not null, undefined,0 nor negative
  if(markertrax.state.Options.timeoutInCardlessMilliseconds === null
    || markertrax.state.Options.timeoutInCardlessMilliseconds === undefined
    || markertrax.state.Options.timeoutInCardlessMilliseconds <= 0)
  {
    exitTimeOut = 40000;
  } else {
    exitTimeOut = markertrax.state.Options.timeoutInCardlessMilliseconds;
  }
  //Sets the timer that waits for mobile pin pad response configures in appconfig
  setExitTimeout(exitTimeOut);
  //Displays screen 1A

  navigateInPage("#operation-message");
  //Waits for mobile pin pad response
  waitForMobilePin();
}

//Display the PIN failure message (1D)
function displayOpMessage(errorMsg) {
  //If errorMsg was not set, displays default error message
  if (!errorMsg){
      markertrax.state.opMessage = customMessages.general.failure;
  }
  else {
      markertrax.state.opMessage = errorMsg;
  }
  //Hides Enter and Cancel buttons, and shows Back button
  markertrax.state.showEnterButton = false;
  markertrax.state.showCancelButton = false;
  if (!markertrax.state.navReturnToBalances) {
      markertrax.state.showBackButton = true;
  }
  navigateInPage('#operation-message');
}

//display the balances and landing page (2c)
function displayMTXWorkflow(balanceObjects){
    if (!balanceObjects){
        balanceObjects = markerBalances;
    }
    markertrax.state.TotalCreditLine = balanceObjects.advance_line_limit;
    markertrax.state.AvailableCredit = balanceObjects.available_line_limit;
    markertrax.state.MarkerBalance = balanceObjects.total_marker_balance;

    var isButtonDisabled = !markertrax.state.AvailableCredit || markertrax.state.AvailableCredit <= 0;
    $("#btn-download-marker").attr("disabled", isButtonDisabled);

    markertrax.state.showBalances = true;
    markertrax.state.showMTXInputPad = false;
    markertrax.state.showBackButton = true;
    markertrax.state.showWorkflowBackButton = false;
    clearTimeout(exitAppTimer);
    navigateInPage("#mtx-workflow");
}

//show the pinpad to enter amounts after hitting download marker
function displayMTXInputPad(){
    markertrax.state.showMTXInputPad = true;
    markertrax.state.showBackButton = false;
    markertrax.state.showWorkflowBackButton = true;
    markertrax.state.showConfirm = false;
    markertrax.state.showBalances = true;
    $('#enterValueButton').prop("disabled", (markertrax.state.DollarInput === '0' || markertrax.state.DollarInput == 0));
}
//confirmation page workflow (2E)
function enterMTXValueToConfirm(){
   markertrax.state.showBalances = false;
   markertrax.state.showMTXInputPad = false;
   markertrax.state.showConfirm = true;
   markertrax.state.showWorkflowBackButton = false;

}
//begin transfer process
function downloadMTXToCashless(){
  markertrax.state.showOpDollar = true;
  markertrax.state.loadingMessage = customMessages.download.processing;
  navigateInPage("#mtx-loading");
  downloadMarker();
}

//get request Options with jwtToken
function buildRequestOptions(RequestType, bodyObj){

    jwtToken = IGTMediaElements.util.generateJWT(playerIdToken);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwtToken);
    myHeaders.append("Content-Type", "application/json");

    // integrity and credentials are not adding new behavior
    var requestOptions = {
        method: RequestType,
        headers: myHeaders,
        redirect: 'follow'
    };
    if (bodyObj){
        requestOptions.body = bodyObj;
    }
    return requestOptions;
}

function downloadMarker(){
    markertrax.state.showBackButton = false;
    if (m.state.isDemo){
        var downloadData = markertrax.vm.getDemoDownloadData();
        console.log("Demo Mode: passing download data in "+(demoTimer/1000).toFixed(1)+" seconds: "+ JSON.stringify(downloadData));
        setTimeout(function(){
            processDownload(downloadData);
        }, demoTimer);
        return;
    }
    property_id = markertrax.state.appConfig.markerTraxOptions.propertyId;
    let amount = markertrax.state.DollarInput;
    let headerObject = new Headers();
    var currentDate = new Date();

    currentDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60 * 1000));
    var transaction_timestamp = currentDate.toISOString();
    transaction_timestamp = transaction_timestamp.replace("/", "-");
    transaction_timestamp = transaction_timestamp.substring(0, 19);
    let transaction_id = IGTMediaElements.util.generateTransactionId();
    let bodyObject = JSON.stringify({ transaction_id, amount, session_id, asset_id, transaction_timestamp });;
    IGTMediaElements.util.log.debug("MarkerTrax: Attempting to download with body object: " + bodyObject);
    let requestOptions = buildRequestOptions('POST', bodyObject);

    fetch(markerTraxURL + "/downloadMarker/" + playerIdToken + "/" + property_id, requestOptions)
        .then(response => response.text())
            .then(result => {
                let processedResult = JSON.parse(result);
                processDownload(processedResult);
            }).catch(error => {
                markertrax.state.navReturnToBalances = true;
                //Send to screen 3B with generic message
                displayOpMessage(error);
            });
}

function processDownload(processedResult){
    //handle object response
    markertrax.state.showOpDollar = false;
    if (processedResult.isSuccess) {
      markertrax.state.loadingMessage = customMessages.cashless.transfer;
      markertrax.state.showOpDollar = true;

      let value = parseInt((markertrax.state.DollarInput * 100).toFixed(2));
      clearTimeout(exitAppTimer);
      if (m.state.isDemo){
        console.log("sending success in "+(demoTimer/1000).toFixed(1)+" seconds");
        setTimeout(function(){
          markertrax.state.navReturnToBalances = true;
          displayOpMessage(customMessages.cashless.success);
        }, demoTimer);
      }
      else {

        clearTimeout(initiateTransferFromCardTimeout);
        initiateTransferFromCardTimeout = setTimeout(function(){markertrax.vm.showTransferFromCardTimeoutErrorMessage();}, initiateTransferFromCardTimer);

        IGTMediaElements.cashless.initiateTransferFromCard(value, false)
          .then(function (data) {
            clearTimeout(initiateTransferFromCardTimeout);
            markertrax.state.navReturnToBalances = true;
            if (data.status === 0) {
              displayOpMessage(customMessages.cashless.success);
            }
            else {
              displayOpMessage(customMessages.cashless.failure);
            }
          }).catch(error => {
            clearTimeout(initiateTransferFromCardTimeout);
          markertrax.state.showOpDollar = false;
        displayOpMessage(error);
      });
      }
    } else {
      //Send to screen 3B
      markertrax.state.navReturnToBalances = true;
      var customError = markertrax.vm.findStatusMessageByType('download', processedResult.ErrorCode);
      if (customError.length > 0){
        displayOpMessage(customError);
      }
      else{
        displayOpMessage(processedResult.Message);
      }
    }
}

function getBalances() {
    markertrax.state.showOpDollar = false;
    markertrax.state.navReturnToBalances = false;
    markertrax.state.showConfirm = false;
    markertrax.vm.resetMarkertraxComponents();

    if (markerBalances){//if we've already retrieved it, we're going to say we're updating
        markertrax.state.loadingMessage = customMessages.balance.update;
    }
    else {
        markertrax.state.loadingMessage = customMessages.balance.retrieval;
    }

    navigateInPage("#mtx-loading");

    if (m.state.isDemo){
        var balanceData = markertrax.vm.getDemoBalanceData();
        console.log ("Demo Mode: Balance data will be supplied in "+(demoTimer/1000).toFixed(1)+" seconds: " + JSON.stringify(balanceData));
       setTimeout(function(){processBalances(balanceData);}, demoTimer);
       return;
    }
    var requestOptions = buildRequestOptions('GET');
    var markerTraxBalancesURL = markerTraxURL+"/markerbalance/" + playerIdToken;

    fetch(markerTraxBalancesURL, requestOptions)
        .then(response => response.text())
            .then(result => {
                var processedResult = JSON.parse(result)
                processBalances(processedResult);
            })
            .catch(error => {
                markertrax.state.opMessage = customMessages.balance.failure;
                markertrax.state.showBackButton = true;
                navigateInPage("#operation-message");
            });
}

function processBalances(processedResult){
    if (processedResult.isSuccess){
        markerBalances = null;
        markerBalances = processedResult;
        displayMTXWorkflow(markerBalances);
    }else{
        var customError = markertrax.vm.findStatusMessageByType("balances", processedResult.ErrorCode);
        if (customError.length > 0){
            markertrax.state.opMessage = customError;
        }
        else{
            markertrax.state.opMessage = processedResult.Message;
        }

        markertrax.state.showBackButton = true;
        navigateInPage("#operation-message");
    }
}

//called to initate mobile pin workflow
function waitForMobilePin () {
  try {
    if(m.state.isDemo) {
      //publish a mock response
        markertrax.vm.getDemoMobilePin();
    }
    else{
        IGTMediaElements.getMobilePin('MarkerTrax is Requesting your PIN', markertrax.vm.handleMTXPin);
    }
  } catch(err) {
    displayOpMessage();
  }

}
