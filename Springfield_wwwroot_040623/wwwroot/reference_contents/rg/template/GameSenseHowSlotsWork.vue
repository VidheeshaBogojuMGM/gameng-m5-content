<template>
  <div class="page-content">
        <div class="gs-tips">
        <p class="body-1">
            The outcome of each play is computer-generated and <span>random.</span>
        </p>
        <p class="body-1">
            Some players will win or break even, <span>while most will lose.</span>
        </p>
        <p class="body-1">
            Slots are programmed to <span>keep more money</span> than is paid out in winnings.
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
    this.$root.title="HOW SLOTS WORK";
    this.$root.buttons=[
      {text:"BACK",iconClass:"i-back",onclick:function(){v.$router.push('tips');}},
    ];
  },
}
</script>