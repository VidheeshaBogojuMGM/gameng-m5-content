<template>
    <div class="page-content">
        <div class="content-text">
            <p class="display-1 font-weight-bold mb-3 font-green">
                PLEASE LET US KNOW WHY YOU WISH TO UN-ENROLL.
            </p>
            <P>Check all that apply:</P>
            <div class="unenroll-reason-list" ref='list' v-bind:style="{height:listHeight+'px'}" v-bind:class="{'multi-column':isHorizRatio}">
                <div class="list-item"  v-for="r in getPagedReasons" :key="r.reasonId">
                    <label class="checkbox-group">
                        <input type="checkbox" :id="'cbk_'+r.reasonId" @change="canEnableNext($event);" :value="r.reasonId" v-model="selected">
                        <span :for="'cbk_'+r.reasonId">{{r.reasonDescription}}</span>
                        <div class="show-box"></div>
                    </label>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="scroll-btn-group">
                <a class="btn-icon" v-on:click="pageUp()" :class="{'disabled':pageUpDisable}">
                    <span class="icon i-up"></span>
                </a>
                <a class="btn-icon" v-on:click="pageDown()" :class="{'disabled':pageDownDisable}">
                    <span class="icon i-down"></span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
let scrollInterval=44;
module.exports = {
  name: 'App',
  data () {
    return{
        reasons:[],
        selected : [],
        scrollValue : 0,
        scrollHeight:0,
        clientHeight:0,
        index:0,
        pageSize:6,
        listHeight:330,
        isHorizRatio : window.innerWidth/window.innerHeight >= 7
    }
  },
  computed: {
      canScroll:function(){
        return this.$refs.list.scrollHeight > this.$refs.list.clientHeight;
      },
      getPagedReasons:function(){
        if(this.reasons){
            this.reasons = this.reasons.filter(reason => reason.status == 0);
            this.reasons = this.reasons.sort( (a, b) => {return a.orderIndex - b.orderIndex});
            return this.reasons.slice(this.index * this.pageSize,(this.index + 1) * this.pageSize);
        }
      },
      totalPage:function(){
        if(this.reasons && this.reasons.length)
          return Math.ceil(this.reasons.length/this.pageSize);
        else return 0;
      },
      pageUpDisable:function(){
        return this.index==0;
      },
      pageDownDisable:function(){
          return this.index==this.totalPage-1;
      }
  },
  methods: {
    unenroll:function(){
        this.$root.playerInfo.reasonIds=this.selected.length?this.selected.sort().join(',') :'';
        let vm=this;
        this.$root.service.unenroll(this.$root.playerInfo).then(function(){
            vm.$router.push("unenrollDone");
        });
    },
    canEnableNext: function(event) {
        let v = this;
        this.$root.buttons = [
            { text: "BACK", iconClass: "i-back", onclick: function() { v.$router.push('../index') } },
            { text: "NEXT", iconClass: "i-next", onclick: function() { v.unenroll() }, isDisabled: !Boolean(this.selected.length) },
        ];
    },
    pageUp:function(){
        if(!this.pageUpDisable)
            this.index=this.index>0?this.index-1:this.index;   
    },
    pageDown:function(){
        if(!this.pageDownDisable)
            this.index=this.index<this.totalPage?this.index+1:this.index;
    },
  },
  mounted: function(){
    this.$nextTick(function () {
        this.listHeight= this.$root.isHorizScreen? 200 : window.innerHeight-550;
        let vm=this;
        this.$root.service.getReasons().then(function(response){
            if(response.status==200 && response.data)
                vm.reasons=response.data;
            });
        if(this.$root.config.pageSize){
            vm.pageSize= this.$root.config.pageSize[this.$root.config.preferredDisplayType] || 6;
            if(this.$root.isHorizScreen){
                vm.pageSize=3;
                if(this.isHorizRatio)
                    vm.pageSize=2;
            }
        }
        
    })
  },
    beforeCreate() {
        this.$root.title = "UN-ENROLLMENT";
    },
    created() {
        this.canEnableNext();
    }
}
</script>
