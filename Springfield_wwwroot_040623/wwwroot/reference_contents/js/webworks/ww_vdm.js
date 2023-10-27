// import w from "m5-content-model/worker"
importScripts(`${location.origin}/lib/igt-media-elements/dist/igt-media-elements.js`);
// console.log(w)
// if (process.env.NODE_ENV === "production") {
//   IGTMediaElements = w
// } else {
//   IGTMediaElements = w.IGTMediaElements
// }

IGTMediaElements.util.log.info("vdm web worker started");
console.log("vdm web worker started");

// const sseConnectionTryTime = 50;

IGTMediaElements.getServerAddresses(["vdm.igt.com"]).then(serverAddresses => {
  const addr = serverAddresses["vdm.igt.com"];

  if (addr && addr !== 'UNKNOWN') {
    let serviceWindowOpen = false;

    IGTMediaElements.pubSub.subscribe(
      IGTMediaElements.WINDOW_STATE_TOPIC,
      data => {
        IGTMediaElements.util.log.info("sse windowState", data.windowState);
        serviceWindowOpen = data.windowState;
      }
    );

    console.log(`notification addr ${addr}`);

    var locationToken = "0xAF";
    IGTMediaElements.getCurrentTokenValue(locationToken).then(e => {

      let url = `${addr}/VDMWebPortal/api/Notification/Register/?egmLocation=${e.token.value}`;

      IGTMediaElements.util.log.info(`notification url ${url}`);

      const randomOneToFive = Math.floor(Math.random() * 5) + 1;

      const statusPageMap = {
        "Anticipation": "awardNotification",
        "Started": "drawingInProgress",
        "Verification": "winningTicketList",
        "Verified": "selectionInProgress",
        "PrizeLinked": "winnerList",
        "End": "drawingComplete"
      }

      setTimeout(() => {

        const eventSource = new EventSource(url);

        eventSource.addEventListener("DrawingStatusChange", e => {
          // Do something - event data etc will be in e.data
          IGTMediaElements.util.log.info(`notification data ${e.data}`);

          const sseData = JSON.parse(e.data);

          IGTMediaElements.util.log.info(`notification data status ${sseData.Status} and SW open status ${serviceWindowOpen}`);

          const page = statusPageMap[sseData.Status]
          if (page) {
            IGTMediaElements.contentCache
              .setStateElement(sseData.Status, e.data, 0)
              .then(() => {
                IGTMediaElements.util.log.info(`DrawingStatusChange notification ${sseData.Status} received and load page ${page}`);
              });

            if (!serviceWindowOpen) {
              IGTMediaElements.showWindow();
            }

            IGTMediaElements.loadContent(`${location.origin}/reference_contents/vdm.html?launchPage=${page}`);
          }
        });

        eventSource.addEventListener("DisplayConfigurationChange", e => {
          IGTMediaElements.contentCache
            .setStateElement("sse_cfg", e.data, 0)
            .then(() => {
              IGTMediaElements.util.log.info("DisplayConfigurationChange notification event received");
            });
        });

        eventSource.onerror = function (e) {
          console.log("EventSource failed", e);
          // if (eventSource.readyState == 2) {
          //   sseConnectionTryTime -= 1;
          //   if (sseConnectionTryTime == 0) {
          //     eventSource.close();
          //   }
          // }
        };
      }, randomOneToFive * 1000)
    });
  } else {
    IGTMediaElements.util.log.error("[connection] websocket.vdm.igt.com is not set properly");
  }
});