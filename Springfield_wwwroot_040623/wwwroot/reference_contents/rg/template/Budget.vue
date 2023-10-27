<template>
  <div class="page-content">
    <div class="budget-title">
      <span class="display-1 font-weight-bold font-green">
        HOW MUCH DO YOU WANT TO SPEND?
      </span>
      <div
        class="switch-container"
        v-if="$root.config.alertSwitchVisible && $root.isHorizScreen"
      >
        <span class="switch-text">ALERT</span>
        <div class="switch-item-group">
          <input
            id="checked_alert"
            type="checkbox"
            class="switch-ckb"
            v-model="alertEnable"
          />
          <label for="checked_alert"></label>
        </div>
      </div>
    </div>
    <div class="budget">
      <div class="budget-group">
        <div class="budget-group-title">DAILY</div>
        <div class="budget-group-set">
          <div class="budget-group-set-text">{{ format(dailyValue) }}</div>
          <button type="button" class="btn ripple" @click="setBudget('daily')">
            <span class="icon i-set"></span><span class="btn-text">SET</span>
          </button>
        </div>
      </div>
      <div class="budget-group">
        <div class="budget-group-title">WEEKLY</div>
        <div class="budget-group-set">
          <div class="budget-group-set-text">{{ format(weeklyValue) }}</div>
          <button type="button" class="btn ripple" @click="setBudget('weekly')">
            <span class="icon i-set"></span><span class="btn-text">SET</span>
          </button>
        </div>
      </div>
      <div class="budget-group">
        <div class="budget-group-title">MONTHLY</div>
        <div class="budget-group-set">
          <div class="budget-group-set-text">{{ format(monthlyValue) }}</div>
          <button type="button" class="btn ripple" @click="setBudget('monthly')">
            <span class="icon i-set"></span><span class="btn-text">SET</span>
          </button>
        </div>
      </div>
      <div
        class="switch-container mt-20"
        v-if="$root.config.alertSwitchVisible && !$root.isHorizScreen"
      >
        <span class="switch-text">ALERT</span>
        <div class="switch-item-group">
          <input
            id="checked_alert_H"
            type="checkbox"
            class="switch-ckb"
            v-model="alertEnable"
          />
          <label for="checked_alert_H"></label>
        </div>
      </div>
    </div>
    <customer-keyboard
      :input-data="keyboardData"
      v-on:onapply="inputApply"
    ></customer-keyboard>
  </div>
</template>
<script>
module.exports = {
  data() {
    return {
      keyboardData: {
        dialog: false,
        daily: 0,
        weekly: 0,
        monthly: 0,
        select: "daily",
      },
      budgets: {},

      alertEnable: undefined,
    };
  },
  computed: {
    dailyValue: function () {
      return this.budgets.daily ? this.budgets.daily : 0;
    },
    weeklyValue: function () {
      return this.budgets.weekly ? this.budgets.weekly : 0;
    },
    monthlyValue: function () {
      return this.budgets.monthly ? this.budgets.monthly : 0;
    },
  },
  methods: {
    setBudget: function (type) {
      this.keyboardData = {
        dialog: true,
        daily: this.getBudget("daily"),
        weekly: this.getBudget("weekly"),
        monthly: this.getBudget("monthly"),
        select: type,
      };
    },
    getBudget: function (type) {
      if (!this.budgets) return 0;
      return this.budgets[type];
    },
    updateBudgets: function () {
      let vm = this;
      vm.$root.playerInfo.dailyBudget = vm.budgets.daily;
      vm.$root.playerInfo.weeklyBudget = vm.budgets.weekly;
      vm.$root.playerInfo.monthlyBudget = vm.budgets.monthly;
      vm.$root.playerInfo.alertEnable = vm.alertEnable;
      this.$root.service
        .updateBudgets(this.$root.playerInfo)
        .then(function (response) {
          if (response.status == 200 && response.data.success) {
            if (response.data.reason == "newPlayer") {
              vm.$root.tryGetOffer();
            }
            vm.$root.playerInfo.status = 1;
            vm.$router.push("budgetDone");
          } else {
            console.log("budgets set error.");
          }
        });
    },
    resetBudgets: function () {
      this.budgets = {
        daily: this.$root.playerInfo.dailyBudget,
        weekly: this.$root.playerInfo.weeklyBudget,
        monthly: this.$root.playerInfo.monthlyBudget,
      };
      if (this.$root.playerInfo.status == 1) {
        this.alertEnable = this.$root.config.alertSwitchVisible
          ? this.$root.playerInfo.alertEnable
          : true;
      } else {
        this.alertEnable = true;
      }
    },
    inputApply: function (number) {
      this.budgets[this.keyboardData.select] = number;
    },
    goBack: function () {
      this.$root.playerInfo.status == 1
        ? this.$router.push("index")
        : this.$router.push("terms");
    },
    format: function (value) {
      if (!value) return "--";
      else {
        return (
          (this.$root.playerInfo.currencySymbol ||
            this.$root.config.currencySymbol) + value
        );
      }
    },
    clickNext: function () {
      this.updateBudgets();
    },
  },
  beforeCreate() {
    let v = this;
    this.$root.title = "SET YOUR BUDGETS";
    this.$root.buttons = [
      {
        text: "BACK",
        iconClass: "i-back",
        onclick: function () {
          v.goBack();
        },
      },
      {
        text: "NEXT",
        iconClass: "i-next",
        onclick: function () {
          v.clickNext();
        },
      },
      {
        text: "RESET",
        iconClass: "i-reset",
        onclick: function () {
          v.resetBudgets();
        },
      },
    ];
  },
  mounted() {
    this.resetBudgets();
  },
};
</script>