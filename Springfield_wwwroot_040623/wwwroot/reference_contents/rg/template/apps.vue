<template>
  <div class="page-content">
    <ul>
      <li><a href="#/index"><h2>Responsible Gaming</h2></a></li>
      <li><a v-on:click="goToNotify()"><h2>notify</h2></a></li>
    </ul>
  </div>
</template>
<script>
let values=[75,100,150];
let types=['day','week','month'];

module.exports = {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    goToNotify:function(){
        let url='http://localhost:8001/#/notification/'+types[(new Date().getSeconds())%3]+'/'+values[(new Date().getSeconds())%3];
        window.location.href=url;
    },
  },
  mounted() {
    this.$nextTick(function(){
      this.$root.service.getPlayerInfo('1').then(function(info){
        console.log('notify check', info);
          if(info.needNotify){
            //setTimeout(()=>{window.location.href='http://localhost:8001/?notify=1#/index';},3000);
          }
      });
    });
  },
  beforeCreate() {
    this.$root.title = 'HOME PAGE'
  },
}
</script>
