<template>
    <div class="page-content">
        <div class="content-text">
            <p class="display-1 font-weight-bold font-green">
                IT'S THE SMART WAY TO TRACK YOUR PLAY.
            </p>
            <p class="body-1">
                Set the amount you want to spend.
            </p>
            <p class="body-1">
                As you play, you will receive automatic notifications to help you keep track of your spending.
            </p>
            <p class="body-1">
                You can adjust your budget or un-enroll at any time.
            </p>
            <p class="body-1" v-if="$root.playerInfo.awardMsg">
                You may receive {{$root.playerInfo.awardMsg}} award(s) after your initial enrollment.
            </p>
        </div>
    </div>    
</template>
<script>
module.exports = {
  name: 'introduce',
  beforeCreate() {
    let v=this;
    this.$root.title="INTRODUCING "+ this.$root.appTitle.toUpperCase();
    this.$root.buttons=[
        {text:"ENROLL",iconClass:"i-enroll",onclick:function(){v.goTerms()},isDisabled:!v.$root.playerInfo.cmsPlayerId}
    ];
    if(this.$root.config.massachusettsEnable)
        this.$root.buttons.push({text:"INFO CENTER",iconClass:"i-info",onclick:function(){v.goGemeSense()}});
  },
  methods: {
      goTerms:function(){
        if(!this.$root.kiosk){
            this.$root.showFullScreen();
        }
        this.$router.push('terms');
      },
      goGemeSense:function(){
        if(!this.$root.kiosk){
            this.$root.showFullScreen();
        }          
        this.$router.push('gamesense/infocenter');
      }
  }
}
</script>
