const rg = window['com.igt.RG']("#app", {
    state:{
        preferredDisplayType: responsibleGamingConfig.preferredDisplayType
    },
    data() {
        return Object.assign({
            name: "IGT",
            title:"",
            buttons:[],
            kiosk:0,
            appTitle:responsibleGamingConfig.massachusettsEnable? "PlayMyWay":"Responsible Gaming",
            playerInfo:{},
            config:responsibleGamingConfig,
            leftScreen : window.innerWidth < 400,
            isFullscreenView:(window.innerWidth >= 640 && window.innerHeight>=480) ? true : false,
            resizeType: (window.innerWidth >= 640 && window.innerHeight>=480) ? '':'preset-2',
            newPlayer:false,
            isHorizScreen : window.innerHeight<=256 && (window.innerWidth/window.innerHeight > 5/2),
        })
    },
    methods: {
        isLoggedIn: function () {
            return false;
        },
        getPlayerId:function(){
            return IGTMediaElements.getCurrentTokenValue('0x45').then(function(res){
                return Promise.resolve(res.token.value);
            });
        },
        getDeviceId:function(){
            return IGTMediaElements.urlparams.getUrlParams().then((params) => {
                return Promise.resolve(params.machineNumber);
            });
        },
        returnToGame:function(){
            let url="";
			console.log("returnToGame occurs");
            if(this.__navigationMapping && this.__navigationMapping.SESSION_SCREEN && this.__navigationMapping.IDLE_SCREEN)
                url=(this.playerInfo && this.playerInfo.cmsPlayerId)?this.__navigationMapping.SESSION_SCREEN:this.__navigationMapping.IDLE_SCREEN;
            else{
                let indexFile = "spa_session_screen.html#";
                let host=document.referrer ? new URL(document.referrer).origin : "localhost";
                if(this.playerInfo && this.playerInfo.cmsPlayerId){
                    url = responsibleGamingConfig.sessionScreenUrl ? responsibleGamingConfig.sessionScreenUrl : host + "/reference_contents/" + indexFile;
                }
                else{
                    url = responsibleGamingConfig.idleScreenUrl ? responsibleGamingConfig.idleScreenUrl : host + "/reference_contents/"+ "idle_screen.html";
                }
            }
            
            IGTMediaElements.getFullscreenState().then(function(isFullscreen) {
                if (isFullscreen) {
                    IGTMediaElements.hideFullScreen();
                }
                navigate(url);
            });

        },
        showFullScreen:function(){
            if(this.preferredDisplayType!="fullscreen") return;
            IGTMediaElements.getFullscreenState().then(function(isFullscreen) {
                if (!isFullscreen) {
                    console.log(isFullscreen);
                    IGTMediaElements.showFullScreen();
                }
            });
        },
        tryGetOffer:function(){
            if(this.playerInfo && this.playerInfo.cmsPlayerId && this.playerInfo.personId && this.playerInfo.casinoId)
            this.service.tryGetOffer(this.playerInfo.cmsPlayerId,this.playerInfo.casinoId,this.playerInfo.personId).then(function(res){
                if((res.status==200 && res.data.success) ? res.data.reason : ""){
                    console.log("offer has issued successfully");
                }
            });
        },
        isPortrait: function() {
            return (parseInt(this.$store.state.urlparams.contentHeight) || window.innerHeight) > (parseInt(this.$store.state.urlparams.contentWidth) || window.innerWidth);
        }
    },
    beforeCreate() {
        let vm=this;
        window.onresize=function(){
            vm.leftScreen = window.innerWidth < 400 ;
            vm.isFullscreenView = (window.innerWidth >= 640 && window.innerHeight>=480) ? true:false;
        }
    },
    created() {
        console.log("preset-2",this.resizeType);
        document.querySelector("#app").setAttribute("resize",this.resizeType);
		
		//- close the service window and navigate back to Session on game play
		var self = this;
		IGTMediaElements.game.subscribeGameStart(function (gameStart) {
			console.log("Game start");
			self.returnToGame();
		});
    },
    routes: [
        {
            path: '/',
            name: '',
            redirect: '/index',
        },{
            path: '/index',
            name: 'index',
            component: loadSkinTemplate('template/Index.vue'),
        }, {
            path: '/terms',
            name: 'terms',
            component: loadSkinTemplate('template/Terms.vue'),
        }, {
            path: '/budget',
            component: loadSkinTemplate('template/Budget.vue'),
        }, {
            path: '/budgetDone',
            component: loadSkinTemplate('template/SuccessBudget.vue'),
        }, {
            path: '/gamesense/infocenter',
            component: loadSkinTemplate('template/GameSenseInfoCenter.vue'),
        }, {
            path: '/gamesense/tips',
            component: loadSkinTemplate('template/GameSenseTips.vue'),
        }, {
            path: '/gamesense/slotswork',
            component: loadSkinTemplate('template/GameSenseHowSlotsWork.vue'),
        }, {
            path: '/unenroll',
            component: loadSkinTemplate('template/UnEnroll.vue'),
        }, {
            path: '/unenrollDone',
            component: loadSkinTemplate('template/SuccessUnEnroll.vue'),
        }
    ]
}, function () {
    this.component("viewIntroduce", loadSkinTemplate("template/Introduce.vue"));
    this.component("viewTracking", loadSkinTemplate("template/Tracking.vue"));
    this.component("customerKeyboard", loadSkinTemplate("template/components/customer-keyboard.vue"));
    this.component("customerPinpad", loadSkinTemplate("template/components/customer-pinpad.vue"));
});
