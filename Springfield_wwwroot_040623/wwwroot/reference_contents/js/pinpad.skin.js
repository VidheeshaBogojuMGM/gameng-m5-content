//Status keys from 0 to 5 are defined by M5, and not supposed to change.
//Others are self defined, can be updated accordingly as well as all the description.
const statusEnum = {
  waiting: "waiting",
  valid: "valid",
  invalid: "invalid PIN",
  locked: "PIN locked",
  noResponse: "no-response; try again",
  canceled: "PIN Entry Canceled",

  validating: "validating",
  empty: "empty",
  default: "default" 
};

const statusMsgMap = {
  unknownError: "Pin validation failed with unknown error, try again later."
};

var checkHiddenLockInterval;
var self;
var cancelTimeout;

statusMsgMap[statusEnum.waiting] = "waiting";
statusMsgMap[statusEnum.valid] = "valid";
statusMsgMap[statusEnum.invalid] = "invalid PIN";
statusMsgMap[statusEnum.locked] = "PIN locked";
statusMsgMap[statusEnum.noResponse] = "no-response; try again";
statusMsgMap[statusEnum.canceled] = "PIN Entry Canceled";
statusMsgMap[statusEnum.validating] = "Validating pin, please do not remove the card.";
statusMsgMap[statusEnum.empty] = "Invalid empty password";
statusMsgMap[statusEnum.default] = "ENTER YOUR PIN";

const pinpad = window["com.igt.pinpad"]("#app", {
  data() {
    return {
      showEnterButton: true,
    }
  },
  computed: {
    buttonDisabled: function () {
      return this.$store.state.Status == statusEnum.validating || this.$store.state.Status == statusEnum.locked;
    },
  },
  getters: {
    InteractiveMessage(state) {
      if (statusMsgMap.hasOwnProperty(state.Status))
        return statusMsgMap[state.Status];

      return statusMsgMap.unknownError;
    },
    NormalStatus(state) {
      return (state.Status == statusEnum.default || state.Status == statusEnum.valid || state.Status == statusEnum.validating)
    },
  },
  methods: {

    pressDigit: function (number) {
      if(this.$store.state.Password.length < 4){
        this.$store.state.Password += number;
        this.$store.state.Status = statusEnum.default;
        this.showEnterButton = true; 
      }

      if(this.$store.state.Password.length == 4)
        this.showEnterButton = false;

      this.filledPinsValue();
      //this.clearPressedPinPad();
      //document.querySelector(`#_btn${number}`).classList.add('pressed');

    },
    windowsBack: function() {
      this.cancelPin();
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

    validate: function () {
      this.clearPressedPinPad();
      if (this.$store.state.Password.length == 0) {
        this.$store.state.Status = statusEnum.empty;
      } else {
        this.$store.state.Status = statusEnum.validating;
        this.$store.dispatch("ValidatePin");
        this.clearPinPad();
      }
      this.showEnterButton = true; 
    },

    clearPinPad: function () {
      this.$store.state.Password = "";
      this.$store.state.Status = statusEnum.default;
      this.showEnterButton = true;
      var filledPins = document.querySelector('.password-container');
      if(filledPins)
      {
        for(var i= 0; i < filledPins.children.length; i++) {
          filledPins.children[i].classList.remove('filled')
        }
      }
      this.clearPressedPinPad();
    },

    backSpace: function () {
      var filledPassword =  document.getElementById(`pin-value-${this.$store.state.Password.length}`);
      if(filledPassword) {
        filledPassword.classList.remove('filled');
      }
      this.$store.state.Password = this.$store.state.Password.slice(0, -1);
      this.showEnterButton = true; 
      this.clearPressedPinPad();
    },

    cancelPin: function () {
      this.$store.dispatch("CancelPin");
      this.clearPinPad();
    },

    filledPinsValue: function () {
      var pinField = document.getElementById(`pin-value-${this.$store.state.Password.length}`);
      if(pinField) {
        pinField.classList.add("filled");
      }
    }
  },

  watch: {
    Status: function (newValue, _oldValue) {
      if (newValue == statusEnum.locked) {
          self = this;
          checkHiddenLockInterval = -1;
          cancelTimeout = setTimeout(() => { this.cancelPin(); clearInterval(checkHiddenLockInterval); console.log ("normal flow")}, 5000);
          checkHiddenLockInterval = setInterval(function(){
            if (window.frameElement.style.display === "none"){
               clearInterval(checkHiddenLockInterval);
               clearTimeout(cancelTimeout);
               self.cancelPin();
            }
          }, 500);

      } else if (newValue == statusEnum.valid) {
        this.clearPinPad();
      }
    }
  }
});
