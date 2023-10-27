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
statusMsgMap[statusEnum.waiting] = "waiting";
statusMsgMap[statusEnum.valid] = "valid";
statusMsgMap[statusEnum.invalid] = "invalid PIN";
statusMsgMap[statusEnum.locked] = "PIN locked";
statusMsgMap[statusEnum.noResponse] = "no-response; try again";
statusMsgMap[statusEnum.canceled] = "PIN Entry Canceled";
statusMsgMap[statusEnum.validating] = "Validating pin...";
statusMsgMap[statusEnum.empty] = "Invalid empty password";
statusMsgMap[statusEnum.default] = "ENTER YOUR PIN";

const VPCPin = window["com.igt.vpc_pin"]("#app", {
  data() {
    return {
      Status: "default",
      buttonDisabled: false,
    }
  },
  computed: {
    InteractiveMessage() {
      if (statusMsgMap.hasOwnProperty(this.Status))
        return statusMsgMap[this.Status];

      return statusMsgMap.unknownError;
    }
  },
  methods: {
    pressDigit: function (number) {
      if(this.$store.state.Password.length < 4){
        this.$store.state.Password += number;
        this.Status = statusEnum.default;
      }
    },

    validate: function () {
      if (this.$store.state.Password.length == 0) {
        this.Status = statusEnum.empty;
      } else {
        this.Status = statusEnum.validating;
        this.$store.dispatch("validatePin");
      }
    },

    clearPinPad: function () {
      this.$store.state.Password = "";
      this.Status = statusEnum.default;
    },

    backSpace: function () {
      this.$store.state.Password = this.$store.state.Password.slice(0, -1);
    },
  },

  watch: {
    screenId(newVal) {
      if (newVal === null || newVal === undefined)
        return;
      switch (newVal) {
        case '0x94':
          this.Status = statusEnum.default;
          break;
        case '0x95':
          this.Status = statusEnum.validating;
          break;
        case '0x96':
          this.Status = statusEnum.locked;
          this.buttonDisabled = true;
          break;
        case '0x97':
          this.Status = statusEnum.invalid;
          break;
      }
    },
  }
});
