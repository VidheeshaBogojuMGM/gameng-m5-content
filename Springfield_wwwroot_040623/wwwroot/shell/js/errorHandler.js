"use strict";

var errorHandlingFullscreenFlag = false;

function iframeURLChange(iframe, callback) {
    var unloadHandler = function () {
        // Timeout needed because the URL changes immediately after
        // the `unload` event is dispatched.
        setTimeout(function () {
            try{
                if(iframe.contentWindow.location.href){
                    callback(iframe.contentWindow.location.href);
                }
            }
            catch (error) {
                displayCustomMissingContent(true);
            }
        }, 0);
    };

    function attachUnload() {
        // Remove the unloadHandler in case it was already attached.
        // Otherwise, the change will be dispatched twice.
        try{
            if(iframe.contentWindow){
                iframe.contentWindow.removeEventListener("unload", unloadHandler);
                iframe.contentWindow.addEventListener("unload", unloadHandler);
            }
        }
        catch (error) {
            displayCustomMissingContent(true);
        }
    }

    iframe.addEventListener("load", attachUnload);
    attachUnload();
}

function stopShowingFullscreen(){
    try{
        window.top.postMessage({cmd: "hide-full-screen"}, "*");
    }catch (e) {
        // Do nothing here on purpose
    }
}

function displayCustomMissingContent(displayError){
    // Display custom div over the top of wrapper frame
    var overlay = document.getElementById("WrapperFrameOverLay");

    if(overlay){
        if(displayError){
            overlay.style.display = "block";
            if(errorHandlingFullscreenFlag){
                stopShowingFullscreen();
            }
        }
        else{
            overlay.style.display = "none";
        }
    }
}

function checkTitleAndHideVal(pageTitle){
    var isError = false;

    //turn off custom missing content iframe
    //check if we got an error title rendered
    if (pageTitle.length >= 3){
        // 2 types of errors can be displayed in page title
        if(pageTitle.indexOf("IIS") === 0){
            // Example Title: 'IIS 7.5 Detailed Error - 404.0 - Not Found'
            var titleArray = pageTitle.split("-");
            if (titleArray.length === 3){
                var errorCodeStr = titleArray[1].trim().slice(0, 3);
                if(!isNaN(errorCodeStr)){
                    var errorCode = parseInt(errorCodeStr);
                    if (errorCode > 300 && errorCode < 600){
                        //turn on custom missing content iframe
                        isError = true;
                    }
                }
            }
        }
        else{
            // Example Title: '404 Not Found'
            var titleArray = pageTitle.split(" ");
            var notAvailableIndex = pageTitle.indexOf('is not available');
            if (titleArray.length > 0 && titleArray[0].length === 3 && !isNaN(titleArray[0])){
                var errorCode = parseInt(titleArray[0]);
                if (errorCode > 300 && errorCode < 600){
                    //turn on custom missing content iframe
                    isError = true;
                }
            }
            // Example: 'http://172.16.17.50/idle/index.html?localProtocolVers ... ... &debug=true is not available'
            else if(notAvailableIndex !== -1 && notAvailableIndex === (pageTitle.length - 16)){
                isError = true;
            }
        }
    }

    displayCustomMissingContent(isError);
}

function retryTitleCheck(element, currentCount){
    try{
        var title = element.contentWindow.document.title;
        if (title.length === 0 && currentCount < 50){
            //if page hasn't rendered, try catching title again
            setTimeout(function(){
                retryTitleCheck(element, ++currentCount);
            }, 20);
        }
        else{
            checkTitleAndHideVal(title);
        }
    }
    catch (error) {
        displayCustomMissingContent(true);
    }
}

function getJSONFile (MapUrl) {
    return new Promise (function (resolve, reject) {
        fetch(MapUrl).then(function(response) {
            if(!response.error) {
                resolve (response.json());
            }
            throw new Error(response.error);
        }).catch(function(error) {
            reject(error);
        });
    });
};

getJSONFile("M5Config.json").then(function (Data) {
    var m5Config = Data;

    if (m5Config && m5Config.enableWrapperFrameErrorOverlay){
        // Setting up WrapperFrame watching
        iframeURLChange(document.getElementById("WrapperFrame"), function () {
            var element = document.getElementById('WrapperFrame');
            retryTitleCheck(element, 0);
        });

        window.addEventListener("message", function (event) {
            // Monitor full screen state
            if (event.data.cmd === "fullscreenState"){
                errorHandlingFullscreenFlag = event.data.fullscreenState;
            }
        });
    }
});

