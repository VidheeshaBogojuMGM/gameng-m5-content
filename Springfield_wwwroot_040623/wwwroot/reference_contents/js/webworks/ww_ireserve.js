importScripts(`${location.origin}/lib/igt-media-elements/dist/igt-media-elements.js`);

let endpoint;

function getState(success, fail) {
  IGTMediaElements.getServerAddresses(['ireserve.igt.com']).then(serverAddresses => {
    const h = serverAddresses['ireserve.igt.com'];
    if (h && h !== 'UNKNOWN') {
      endpoint = h.trim().replace(/\/$/, '');
      IGTMediaElements.util.log.info(`[ireserve][worker] endpoint [${JSON.stringify(endpoint)}]`);
      return IGTMediaElements.getCurrentTokenValue('0x10');
    } else {
      return Promise.reject(new Error('[ireserve][worker] incorrect namespace for ireserve.igt.com'));
    }
  }).then((e) => {
    return new Promise(function (resolve) {
      IGTMediaElements.util.log.info(`[ireserve][worker] e.token.value [${JSON.stringify(e.token.value)}]`);
      resolve(e.token.value);
    });
  }).then((machineNumber) => {
    IGTMediaElements.util.log.info(`[ireserve][worker] machineNumber [${JSON.stringify(machineNumber)}]`);
    return fetch(`${endpoint}/iReserveWebPortal/api/iReserve/RetrieveEGMInfo/?machineNumber=${machineNumber}`);
  }).then((response) => {
    return response.json();
  }).then(res => {
    success(res);
  }).catch((error) => {
    fail(error);
  });
}

function keepLockingState() {
  getState(
    (data) => {
      if (data.IsLocked) {
        IGTMediaElements.util.log.info(`[ireserve][worker] machine is locked [${JSON.stringify(data)}]`);
        // navigateToIReserve
        IGTMediaElements.hostEventButtonPress(3, 1, false, 0);
      } else {
        IGTMediaElements.util.log.info('[ireserve][worker] machine is not locked');
      }

      IGTMediaElements.util.log.info('[ireserve][worker] will clear interval');
      clearInterval(intervalID);
      intervalID = null;
    },
    (error) => {
      if (error) {
        IGTMediaElements.util.log.error(`[ireserve][worker] error [${error}]`);
      }
      IGTMediaElements.util.log.info('[ireserve][worker] keep calling locking state');
    });
}

let intervalID = setInterval(keepLockingState, 10000);
keepLockingState();
