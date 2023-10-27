
var responsibleGamingConfig= {
    
    sessionScreenUrl:'http://10.182.0.40/reference_contents/spa_session_screen.html#/',                                    //Url where to go after exit RG App, SESSION_SCREEN url is recommend,default is 'http://localhost/patron/indexHoriz.html'.
    idleScreenUrl:'http://10.182.0.40/reference_contents/idle_screen.html',                                       //Url where to go after for uncarded player to exit RG App, idle url is recommend,default is 'http://localhost/idle/indexHoriz.html'.
    webAPIHost:'http://10.91.17.71:8680',                     // Installation configuration

    preferredDisplayType: "normal",                         //fullscreen ; normal
    notificationPreferredDisplayType: "normal",         //Notification page display type, value should be fullscreen or normal
    maxBudget : 99999999,                                   //the max value for budget setting
    currencySymbol:"$",                                     //current money symbol, please reference Advantage money symbol, if RG Web UI have set "System Currency Setting", this setting will be replaced.
    playerPinEnable : true,                                 //if enable, player must enter pin each time they save the Budget setting.
    passwordLength : 6,                                     //pin max length
    pageSize:{                                              //the reasons count limit on 'UN-ENROLLMENT' PAGE
        fullscreen:10,
        normal:3
    },
    alertSwitchVisible: true,
    infoCenterLocation: "",
    massachusettsEnable:true
}