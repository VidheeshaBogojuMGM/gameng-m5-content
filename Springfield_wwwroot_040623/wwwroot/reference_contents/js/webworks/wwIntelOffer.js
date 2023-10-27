//Checking for the DedicatedWorkerGlobalScope scope is needed so that the worker doesn't pollute the other test executions.
let me = self;
if (typeof DedicatedWorkerGlobalScope !== 'undefined') {

  try {
    importScripts(`${location.origin}/lib/igt-media-elements/dist/igt-media-elements.js`);

  } catch (e) {

    me.postMessage("Import error.");
    me.postMessage(e.message);
  }
  var previousOfferEventSourceUrl = null;
  var offerEventSource = null;
  var config = {};
  config.intelOfferHostUrl = 'http://';
  var accessingCache = false;

  me.postMessage("MWorker: subscribeScreenTrigger: " + IGTMediaElements.subscribeScreenTrigger == null);
  // Subscribe to Idle Screen Trigger(For Card Out)
  IGTMediaElements.subscribeScreenTrigger('0x47', function (screenTrigger) {
    me.postMessage("MWorker: got 0x47, then closed/unregister conections");
    IGTMediaElements.util.log.info("IdleScreenTriggered(0x47), clear cache");
    // clear cache
    IGTMediaElements.contentCache.deleteStateElement('intelOfferLastPlayerId');
    accessingCache = false;
    // close connection,
    if (offerEventSource != null && offerEventSource.readyState != 2) {
      offerEventSource.close();
    }
    offerEventSource = null;

    IGTMediaElements.urlparams.getUrlParams().then((params) => {
      var sseUnregisterUrl = config.intelOfferHostUrl + '/messaging-service/v1/sse/unregister?machineNumber=' + params.machineNumber;
      var Http = new XMLHttpRequest();
      Http.open("GET", sseUnregisterUrl);
      Http.send();
    });
  });
  // me.dispatchEvent(new CustomEvent("__wk__",{"data": "lalalalal"}));

  me.postMessage("MWorker: getServerAddresses: " + (IGTMediaElements.getServerAddresses == null));
  //Get Intelligent Offer Service Address
  IGTMediaElements.getServerAddresses(['offer.io.igt.com']).then(function (serverAddresses) {
    // prints the url association with the offer.io.igt.com namespace
    me.postMessage("MWorker: inside getServerAddresses: " + serverAddresses['offer.io.igt.com']);
    IGTMediaElements.util.log.info('server addresses: ' + serverAddresses['offer.io.igt.com']);

    if (serverAddresses['offer.io.igt.com']) {
      var configUrl = serverAddresses['offer.io.igt.com'];
      if (configUrl.indexOf('/', configUrl.length - 1) !== -1) {
        configUrl = configUrl.substring(0, configUrl.length - 1);
      }

      config.intelOfferHostUrl = configUrl;
    } else {

      IGTMediaElements.util.log.error('No Server Address Found for Intelligent Offer');
      return;
    }
    me.postMessage("MWorker: server address: " + config.intelOfferHostUrl);
    // Subscribe to Session Screen Trigger (Card IN)
    IGTMediaElements.subscribeScreenTrigger('0x11', function (screenTrigger) {

      if (screenTrigger) {

        //IGTMediaElements.util.log.info('token 0x11 received in intelOffer web worker');

        // Get PlayerID token
        IGTMediaElements.getCurrentTokenValue('0x45').then(function (tokenData) {

          var playerId = tokenData.token.value;

          IGTMediaElements.util.log.info('TokenPlayerId: ' + playerId);
          if (playerId <= 0) {
            IGTMediaElements.util.log.info('BadPlayerId: ' + playerId);
            return;
          }

          me.postMessage("MWorker: 0x45 triggered, aCache status " + accessingCache + "in player: " + playerId);
          //refactor needed, better cache locking. The clearer logic and variable name instead of accessingCache. 
          if (accessingCache) {
            IGTMediaElements.util.log.info('Ignore when accessing cache: ' + playerId);
            return;
          } else {
            accessingCache = true;
          }

          IGTMediaElements.contentCache.getStateElement('intelOfferLastPlayerId').then(value => {
            me.postMessage("MWorker: cache playerID compare: " + value + " - " + playerId);
            IGTMediaElements.util.log.info('lastPlayerId in cache: ' + value + ', cardInPlayer: ' + playerId);
            if (String(value) != String(playerId)) {
              // new player, cache first
              IGTMediaElements.util.log.info('playerchanged, cache player: ' + playerId);
              IGTMediaElements.contentCache.setStateElement('intelOfferLastPlayerId', playerId).then(contentState => {
                accessingCache = false;

                // Get Config Values from Intelligent Offer Service

                const configUrl = config.intelOfferHostUrl + '/mobile-service/offer/config/m5';
                var Http2 = new XMLHttpRequest();
                Http2.open("GET", configUrl);

                Http2.onreadystatechange = (e) => {
                  if (Http2.readyState == 4 && 200 <= Http2.status && Http2.status < 400) {

                    const res = JSON.parse(Http2.response);
                    config.m5CardinShowContent = res.m5CardinShowContent;
                    config.m5NewOfferTriggerContent = res.m5NewOfferTriggerContent;
                    me.postMessage("MWorker: " + 'config: m5CardinShowContent=' + config.m5CardinShowContent + ", m5NewOfferTriggerContent=" + config.m5NewOfferTriggerContent);
                    IGTMediaElements.util.log.info('config: m5CardinShowContent=' + config.m5CardinShowContent + ", m5NewOfferTriggerContent=" + config.m5NewOfferTriggerContent);

                    if (config.m5CardinShowContent) {


                      // Get Offers for PlayerID
                      const offerListUrl = config.intelOfferHostUrl + '/mobile-service/offer/list?cmsPlayerId=' + playerId;
                      var Http3 = new XMLHttpRequest();
                      Http3.open("GET", offerListUrl);

                      Http3.onreadystatechange = (e) => {
                        if (Http3.readyState == 4 && 200 <= Http3.status && Http3.status < 400) {
                          const res = JSON.parse(Http3.response);
                          const offerList = res.offerList;
                          me.postMessage("MWorker: get offerlist cb: length " + offerList.length);
                          IGTMediaElements.util.log.info('Offers returned from backend service: ' + offerList.length);

                          var loadOfferContent = false;

                          // Check for redeemable offers
                          for (var i = 0; i < offerList.length; i++) {
                            if (offerList[i].status == 0 || offerList[i].status == 2) {
                              loadOfferContent = true;
                              break;
                            }
                          }

                          // If player has redeemable offers, load Offer List content
                          if (loadOfferContent) {
                            me.postMessage("MWorker: loading offer page...");
                            IGTMediaElements.util.log.info('Redeemable offer found, launch offer content page.');
                            IGTMediaElements.loadContent(`${location.origin}/reference_contents/intelOffer.html`);
                          }
                        }

                      }
                      Http3.send();
                    }


                    if (config.m5NewOfferTriggerContent) {
                      // get machine number
                      IGTMediaElements.urlparams.getUrlParams().then((params) => {
                        IGTMediaElements.getPatronData().then((patronData) => {
                          //primary session check
                          IGTMediaElements.util.log.debug("MWorker patronData: " + JSON.stringify(patronData));
                          let isPrimary = false;
                          //if (patronData && (patronData.awardEnable && patronData.awardEnable.xcEnable) && (patronData.generalPTData && patronData.generalPTData.dupCard==false) && (patronData.BE2_AwardEnable && patronData.BE2_AwardEnable.xcEnable)) {
                          if (patronData) {
                            IGTMediaElements.util.log.debug("patronData is not null");
                            if (patronData.patronData) {
                              IGTMediaElements.util.log.debug("patronData.patronData is not null");
                              if (patronData.patronData.patronData) {
                                IGTMediaElements.util.log.debug("patronData.patronData.patronData is not null");
                                if (patronData.patronData.patronData.generalPTData.dupCard == false) {
                                  IGTMediaElements.util.log.debug("dupCard equals false; set isPrimary to true--------------------------------------------------");
                                  isPrimary = true;
                                }
                              }
                            }
                          }

                          // Register SSE Emitter for Offer Notifications
                          var offerEventSourceUrl = config.intelOfferHostUrl + '/messaging-service/v1/sse/register?playerId=' + playerId + '&machineNumber=' + params.machineNumber + '&isPrimarySession=' + isPrimary;

                          if (offerEventSource != null && offerEventSourceUrl == previousOfferEventSourceUrl) {
                            return;
                          }

                          IGTMediaElements.util.log.info('Register SSE emitter by URL: ' + offerEventSourceUrl);
                          me.postMessage("MWorker " + 'Register SSE emitter by URL: ' + offerEventSourceUrl);

                          previousOfferEventSourceUrl = offerEventSource;
                          offerEventSource = new EventSource(offerEventSourceUrl);
                          offerEventSource.onerror = e => {
                            IGTMediaElements.util.log.info('Offer Changed Notification on error: ' + JSON.stringify(e.data))
                          }
                          offerEventSource.onopen = e => {
                            IGTMediaElements.util.log.info('Offer Changed Notification on open: ' + JSON.stringify(e.data))
                          }
                          // offer changed notification
                          offerEventSource.onmessage = e => {
                            const offer = JSON.parse(e.data);
                            me.postMessage("MWorker " + 'got server event: ' + JSON.stringify(e.data));
                            IGTMediaElements.util.log.info('Offer Changed Notification: ' + JSON.stringify(e.data));

                            // get player from cache
                            IGTMediaElements.getCurrentTokenValue('0x45').then(function (tokenData) {
                              var currPlayerId = tokenData.token.value;
                              // is playing
                              me.postMessage("MWorker " + 'triggering new offer: currPlayerId: ' + currPlayerId + "offer.cmsPlayerId: " + offer.cmsPlayerId);
                              if (currPlayerId == offer.cmsPlayerId) {
                                IGTMediaElements.util.log.info('Redeemable offer found, launch offer content page.');
                                IGTMediaElements.loadContent(`${location.origin}/reference_contents/intelOffer.html?awardId=` + offer.sourceAwardId);
                                IGTMediaElements.showWindow();  // open service window
                              } else {
                                IGTMediaElements.util.log.info('Player already carded out, ignore, offer.cmsPlayerId=' + offer.cmsPlayerId + ', current player=' + currPlayerId);
                              }
                            });
                          }
                        })
                      });
                    }
                  }
                }
                Http2.send();
              }).catch(function (err) {
                accessingCache = false;
              });
            } else {
              IGTMediaElements.util.log.info('Cached duplicate player: ' + playerId);
              accessingCache = false;
            }
          }).catch(function (err) {
            accessingCache = false;
          });

        });
      }
    });
  });


  self.onmessage = function (msg) {

    //me.postMessage("msg");
  };

  self.onerror = function (error) {

    //me.postMessage(error);
  };
}