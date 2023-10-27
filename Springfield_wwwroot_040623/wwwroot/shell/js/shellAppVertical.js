import Shell from './Shell';

let HomeURL = "";

window.onload = function () {
    //instantiate shell-core-logic and pass along json files to validate
    window.loglevel = log.noConflict();
    new Shell(window.location.href, "urlMapVertical.json", "statusMap.json", "M5Config.json", "ngxSubscriptionConfig.json");
};