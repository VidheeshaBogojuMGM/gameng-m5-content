
var serviceWindowOpen = true;
function toggleServiceWindow(){
    if (serviceWindowOpen) {
        IGTMediaElements.hideWindow();
    }
    else{
        firstToggleOnLoad = false;
        IGTMediaElements.showWindow();
    }
}