<template>
  <div class="kb modalbg" v-bind:class="{ active: inputData.dialog }"> 
    <div class="dialog">
      <div class="dialog-body">
        <div class="kb-title">
          <p>{{inputData.select.toLocaleUpperCase()}} BUDGET</p>
          <p class="kb-value" v-bind:class="{'light':isLight}">{{number}}</p>
          <p class="error">{{errorMsg}}</p>
        </div>
        <hr class="diver">
        <table v-if="screenType === 1">
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('1')">1</button></td>
            <td><button class="btn-outline btn-kb" @click="input('2')">2</button></td>
            <td><button class="btn-outline btn-kb" @click="input('3')">3</button></td>
          </tr>
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('4')">4</button></td>
            <td><button class="btn-outline btn-kb" @click="input('5')">5</button></td>
            <td><button class="btn-outline btn-kb" @click="input('6')">6</button></td>
          </tr>
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('7')">7</button></td>
            <td><button class="btn-outline btn-kb" @click="input('8')">8</button></td>
            <td><button class="btn-outline btn-kb" @click="input('9')">9</button></td>
          </tr>
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('del')">BACK</button></td> 
            <td><button class="btn-outline btn-kb" @click="input('0')">0</button></td>
            <td><button class="btn-outline btn-kb" @click="input('clear')">CLEAR</button></td>
          </tr>
        </table>
        <table v-else-if="screenType === 2">
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('1')">1</button></td>
            <td><button class="btn-outline btn-kb" @click="input('2')">2</button></td>
            <td><button class="btn-outline btn-kb" @click="input('3')">3</button></td>
            <td><button class="btn-outline btn-kb" @click="input('4')">4</button></td>
            <td><button class="btn-outline btn-kb" @click="input('5')">5</button></td>
            <td><button class="btn-outline btn-kb" @click="input('del')">BACK</button></td> 
          </tr>
          <tr>          
            <td><button class="btn-outline btn-kb" @click="input('6')">6</button></td>                    
            <td><button class="btn-outline btn-kb" @click="input('7')">7</button></td>
            <td><button class="btn-outline btn-kb" @click="input('8')">8</button></td>
            <td><button class="btn-outline btn-kb" @click="input('9')">9</button></td>
            <td><button class="btn-outline btn-kb" @click="input('0')">0</button></td>
            <td><button class="btn-outline btn-kb" @click="input('clear')">CLEAR</button></td>
          </tr>                                          
        </table>
        <table v-else>
          <tr>
            <td><button class="btn-outline btn-kb" @click="input('1')">1</button></td>
            <td><button class="btn-outline btn-kb" @click="input('2')">2</button></td>
            <td><button class="btn-outline btn-kb" @click="input('3')">3</button></td>
            <td><button class="btn-outline btn-kb" @click="input('4')">4</button></td>
            <td><button class="btn-outline btn-kb" @click="input('5')">5</button></td>
            <td><button class="btn-outline btn-kb" @click="input('6')">6</button></td>
            <td><button class="btn-outline btn-kb" @click="input('7')">7</button></td>
            <td><button class="btn-outline btn-kb" @click="input('8')">8</button></td>
            <td><button class="btn-outline btn-kb" @click="input('9')">9</button></td>
            <td><button class="btn-outline btn-kb" @click="input('0')">0</button></td>
            <td><button class="btn-outline btn-kb" @click="input('del')">BACK</button></td>             
            <td><button class="btn-outline btn-kb" @click="input('clear')">CLEAR</button></td>
          </tr>        
        </table>
        <hr class="diver">
        <div class="dialog-footer">
          <button type="button" class="btn-flat-kb" v-on:click="inputData.dialog=false">
            CANCEL
          </button>
          <button type="button" class="btn-flat-kb float-right" :disabled="!isValid" v-on:click="apply()">
            APPLY
          </button>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'App',
  props:{
    inputData:{dialog:false, daily:0, weekly:0, monthly:0, select:'daily'}
  },
  data(){
    return{
      number:"0",
      errorMsg:"",
      overflow:false,
      result: 0,
    }
  },
  computed: {
    isValid : function(){
      if(this.number=='0') { this.errorMsg = ""; return true;}
      let _number = parseInt(this.number);
      let result=false;
      if( this.overflow = _number > this.$root.config.maxBudget) {this.errorMsg="Buget cannot greater than "+this.$root.config.maxBudget+'!'; return false;}
      switch (this.inputData.select) {
        case 'daily':
          if(this.overflow = _number > this.tryGetValue(this.inputData.weekly,_number) || _number > this.tryGetValue(this.inputData.monthly,_number)){
            this.errorMsg="Daily budget cannot greater than weekly or monthly budget!";
            return false;
          }
          break;
        case 'weekly':
          if(_number < this.tryGetValue(this.inputData.daily,_number)){
            this.errorMsg="Weekly budget cannot less than daily budget!";
            return false;
          }
          else if(this.overflow = _number > this.tryGetValue(this.inputData.monthly,_number)){
            this.errorMsg="Weekly budget cannot greater than monthly budget!";
            return false;
          }
          break;
        default:
          if(_number < this.tryGetValue(this.inputData.weekly,_number) || _number < this.tryGetValue(this.inputData.daily,_number)){
            this.errorMsg="Monthly budget cannot less than daily and weekly budget!";
            return false;
          }
          break;
      }
      this.errorMsg="";
      return true;
    },
    isLight:function(){
      return !this.inputData.hasChanged && this.number!="0";
    },   
    
    screenType: function() {
      this.result = Math.round(window.innerWidth / window.innerHeight);      
      if (this.result === 3 || this.result === 4 || this.result === 5|| this.result === 6) {
        if (this.$root.isPortrait()) {
          return 1;
        } else {
          return 2;
        }
      } else if (this.result === 7 || this.result === 8 || this.result === 10) {
        return 3;
      } else {
        return 1;
      }
    }
  },
  methods: {
    input:function(val){
      if(val=='clear')
        this.number="0";
      else if(val=='del'){
        if(this.number.length>1)
          this.number=this.number.slice(0,-1);
        else
          this.number="0";
      }
      else{
        if(this.number=='0' || !this.inputData.hasChanged)
          this.number=val;
        else if(!this.overflow ){
            this.number+=val;
        }
      }
      this.inputData.hasChanged=true;
    },
    apply:function(){
      this.inputData.dialog=false;
      this.$emit('onapply',parseInt(this.number));
    },
    tryGetValue:function(value,defaultValue){
      return value? value: defaultValue;
    },
  },
  watch: {
    inputData:{
      handler:function(val){
        if(val)
        this.number=val[val.select]+'';
      },
      deep:true
    }
  },

  mounted: function() {    
    console.log("customer keyboard.")
  }
}
</script>
