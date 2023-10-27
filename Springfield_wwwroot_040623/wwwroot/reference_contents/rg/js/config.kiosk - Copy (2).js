
var responsibleGamingConfig= {
    
    kioskExitUrl:'',                                        //Url where to go after click "Exit" button on every kiosk pages, defualt is '/kiosk.html'
    webAPIHost:'http://10.91.17.71:8680',                    // Installation configuration

    maxBudget : 99999999,                                   //the max value for budget setting
    currencySymbol:"$",                                     //current money symbol, please reference Advantage money symbol, if RG Web UI have set "System Currency Setting", this setting will be replaced.
    playerPinEnable : false,                                 //if enable, player must enter pin each time they save the Budget setting.
    passwordLength : 6,                                     //pin max length
    pageSize:{                                              //the reasons count limit on 'UN-ENROLLMENT' PAGE
        fullscreen:10,
    },
    alertSwitchVisible: true,
    infoCenterLocation: "",
    massachusettsEnable:true
}