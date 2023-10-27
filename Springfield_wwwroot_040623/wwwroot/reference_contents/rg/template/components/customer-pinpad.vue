<template>
  <div class="kb modalbg" v-bind:class="{ active: inputData.dialog }">
    <div class="dialog">
      <div class="dialog-body">
        <div class="kb-title">
          <p>Please enter your PIN to continue.</p>
          <input id="pinEntry" type="password" v-model="password" />
          <p class="error">{{ errorMsg }}</p>
        </div>
        <hr class="diver" />
        <table v-if="screenType === 1">
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('1')">1</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('2')">2</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('3')">3</button>
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('4')">4</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('5')">5</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('6')">6</button>
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('7')">7</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('8')">8</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('9')">9</button>
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('del')">
                BACK
              </button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('0')">0</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('clear')">
                CLEAR
              </button>
            </td>
          </tr>
        </table>
        <table v-else-if="screenType === 2">
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('1')">1</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('2')">2</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('3')">3</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('4')">4</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('5')">5</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('del')">
                BACK
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('6')">6</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('7')">7</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('8')">8</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('9')">9</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('0')">0</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('clear')">
                CLEAR
              </button>
            </td>
          </tr>
        </table>
        <table v-else>
          <tr>
            <td>
              <button class="btn-outline btn-kb" @click="input('1')">1</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('2')">2</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('3')">3</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('4')">4</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('5')">5</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('6')">6</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('7')">7</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('8')">8</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('9')">9</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('0')">0</button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('del')">
                BACK
              </button>
            </td>
            <td>
              <button class="btn-outline btn-kb" @click="input('clear')">
                CLEAR
              </button>
            </td>
          </tr>
        </table>
        <hr class="diver" />
        <div class="dialog-footer">
          <button
            type="button"
            class="btn-flat-kb"
            v-on:click="inputData.dialog = false"
          >
            CANCEL
          </button>
          <button
            type="button"
            class="btn-flat-kb float-right"
            v-on:click="apply()"
            :disabled="applyDisabled"
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "App",
  props: {
    inputData: { dialog: false },
  },
  data() {
    return {
      errorMsg: "",
      password: "",
      pwdMaxLength: this.$root.config.passwordLength || 8,
      result: 0,
      applyDisabled: false,
    };
  },

  computed: {
    screenType: function () {
      this.result = Math.round(window.innerWidth / window.innerHeight);
      if (
        this.result === 3 ||
        this.result === 4 ||
        this.result === 5 ||
        this.result === 6
      ) {
        if (this.$root.isPortrait()) {
          return 1;
        } else {
          return 2;
        }
      } else if (this.result === 7 || this.result === 8 || this.result === 10) {
        return 3;
      } else {
        return 1;
      }
    },
  },

  methods: {
    input: function (val) {
      if (this.errorMsg) {
        this.errorMsg = "";
        this.password = val == "del" ? this.password : "";
      }
      if (val == "clear") this.password = "";
      else if (val == "del") {
        if (this.password.length > 1)
          this.password = this.password.slice(0, -1);
        else this.password = "";
      } else {
        this.password =
          this.password.length >= this.pwdMaxLength
            ? this.password
            : this.password + val;
      }
    },
    apply: function () {
      let vm = this;
      vm.applyDisabled = true;
      vm.errorMsg = "";
      console.log("PIN validation");     
      let playerId = vm.$root.playerInfo.cmsPlayerId;
      let validatePin;
      
      if (vm.$root.isLoggedIn()) {
        validatePin = vm.$root.service.validatePin(playerId, this.password);
        IGTMediaElements.statuses = {
          pin:{
            validate:{
              "1": "valid",
              "2": "invalid PIN",
              "3": "PIN locked"
            }
          }
        }
      } else {
        validatePin = IGTMediaElements.validatePin(this.password, false, true);
      }

      validatePin.then(function (status) {
        console.log("Inside validatePin " + JSON.stringify(status));
        status = status.data? status.data: status;
        if (status == IGTMediaElements.statuses.pin.validate["1"]) {
          vm.inputData.dialog = false;
          vm.$emit("onapply", true);
        } else if (status == IGTMediaElements.statuses.pin.validate["2"]) {
          vm.errorMsg = "Invalid PIN";
        } else if (status == IGTMediaElements.statuses.pin.validate["3"]) {
          vm.errorMsg = "PIN Locked";
        }
        vm.applyDisabled = false;
      })
      .catch(function (status) {
        console.log ("Inside Validate Pin Failure " + JSON.stringify(status));
        if (status == IGTMediaElements.statuses.pin.validate["2"]) {
          vm.errorMsg = "Invalid PIN";
        } else if (status == IGTMediaElements.statuses.pin.validate["3"]) {
          vm.errorMsg = "PIN Locked";
        } else {
          vm.errorMsg = status;
        }
      });
      vm.applyDisabled = false;
    },
  },
  watch: {
    inputData: {
      handler: function () {
        this.errorMsg = "";
        this.password = "";
      },
      deep: true,
    },
  },
};
</script>
<style>
#pinEntry {
  background-color: rgba(0, 0, 0, 0);
  font-size: 2em;
  text-align: center;
  outline: medium;
  border: none;
  width: 100%;
}
</style>
