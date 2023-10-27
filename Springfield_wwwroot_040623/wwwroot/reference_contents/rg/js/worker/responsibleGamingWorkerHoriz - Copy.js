if (typeof DedicatedWorkerGlobalScope !== 'undefined') {
  try {
      //importScripts(`${location.origin}/shell/node_modules/igt-media-elements/dist/igt-media-elements.js`);  //For M5 5.3
      importScripts(`${location.origin}/lib/igt-media-elements/dist/igt-media-elements.js`); //For M5 5.3.1
  } catch (e) {
  console.log("import error", e);
      self.postMessage("Import error.");
      self.postMessage(e.message);
  }
  
  //customer configuration
  var configuration={
    
    rgM5ContentServerHost:'http://10.91.17.23:81',       //Responsible Gaming M5 Content Host IP
    rgAPIBaseUrl:'http://10.91.17.71:8680',                //Base Url for Responsible Gaming API
    rgMessageSSEUrl:'http://10.91.17.71:8683',             //Base Url for Responsible Gaming M5 Message Service
    
    notificationUrlMap:'/reference_contents/rg/notificationHoriz.html',            //Base Url for Responsible Gaming M5 Content
    reminderUrlMap:'/reference_contents/rg/indexHoriz.html',                       //Base Url for Responsible Gaming M5 Content

    sseOpenAfterCarded:true,                          //true or false
    isNotifyEnable:true,                              //to enable that if RG M5 Content will load.
  };

  try {
    var rgEventSource = null;
    var rgPersonId = 0;
    var currentPersonId;
    var screenTriggerWhiteList=["0x11","0x50","0x51","0x52","0x53","0x54","0x55"];

    var RGHandler={
      messageService:{
        register:function(playerId){
            // get machine number
            IGTMediaElements.urlparams.getUrlParams().then((params) => {
              console.log('register to message service, machine number:'+params.machineNumber);
              let rgEventSourceUrl = configuration.rgMessageSSEUrl + '/m5-messaging-service/v2/register?playerId=' + playerId + '&machineNumber=' + params.machineNumber;
              IGTMediaElements.util.log.info('Register SSE emitter by URL: ' + rgEventSourceUrl);
              rgEventSource = new EventSource(rgEventSourceUrl);
              // get a Rule Hit notification
              rgEventSource.onmessage = e => {
                console.log("Get a Rule Hit Notification Message, ruleHitInfo:", e.data);
                let ruleHitInfo = JSON.parse(e.data);
                if(ruleHitInfo.CheckBy==3 || ruleHitInfo.CheckBy==-3){
                  //TBD FULLSCREEN
                  ruleHitInfo.HitPercentage=ruleHitInfo.CheckBy==3?100:ruleHitInfo.HitPercentage;
                  IGTMediaElements.contentCache.getTriggers().then(function(value){
                    if(value && value.length && value[value.length-1] && screenTriggerWhiteList.indexOf(value[value.length-1].id)>=0){
                      IGTMediaElements.loadContent(configuration.rgM5ContentServerHost+configuration.notificationUrlMap+'?ntype='+RGHandler.util.periodDic[ruleHitInfo.PeriodType+'']+'&nvalue='+ruleHitInfo.HitPercentage);
                      IGTMediaElements.showWindow();  // open service window
                    }
                  });
                }
              };
              rgEventSource.onerror=e=>{
                console.log('event source failed,',e);
                RGHandler.event.cardOutEvent(true);
              };
          } );
        },
        unRegister:function(){
          IGTMediaElements.urlparams.getUrlParams().then((params) => {
            console.log('un-register to message service, machine number:'+params.machineNumber);
            let Http = new XMLHttpRequest();
            let sseUnregisterUrl = configuration.rgMessageSSEUrl + '/m5-messaging-service/v2/unregister?machineNumber=' + params.machineNumber;
            Http.open("GET", sseUnregisterUrl);
            Http.send();
          });
        }
      },
      event:{
        cardOutEvent:function(clearAll){
          // close connection,
          if (rgEventSource != null && rgEventSource.readyState != 2) {
            rgEventSource.close();
          }
          rgEventSource = null;
          
          // clear cache
          if(currentPersonId==undefined) return;
          currentPersonId=undefined;
          rgPersonId = 0;
          IGTMediaElements.util.log.info("IdleScreenTriggered(0x47), clear cache");
          IGTMediaElements.contentCache.deleteStateElement('rgLastPlayerId');
          
          //un-register to sse
          if(configuration.isNotifyEnable){
            RGHandler.messageService.unRegister();
          }
        }
      },
      util:{
        GrabUrl(url){
          if (url.indexOf('/', url.length - 1) !== -1) {
            return url.substring(0, url.length - 1);
          }
          return url;
        },
        periodDic:{'0':'session','1':'day','2':'week','3':'month','4':'year'},
      },
    };

    if(configuration.isNotifyEnable){
      // Subscribe to Session Screen Trigger (Card IN)
      IGTMediaElements.subscribeScreenTrigger('0x11', function (screenTrigger) {

        if (screenTrigger) console.log(screenTrigger);
          IGTMediaElements.util.log.info('token 0x11 received in rg web worker');
          // Get PlayerID token
          IGTMediaElements.getCurrentTokenValue('0x45').then(function (tokenData) {
            console.log(tokenData);
            var playerId = tokenData.token.value;
            console.log("PlayerID: ", playerId);
            IGTMediaElements.util.log.info('TokenPlayerId: ' + playerId);
            if (playerId == '' ||  parseInt(playerId) <= 0) {
              IGTMediaElements.util.log.info('BadPlayerId: ' + playerId);
              return;
            }
            if(currentPersonId==playerId){
                IGTMediaElements.util.log.info('repeat card in event: ' + playerId);
                console.log('repeat card in event: '+playerId);
                return;
            }
            currentPersonId = playerId;

            if (rgPersonId) {
              IGTMediaElements.util.log.info('Ignore when accessing cache: ' + playerId);
              return;
            }

            IGTMediaElements.contentCache.getStateElement('rgLastPlayerId').then(value => {
              IGTMediaElements.util.log.info('lastPlayerId in cache: ' + value + ', cardInPlayer: ' + playerId);
              // get machine number
              IGTMediaElements.urlparams.getUrlParams().then((params) => {
              console.log('register to message service, machine number:'+params.machineNumber);
                if (String(value) != String(playerId)) {
                // new player, cache first
                IGTMediaElements.util.log.info('playerchanged, cache player: ' + playerId);
                IGTMediaElements.contentCache.setStateElement('rgLastPlayerId', playerId).then(contentState => {

                  // Get player info from RG Service
                  let Http = new XMLHttpRequest();
                  let playerinfoUrl = configuration.rgAPIBaseUrl + '/rg-api/rgprs/v2/player/info?baseOnly=1&cmsPlayerId='+playerId+ '&deviceId=' + params.machineNumber;
                  console.log('call rg player info API, ',playerinfoUrl)
                  Http.open("GET", playerinfoUrl);
                  Http.send();
                  Http.onreadystatechange=(e)=> {
                    if(e.target.readyState!=4 || e.target.status!=200) return;
                    let res = JSON.parse(Http.response);
                    console.log('get player info from RG',Http.response);
                    rgPersonId = res.personId;
                    if(res.status==1){
                      console.log('player has enrolled, register to message service sse ');
                      RGHandler.messageService.register(playerId);
                    }
                    else{
                      if(rgPersonId && configuration.sseOpenAfterCarded) RGHandler.messageService.register(playerId);
                      if(res.status==0 && res.needNotify){
                        //go to introducing paging.
                        IGTMediaElements.util.log.info('Player is never register to RG, need to be notify.');
                        console.log('Player is never register to RG, need to be notify.');
                        IGTMediaElements.loadContent(configuration.rgM5ContentServerHost+configuration.reminderUrlMap+'?notify=1');
                        IGTMediaElements.showWindow();  // open service window
                      }
                    }
                    //register to sse

                  }
                }).catch(function (err) {
                    rgPersonId = 0;
                    console.log(err);
                });
              } else {
                IGTMediaElements.util.log.info('Cached duplicate player: ' + playerId);
                rgPersonId = 0;
              }
              });
            }).catch(function (err) {
                rgPersonId = 0;
                   });
           });

       });

      // Subscribe to Idle Screen Trigger(For Card Out)
      IGTMediaElements.subscribeScreenTrigger('0x47', RGHandler.event.cardOutEvent);
    }

  } catch (e) {
    console.log("Error loading player data.", e);
        self.postMessage("Error loading player data.");
        self.postMessage(e.message);
  }

  //self.onmessage = function (msg) {
    //console.log("onmessage", msg);
    //self.postMessage("onmessage:"+msg);
  //};

  self.onerror = function (error) {
      console.log("error", error);
      self.postMessage(error);
  };
}