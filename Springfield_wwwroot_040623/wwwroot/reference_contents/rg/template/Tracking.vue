<template>
  <div class="page-content">
    <table class="text-left tracking" v-if="!$root.leftScreen">
      <tr class="tracking-header">
        <td width="20%"></td>
        <td width="40%" class="tracking-category">ACTUAL SPEND</td>
        <td width="40%" class="tracking-category">BUDGET CHOICES</td>
      </tr>
      <tr>
        <td class="tracking-category">DAILY</td>
        <td><div>{{format(current.daily)}}</div></td>
        <td><div>{{format(budgets.daily)}}</div></td>
      </tr>
      <tr>
        <td class="tracking-category">WEEKLY</td>
        <td><div>{{format(current.weekly)}}</div></td>
        <td><div>{{format(budgets.weekly)}}</div></td>
      </tr>
      <tr>
        <td class="tracking-category">MONTHLY</td>
        <td><div>{{format(current.monthly)}}</div></td>
        <td><div>{{format(budgets.monthly)}}</div></td>
      </tr>
    </table>
    <div class="tracking-left" v-if="$root.leftScreen">
      <div class="tracking-left-group">
        <p>DAILY</p>
        <div>ACTUAL SPEND</div>
        <div class="tracking-left-group-item">{{format(current.daily)}}</div>
        <div>BUDGET CHOICES</div>
        <div class="tracking-left-group-item">{{format(budgets.daily)}}</div>
      </div>
      <div class="tracking-left-group">
        <p>WEEKLY</p>
        <div>ACTUAL SPEND</div>
        <div class="tracking-left-group-item">{{format(current.weekly)}}</div>
        <div>BUDGET CHOICES</div>
        <div class="tracking-left-group-item">{{format(budgets.weekly)}}</div>
      </div>
      <div class="tracking-left-group">
        <p>MONTHLY</p>
        <div>ACTUAL SPEND</div>
        <div class="tracking-left-group-item">{{format(current.monthly)}}</div>
        <div>BUDGET CHOICES</div>
        <div class="tracking-left-group-item">{{format(budgets.monthly)}}</div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
    name:"tracking",
    data:function(){
      return{
        progressBar:false,
      }
    },
    methods: {
      format:function(value){
        if(!value) return (this.$root.playerInfo.currencySymbol || this.$root.config.currencySymbol) + "0.00";
        else {
          return (this.$root.playerInfo.currencySymbol || this.$root.config.currencySymbol) + value.toFixed(2);
        }
      }
    },
    computed: {
      budgets: function(){
        return {daily:this.$root.playerInfo.dailyBudget,weekly:this.$root.playerInfo.weeklyBudget,monthly:this.$root.playerInfo.monthlyBudget};
      },
      current: function () {
        return {daily:this.$root.playerInfo.dailySummary,weekly:this.$root.playerInfo.weeklySummary,monthly:this.$root.playerInfo.monthlySummary};
      }
    },
    filters: {
      round:function(value) {
        if(!value) return "0.00";
        else {
          return value.toFixed(2);
        }
      }
    },
    beforeCreate() {
      this.$root.title="TRACK YOUR PLAY";
      let v= this;
      this.$root.buttons=[
        {text:"ADJUST BUDGETS",iconClass:"i-set",onclick:function(){v.$router.push('budget')}},
        {text:"UN-ENROLL",iconClass:"i-un-enroll",onclick:function(){v.$router.push('unenroll')}},
      ];
      if(this.$root.config.massachusettsEnable)
        this.$root.buttons.push({text:"INFO CENTER",iconClass:"i-info",onclick:function(){v.$router.push('gamesense/infocenter')}});
    },
  }
</script>
