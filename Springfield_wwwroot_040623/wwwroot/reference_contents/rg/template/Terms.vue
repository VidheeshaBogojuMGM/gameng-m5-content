<template>
  <div class="page-content">
    <div>
      <p class="display-1 font-weight-bold font-green">
        {{ $root.appTitle.toUpperCase() }} IS A GUIDE.
      </p>
      <div v-show="pageIndex == 0">
        <p class="body-1">Ultimately, how much you gamble is your choice.</p>
        <p class="body-1">
          {{ $root.appTitle }} does not guarantee you will stick to the budget
          you set.
        </p>
      </div>
      <div v-show="isShowNextPage">
        <p class="body-1">
          Using {{ $root.appTitle }} doesn't mean you won't lose money.
        </p>
        <p
          class="body-1"
          v-if="$root.playerInfo && $root.playerInfo.casinoName"
        >
          {{ $root.appTitle }} will only involve your play at
          {{ $root.playerInfo.casinoName }}.
        </p>
      </div>
      <div v-if="$root.isHorizScreen" class="scroll-btn-group">
        <a
          class="btn-icon"
          @click="pageUp()"
          :class="{ disabled: pageUpDisable }"
        >
          <span class="icon i-up"></span>
        </a>
        <a
          class="btn-icon"
          @click="pageDown()"
          :class="{ disabled: pageDownDisable }"
        >
          <span class="icon i-down"></span>
        </a>
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
  data() {
    return {
      pageIndex: 0,
      pinDialogShow: { dialog: false },
      isHorizRotateRatio:
        this.$root.isHorizScreen && window.innerWidth / window.innerHeight < 7,
    };
  },

  beforeCreate() {
    let v = this;
    this.$root.title = "TERMS AND CONDITIONS";
    this.$root.buttons = [
      {
        text: "BACK",
        iconClass: "i-back",
        onclick: function () {
          v.$router.push("index");
        },
      },
      {
        text: "NEXT",
        iconClass: "i-next",
        onclick: function () {
          v.clickNext();
        },
      },
    ];
  },
  computed: {
    pageUpDisable: function () {
      return this.pageIndex === 0;
    },
    pageDownDisable: function () {
      return this.pageIndex === 1;
    },
    isShowNextPage: function () {
      return this.$root.isHorizScreen ? this.pageIndex == 1 : true;
    },
  },

  methods: {
    pageUp: function () {
      if (this.pageIndex > 0) {
        this.pageIndex = 0;
      }
    },
    pageDown: function () {
      if (this.pageIndex === 0) {
        this.pageIndex = 1;
      }
    },
    clickNext: function () {
      if (this.$root.config.playerPinEnable && !this.$root.isPinVerified) {
        this.pinDialogShow.dialog = true;
      } else {
        this.$router.push("budget");
      }
    },
    pinCallback: function (result) {
      if (result) {
        this.$root.isPinVerified = true;
        this.$router.push("budget");
      }
    },
  },
};
</script>