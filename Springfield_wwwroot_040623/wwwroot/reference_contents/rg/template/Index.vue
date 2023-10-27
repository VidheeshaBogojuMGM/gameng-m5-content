<template>
  <div style="width: 100%; height: 100%">
    <component v-bind:is="view"></component>
    <div class="page-content" v-if="showError">
      <div class="content-text">
        <p class="display-1 font-weight-bold">Connect B2E failed.</p>
      </div>
    </div>
    <customer-pinpad
      :input-data="pinDialogShow"
      v-on:onapply="pinCallback"
    ></customer-pinpad>
  </div>
</template>
<script>
module.exports = {
  name: "App",
  data: function () {
    return {
      view: "",
      showError: false,
      pinDialogShow: { dialog: false },
    };
  },
  beforeCreate() {
    let vm = this;
    vm.$root.getPlayerId().then(
      function (playerId) {
        vm.$root.getDeviceId().then(
          function (deviceId) {
            if (playerId && playerId != "0") {

              vm.$root.service.getPlayerInfo(playerId, deviceId).then(
                function (response) {
                  vm.$root.playerInfo = response.data;
                  vm.$root.playerInfo.deviceId = deviceId;
                  if (vm.$root.playerInfo.status == 1) {
                    if (vm.$root.config.playerPinEnable && !vm.$root.isPinVerified) {
                      vm.pinDialogShow.dialog = true;
                    } else {
                      vm.view = "view-tracking";
                    }
                  } else {
                    vm.view = "view-introduce";
                  }
                  if (vm.$root.updateNotify && vm.$root.playerInfo.personId) {
                    vm.$root.service
                      .updateEnrollmentNotifyDateTime(vm.$root.playerInfo.personId)
                      .then((res) => {
                        console.log("notify update success;");
                      });
                  }
                },
                function () {
                  vm.showError = true;
                }
              );
              
            } else {
              vm.view = "view-introduce";
            }
          },
          function () {
            vm.showError = true;
          }
        );
      },
      function () {
        vm.showError = true;
      }
    );
  },
  methods: {
    pinCallback: function (result) {
      if (result) {
        this.$root.isPinVerified = true;
        this.view = "view-tracking";
      }
    },
  },
};
</script>
