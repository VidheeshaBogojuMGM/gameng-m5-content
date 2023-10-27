const rg = window['com.igt.RG']("#app", {
    state:{
        preferredDisplayType: responsibleGamingConfig.notificationPreferredDisplayType,
        cardedState:"none"
    },
    data() {
        return Object.assign({
            name: "IGT",
            title: "",
            buttons:[],
            kiosk:0,
            config:responsibleGamingConfig,
            isFullscreenView:(window.innerWidth >= 640 && window.innerHeight>=480) ? true : false,
            resizeType: (window.innerWidth >= 640 && window.innerHeight>=480) ? '':'preset-2',
            item:{}
        })
    },
    watch: {
        notify: {
            handler: function (n) {
                if (n && n.value){
                    let _value=n.value;
                    this.title = _value < 100 ? "APPROACHING LIMIT NOTIFICATION" : "REMINDER";
                    if(_value>100){
                        this.item = {head:"YOU HAVE EXCEEDED THE BUDGET YOU SET", message:"You have spent "+ _value +"% of the budget you set for the "+n.type};
                    }else if(_value<100){
                        this.item =  {head:"YOU ARE APPROACHING THE BUDGET YOU SET", message:"You have spent "+ _value +"% of the budget you set for the "+n.type};
                    }else{
                        this.item =  {head:"YOU HAVE REACHED THE BUDGET YOU SET", message:"You have spent "+ _value +"% of the budget you set for the "+n.type};
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        returnToGame:function(){
            let url="";
            console.log ("current carded state is " + m.state.cardedState);
            let indexFile = ((parseInt(this.$store.state.urlparams.contentHeight) || window.innerHeight) > (parseInt(this.$store.state.urlparams.contentWidth) || window.innerWidth))?"index.html":"indexHoriz.html";
            let host=document.referrer ? new URL(document.referrer).origin : "localhost";

            //note: If you're using Reference contents, it is recommended you set the responsibleGamingConfig.sesisonScreenUrl and idleScreenUrl.
            //it is likely that host/idle/ isn't there, but host/reference_contents/ may be. and in that case you wouldn't use an indexFile but idle_screen.html
            //and session_screen.html. Checking your URLMap may help

            if (m.state.cardedState === "Session"){
                url = responsibleGamingConfig.sessionScreenUrl ? responsibleGamingConfig.sessionScreenUrl : host + "/patron/"+ indexFile;
            }
           else{
                let indexFile = ((parseInt(this.$store.state.urlparams.contentHeight) || window.innerHeight) > (parseInt(this.$store.state.urlparams.contentWidth) || window.innerWidth))?"index.html":"indexHoriz.html";
                let host=document.referrer ? new URL(document.referrer).origin : "localhost";
                url = responsibleGamingConfig.idleScreenUrl ? responsibleGamingConfig.idleScreenUrl : host + "/idle/"+ indexFile;
            }
            IGTMediaElements.getFullscreenState().then(function(isFullscreen) {
                if (isFullscreen) {
                    IGTMediaElements.hideFullScreen();
                }
                console.log ("RG return to game navigate to" + url);
                navigate(url);
            });
        },
    },
    beforeCreate() {
        let vm=this;
        window.onresize=function(){
            vm.isFullscreenView = (window.innerWidth >= 640 && window.innerHeight>=480) ? true:false;
        }
    },
    created() {
        console.log("preset-2",this.resizeType);
        document.querySelector("#app").setAttribute("resize",this.resizeType);
        IGTMediaElements.subscribeToken('0x45', function(value){
            if (value !== 0 && value !== '0' && value !== '' && value !== undefined)
            {
                m.state.cardedState = "Session";
            }
            else
            {
                m.state.cardedState = "Idle";
            }
        });
    },
}, function () {
});