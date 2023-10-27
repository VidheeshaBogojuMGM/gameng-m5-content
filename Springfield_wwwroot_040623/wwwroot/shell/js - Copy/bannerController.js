var scrollTextObject;
var scrollText;
var textWidth;
var bannerBody;
var bannerText;
var eventButtonMask;

var bannerOffset;
var bannerWidth;
var leftMargin = 0;
var scrollRequired = false;

var TimeoutVar;
var serviceWindowOpen = true;
var IGTElementsExist = true;
var firstToggleOnLoad = true;

var ServiceWindowOpenText = "Open Service Window";
var ServiceWindowCloseText = "Close Service Window";

var debugW2G = true;
var handleW2GScreenTrigger = function(message){
    if(debugW2G) {
        updateBanner("W2G Jackpot for Id : " + message);
    }
    else {
        updateBanner("Jackpot Pending");
    }
}

var handleScrnTaxTransfer = function(message) {
    console.log('display message is: ' + message);
    updateBanner("Tax is being deducted");
}

//Screen Triggers doesn't require special handling
var screenTriggersList = [  "0x10","0x11","0x12","0x13","0x14","0x15","0x16","0x17","0x18","0x19","0x1A","0x1B",
                            "0x1C","0x1D","0x1E","0x1F","0x20","0x21","0x22","0x23","0x24","0x25","0x26","0x27",
                            "0x28","0x29","0x2A","0x2B","0x2C","0x2D","0x2E","0x2F","0x30","0x31","0x32","0x33",
                            "0x34","0x35","0x36","0x37","0x38","0x39","0x3A","0x3B","0x3C","0x3D","0x3E","0x40",
                            "0x41","0x42","0x43","0x44","0x45","0x46","0x47","0x48","0x49","0x4A","0x4D",
                            "0x4E","0x4F","0x50","0x51","0x52","0x53","0x54","0x55","0x56","0x57","0x58","0x59",
                            "0x5A","0x5B","0x5C","0x5D","0x5E","0x5F","0x68","0x69","0x6A","0x6B","0x6C","0x6D",
                            "0x6E","0x6F","0x78","0x79","0x7A","0x7B","0x7C","0x7D","0x7E","0x7F","0x80","0x81",
                            "0x82","0x83","0x84","0x85","0x86","0x87","0x88","0x89","0x8A","0x8B","0x8C","0x8D",
                            "0x8E","0x8F","0x90","0x91","0x92","0x93"];

//Screen Triggers requires special handling
var formattedTriggersList = [{id : "0x4B", func : handleW2GScreenTrigger}, {id: "0xAF", func : handleScrnTaxTransfer}];

function initBanner() {
    subscribeToScreenTriggers();
    startScroll();
}

function updateBanner(message) {
    document.getElementById("textToScroll").innerHTML = message;
}

function subscribeToScreenTriggers(){
    for(var i=0; i < screenTriggersList.length; i++) {
        IGTMediaElements.subscribeScreenTrigger(screenTriggersList[i], updateBanner);
    }

    for(var j=0; j < formattedTriggersList.length; j++) {
        IGTMediaElements.subscribeScreenTrigger(formattedTriggersList[j].id, formattedTriggersList[j].func);
    }
}
var processWindowState = function(data) {
    serviceWindowOpen = data.windowState;
    if( serviceWindowOpen ) {
        document.getElementById("ServiceWindowButton").className = "core-btn bannerButtonOn";
        document.getElementById("ServiceButtonText").innerHTML = ServiceWindowCloseText;
    }
    else{
        document.getElementById("ServiceWindowButton").className = "core-btn bannerButtonOff";
        document.getElementById("ServiceButtonText").innerHTML = ServiceWindowOpenText;
    }
};

IGTMediaElements.pubSub.subscribe(IGTMediaElements.WINDOW_STATE_TOPIC, processWindowState );

function toggleServiceWindow(){
    if (serviceWindowOpen && !firstToggleOnLoad) {
        IGTMediaElements.hideWindow();
    }
    else{
        firstToggleOnLoad = false;
        IGTMediaElements.showWindow();
    }
}

function toggleHostEvent(hostEventId, subEventId, onlineOnly, bonusId, Message, ButtonID){
    if (IGTElementsExist === true) {
        IGTMediaElements.hostEventButtonPress(hostEventId, subEventId, onlineOnly, bonusId);
    }
    if (scrollTextObject.style.display === 'none')
    {
        scrollTextObject.style.display = 'block';
    }

    //in order to toggle style changes, if there's a graphic here you're going to have to update it
    var buttonObject = document.getElementById(ButtonID);

    if (buttonObject !== null) {
        var toggledOn = (buttonObject.className === "core-btn eventButtonOn");
        if (toggledOn)
        {
            buttonObject.className = "core-btn eventButtonOff";
            scrollTextObject.innerHTML = Message;
        }
        else
        {
            buttonObject.className = "core-btn eventButtonOn";
            scrollTextObject.innerHTML = "";
        }

        for (var i = 0; i < buttonObject.childNodes.length; i++)
        {
            var childNode = buttonObject.childNodes[i];
            if (childNode.id === "HostImageOn")
            {
                if (!toggledOn)
                {
                    childNode.style.visibility = "visible";
                }
                else
                {
                    childNode.style.visibility = "hidden";
                }
            }
            if (childNode.id === "HostImageOff")
            {
                if (toggledOn)
                {
                    childNode.style.visibility = "visible";
                }
                else
                {
                    childNode.style.visibility = "hidden";
                }
            }
        }
    }

}

function startScroll(){
    scrollTextObject = document.getElementById("textToScroll");
    bannerBody = document.getElementById("bannerBody");
    bannerText = document.getElementById("bannerText");
    eventButtonMask = document.getElementById("EventButtonMask");
    setTimeout(verifyScroll, 2000);
}

function verifyScroll(){
    bannerWidth = bannerBody.clientWidth;
    bannerOffset = bannerText.offsetLeft;
    if (eventButtonMask !== null)
    {
        bannerWidth = eventButtonMask.offsetLeft;
    }
    if (scrollText !== scrollTextObject.innerHTML)
    {
        clearTimeout(TimeoutVar);
        scrollRequired = false;
        scrollTextObject.innerHTML+=" ";
        textWidth = scrollTextObject.clientWidth;
        leftMargin = 0;
        scrollTextObject.style.marginLeft = "0px";
        prepToScroll();
    }
    scrollText = scrollTextObject.innerHTML;
    setTimeout(verifyScroll, 3000);
}

function prepToScroll()
{
    if((textWidth + bannerOffset + leftMargin) > (bannerWidth *.95)) {
        //if bigger than 95 percent of banner
        scrollTextObject.innerHTML += scrollTextObject.innerHTML;
        scrollRequired = true;
        scrollTextByIFrame();
    }
    else
    {
        scrollRequired = false;
        clearTimeout(TimeoutVar);
    }
}

function scrollTextByIFrame() {
    if (scrollRequired) {
        if ((textWidth + bannerOffset + leftMargin) > (bannerOffset * .97)) {
            leftMargin -= 1;
            scrollTextObject.style.marginLeft = leftMargin + "px";
        }
        else {

            leftMargin = 0;
            scrollTextObject.style.marginLeft = 0 + "px";
        }
        TimeoutVar = setTimeout(scrollTextByIFrame, 30);
    }
}
