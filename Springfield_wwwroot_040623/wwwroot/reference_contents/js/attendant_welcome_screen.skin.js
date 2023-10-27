// import att
const attendant = window["com.igt.attendant_welcome_screen"]("#app", {
  data(){
    return {
      selectedAppIndex: 0,
      countPerPage: 6,
      isPreviewing: false
    }
  },
  computed: {
    allApps() {
      const arr = []
      Object.keys(this.__navigationMapping).forEach(function (item) {
        arr.push(item)
      })
      arr.sort();
      return arr;
    },
    displayingApps(){
      return this.allApps.slice(this.selectedAppIndex * this.countPerPage, this.selectedAppIndex * this.countPerPage + this.countPerPage)
    },
    pageCount(){
      return Math.ceil(this.allApps.length/this.countPerPage);
    }
  },
  methods:{
    goto(idx){
      var rst;
      if (typeof(idx) == "string"){
        rst = (this.selectedAppIndex + parseInt(idx)) % this.pageCount;
      }else{
        rst = idx % this.pageCount;
      }
      if(rst < 0){
        rst += this.pageCount;
      }
      this.selectedAppIndex = rst;
    },
    preview(name){
      if(name == "ATTENDANT_WELCOME_SCREEN") {
        TweenMax.fromTo("#container", 0.2, {scale: 0.7}, {scale: 1}); 
        return;
      }
      this.isPreviewing = true;
      console.log('will preview', this.__navigationMapping[name])
      $("#preview").show();
      var hasQuery = this.__navigationMapping[name].indexOf("?") != -1
      $("#preview>iframe").attr("src", this.__navigationMapping[name] + (hasQuery ? "&":"?")+"demo=1");
    },
    exitPreview(){
      exitPreview()
    }


    
  }

  
});

var btnPressed = false;


attendant.press("#attendant", () => {
  if (!btnPressed) {
    attendant.analytics.trackPress("attendantPressed");
    btnPressed = true;
    attendant.dispatch("buttonPressed");
    document.getElementById('attendant').disabled = true;
  }

})
function exitPreview(){
  $("#preview").hide();
  $("#preview>iframe").attr("src", "");
  attendant.vm.isPreviewing = false;
  document.getElementById('attendant').disabled = btnPressed;
}
attendant.press("#exitPreviewBtn", exitPreview);
