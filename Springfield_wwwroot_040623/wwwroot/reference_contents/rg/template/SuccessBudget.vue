<template>
    <div class="page-content">
        <div class="content-text">
            <p class="display-1 font-weight-bold mb-3 font-green">
                YOUR BUDGET IS ACTIVE.
            </p>
            <p class="body-1">
                Your budget is ${{$root.playerInfo.dailyBudget}} per day.
            </p>
            <p class="body-1">
                Your budget is ${{$root.playerInfo.weeklyBudget}} per week.
            </p>
            <p class="body-1">
                Your budget is ${{$root.playerInfo.monthlyBudget}} per month.
            </p>
        </div>
  </div>
    
</template>
<script>
module.exports = {
  name: 'App',
  data(){
    return {
        awardMsg:""
    }
  },
  beforeCreate() {
    let v=this;
    this.$root.title="ADJUSTMENT SUCCESSFUL";
    this.$root.buttons=[
      {text:"NEXT",iconClass:"i-next",onclick:function(){v.$router.push('index')}},
      {text:"ADJUST BUDGETS",iconClass:"i-set",onclick:function(){v.$router.push('budget')}}
    ];
  },
  mounted() {
    let vm=this;
  },
}
</script>
