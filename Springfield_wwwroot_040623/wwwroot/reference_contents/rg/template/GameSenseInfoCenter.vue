<template>
  <div class="page-content">
        <div>
            <p class="display-1 font-weight-bold mb-3 font-green">
                STOP BY TO LEARN ABOUT:
            </p>
        <ul class="gs-ul" v-bind:class="{'gs-ul-multi-column':isHorizRatio}">
            <li v-for="i in infoList" :key="i.$index">{{i}}</li>
        </ul>
        <p class="body-1 font-weight-bold mb-3 font-green" v-if="$root.config.infoCenterLocation && (!$root.isHorizScreen || pageDownDisable)">
            LOCATED: {{$root.config.infoCenterLocation}}
        </p>
        </div>
        <div class="footer">
            <div class="scroll-btn-group" v-if="$root.isHorizScreen && !isHorizRatio">
                <a class="btn-icon" v-on:click="index=0" :class="{'disabled':pageUpDisable}">
                    <span class="icon i-up"></span>
                </a>
                <a class="btn-icon" v-on:click="index=1" :class="{'disabled':pageDownDisable}">
                    <span class="icon i-down"></span>
                </a>
            </div>
        </div>
  </div>
    
</template>
<script>
module.exports = {
  name: 'App',
  data() {
      return {
          index:0,
          isHorizRatio : window.innerWidth/window.innerHeight >= 7
        }
  },
  computed: {
    infoList:function(){
        if(this.$root.isHorizScreen && !this.isHorizRatio){
            return this.index==0? ["PlayMyWay","Strategies to keep gambling fun","Odds of winning and losing","Concept of randomness","House advantage"]:["Gambling myths","Support, including help and enrollment in Voluntary Self-Exclusion"];
        }else
            return ["PlayMyWay","Strategies to keep gambling fun","Odds of winning and losing","Concept of randomness","House advantage","Gambling myths","Support, including help and enrollment in Voluntary Self-Exclusion"];
    },
    pageUpDisable:function(){
        return this.index==0;
    },
    pageDownDisable:function(){
        return this.index==1;
    }
  },
  beforeCreate() {
    let v=this;
    console.log("GameSense Info Center Entered,",v);
    this.$root.title="GAMESENSE INFO CENTER";
    this.$root.buttons=[
      {text:"BACK",iconClass:"i-back",onclick:function(){v.$router.push('../index')}},
      {text:"NEXT",iconClass:"i-next",onclick:function(){v.$router.push('tips')}},
    ];
  },
}
</script>
