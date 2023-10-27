"use strict";

// Verify that the adPlayer iframe loaded properly
const VerifyAdPlayerLoad = function (adPlayerElement){
    IGTMediaElements.adPlayerLoaded(adPlayerElement).then(status => {
        if (!status) {
            adPlayerElement.style.display = "none";
        }
    });
}