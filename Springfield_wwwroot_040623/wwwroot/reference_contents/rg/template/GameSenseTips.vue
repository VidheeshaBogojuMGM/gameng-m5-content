<template>
  <div class="page-content">
        <div class="gs-tips">
            <p class="body-1">
                Set a budget and <span>stick to it.</span>
            </p>
            <p class="body-1">
                Accept losses as the <span>cost of entertainment.</span>
            </p>
            <p class="body-1">
                Play for <span>fun</span>, not to make money.
            </p>
            <p class="body-1">
                Lucky charms may help you enjoy the game, but they <span>won't help you win.</span>
            </p>
            <p class="body-1">
                If gambling is no longer fun, free help and information is available:
            </p>
            <p class="body-1">
                <span>1-800-426-1234</span>
            </p>
        </div>
  </div>
    
</template>
<script>
module.exports = {
  name: 'App',
  data () {
    return{
    }
  },
  beforeCreate() {
    let v=this;
    this.$root.title="GAMESENSE TIPS";
    this.$root.buttons=[
      {text:"BACK",iconClass:"i-back",onclick:function(){v.$router.push('infocenter')}},
      {text:"NEXT",iconClass:"i-next",onclick:function(){v.$router.push('slotswork')}},
    ];
  },
}
</script>