// ---- Shell Sizing ----
// Provides logic for dynamic shell content sizing.

var coreWidth = '256px';
var coreHeight = '956px';
var displayWidth = '1280px';
var displayHeight = '1024px';
var bannerHeight = '68px';
var bannerPosition = 'bottom';//default to bottom
var xPosition = '0px';//horizontal offset set by positioning
var yPosition = '0px';
var urlParams;
var bannerActive = true;
var TestButtonListObject;

(window.onpopstate = function () {
    // Regex for replacing addition symbol with a space
    var match;
    var pl = /\+/g;
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
    };
    var query = window.location.search.substring(1);

    urlParams = {};

    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
})();


/**
 * Set display size.
 */
function setDisplaySize() {
    displayHeight = urlParams.displayHeight + "px";
    displayWidth = urlParams.displayWidth + "px";
    if (urlParams.bannerPosition !== undefined) {
        bannerPosition = urlParams.bannerPosition;
    }

    if ((urlParams.mediaDisplayWidth !== undefined && urlParams.contentWidth !== urlParams.mediaDisplayWidth) || (urlParams.mediaDisplayHeight !== undefined && urlParams.contentHeight !== urlParams.mediaDisplayHeight)) {
        setWindowSize(urlParams.mediaDisplayWidth, urlParams.mediaDisplayHeight);
    }
    else {
        setWindowSize(urlParams.contentWidth, urlParams.contentHeight);
    }
}

/**
 * Set window size.
 * @param width {number} Window width
 * @param height {number} Window height
 */
function setWindowSize(width, height) {
    const wrapperFrame = document.getElementById("WrapperFrame");
    const wrapperFrameErrorOverlay = document.getElementById("WrapperFrameOverLay");
    const bannerFrame = document.getElementById("BannerFrame");
    const pinContentFrame = document.getElementById("PinContentFrame");
    const shellBackgroundFrame = document.getElementById("ShellBackgroundFrame");

    if (width !== undefined && height !== undefined) {
        coreHeight = height + "px";
        coreWidth = width + "px";

        getbannerHeight();
    }

    if (urlParams.yPosition !== undefined) {
        yPosition = urlParams.yPosition + 'px';
    }
    else if (bannerActive && bannerPosition === 'top')//if active and top and missing yPos param, set as bannerheight
    {
        yPosition = bannerHeight;
    }

    if (bannerPosition === 'bottom')
    {
        bannerFrame.style.top = null;
    }

    if (urlParams.xPosition !== undefined) //if xPos exists, add it.
    {
        xPosition = urlParams.xPosition + 'px';
    }

    wrapperFrame.style.top = yPosition;
    wrapperFrame.style.left = xPosition;
    wrapperFrame.style.height = coreHeight;
    wrapperFrame.style.width = coreWidth;
    wrapperFrameErrorOverlay.style.top = yPosition;
    wrapperFrameErrorOverlay.style.left = xPosition;
    wrapperFrameErrorOverlay.style.height = coreHeight;
    wrapperFrameErrorOverlay.style.width = coreWidth;
    bannerFrame.style.width = displayWidth;
    bannerFrame.style.height = bannerHeight;
    bannerFrame.style[bannerPosition] = "0px";
    pinContentFrame.style.top = yPosition;
    pinContentFrame.style.left = xPosition;
    pinContentFrame.style.height = coreHeight;
    pinContentFrame.style.width = coreWidth;
    shellBackgroundFrame.style.top = yPosition;
    shellBackgroundFrame.style.left = xPosition;
    shellBackgroundFrame.style.height = coreHeight;
    shellBackgroundFrame.style.width = coreWidth;

    if (bannerActive) {
        bannerFrame.style.visibility = "visible";
    }
    else {
        bannerFrame.style.visibility = "hidden";
    }
}

/**
 * Retrieve core with and height and set the banner iframe height.
 * Sets banner height based on core width and height.
 */
function getbannerHeight() {
    //note: for now we need to re-interpret the size based on the new core dimensions
    bannerActive = true;

    if (size[coreWidth][coreHeight]) {
        displayWidth = size[coreWidth][coreHeight].width;
        displayHeight = size[coreWidth][coreHeight].height;
        if (coreWidth === "640px" && coreHeight === "240px") {
            bannerActive = false;
        }
    }

    if (bannerActive && bannerSize[displayWidth][displayHeight]) {
        if (displayWidth === "1920px" && displayHeight === "1080px" && coreWidth === "384px") {
            bannerHeight = bannerSize[displayWidth][displayHeight].banner384px;
        }
        else {
            bannerHeight = bannerSize[displayWidth][displayHeight].banner;
        }
    }
}

/**
 * verifies and stores existing test buttons
 */
function buildTestButtonList() {
    TestButtonListObject = {
        btn1: document.getElementById("btn1"),
        btn2: document.getElementById("btn2"),
        btn3: document.getElementById("btn3"),
        btn4: document.getElementById("btn4"),
        btn5: document.getElementById("btn5"),
        btn6: document.getElementById("btn6"),
        btn7: document.getElementById("btn7"),
        btn8: document.getElementById("btn8"),
        btn9: document.getElementById("btn9"),
        btn10: document.getElementById("btn10"),
        btn11: document.getElementById("btn11"),
        btn12: document.getElementById("btn12")
    };
}

/**
 * Event Listener for screen state window messages.
 * @param message {object} Window message
 */
window.addEventListener("message", function (event) {
    // fullscreenState is a command that indicates the host has changed it's full screen state.
    // if true the host is in full screen mode
    // if false the host is in normal mode
    if (event.data.cmd === "fullscreenState"){
        if(event.data.fullscreenState) {
            if (coreHeight > coreWidth) {
                layoutFullscreenVertical();
            }
            else {
                layoutFullscreenHorizontal();
            }
        }
        else {
            setDisplaySize();

            if (coreHeight > coreWidth) {
                layoutNormalVertical();
            }
            else {
                layoutNormalHorizontal();
            }
        }
    }
});

function layoutFullscreenVertical() {
    //testing code Vert
    for (var i = 1; i <= 5; i++) {
        if (TestButtonListObject["btn" + i] !== null) {
            TestButtonListObject["btn" + i].style.left = '2000px';
        }
    }
}

function layoutFullscreenHorizontal() {
    //testing code Horiz
    for (var i = 1; i <= 12; i++) {
        if (TestButtonListObject["btn" + i] !== null) {
            TestButtonListObject["btn" + i].style.top = '2000px';
        }
    }
}

function layoutNormalVertical() {
    //testing code vertical
    for (var i = 1; i <= 5; i++) {
        if (TestButtonListObject["btn" + i] !== null)
            TestButtonListObject["btn" + i].style.left = '384px';
    }
}

function layoutNormalHorizontal() {
    //testing code horizontal
    for (var i = 1; i <= 12; i++) {
        if (TestButtonListObject["btn" + i] !== null && i < 7) {
            TestButtonListObject["btn" + i].style.top = '260px';
        }
        else if (TestButtonListObject["btn" + i] !== null) {
            TestButtonListObject["btn" + i].style.top = '300px';
        }
    }
}