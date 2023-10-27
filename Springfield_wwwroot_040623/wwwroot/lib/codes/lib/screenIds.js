/**
 * exports human friendly hexcode descriptions for screenTriggers
 * @exports screenIds
 */
(function (exports) {
    /*jslint maxlen: 200 */

    var codes = {};
    //Emulation Screen
    exports.EMULATION_SCREEN = '0x00';
    codes[exports.EMULATION_SCREEN] = 'Emulation Screen';
    //Welcome Screen
    exports.WELCOME_SCREEN = '0x10';
    codes[exports.WELCOME_SCREEN] = 'Welcome Screen';
    //Session Screen
    exports.SESSION_SCREEN = '0x11';
    codes[exports.SESSION_SCREEN] = 'Session Screen';
    //Invalid Card Screen
    exports.INVALID_CARD_SCREEN = '0x12';
    codes[exports.INVALID_CARD_SCREEN] = 'Invalid Card Screen';
    //Attendant Welcome Screen
    exports.ATTENDANT_WELCOME_SCREEN = '0x13';
    codes[exports.ATTENDANT_WELCOME_SCREEN] = 'Attendant Welcome Screen';
    //Xtra Credit Session Screen
    exports.XTRA_CREDIT_SESSION_SCREEN = '0x14';
    codes[exports.XTRA_CREDIT_SESSION_SCREEN] = 'Xtra Credit Session Screen';
    //Return Play Points To Go Screen
    exports.RETURN_PLAY_POINTS_TO_GO_SCREEN = '0x15';
    codes[exports.RETURN_PLAY_POINTS_TO_GO_SCREEN] = 'Return Play Points To Go Screen';
    //Return Play Award Screen
    exports.RETURN_PLAY_AWARD_SCREEN = '0x16';
    codes[exports.RETURN_PLAY_AWARD_SCREEN] = 'Return Play Award Screen';
    //Point Multiplier Screen
    exports.POINT_MULTIPLIER_SCREEN = '0x17';
    codes[exports.POINT_MULTIPLIER_SCREEN] = 'Point Multiplier Screen';
    //Carded Lucky Coin Pool 1Reset
    exports.POOL_1_CARDED_LUCKY_COIN_RESET = '0x1B';
    exports.CARDED_LUCKY_COIN_RESET = '0x1B';
    codes[exports.POOL_1_CARDED_LUCKY_COIN_RESET] = 'Pool 1 Carded Lucky Coin Reset';
    //Carded Lucky Coin Pool 1Reset
    exports.POOL_2_CARDED_LUCKY_COIN_RESET = '0x1C';
    codes[exports.POOL_2_CARDED_LUCKY_COIN_RESET] = 'Pool 2 Carded Lucky Coin Reset';
    //Carded Lucky Coin Pool 1Reset
    exports.POOL_3_CARDED_LUCKY_COIN_RESET = '0x1D';
    codes[exports.POOL_3_CARDED_LUCKY_COIN_RESET] = 'Pool 3  Carded Lucky Coin Reset';
    //Carded Lucky Coin Non-Participation
    exports.CARDED_LUCKY_COIN_NON_PARTICIPATION = '0x1E';
    codes[exports.CARDED_LUCKY_COIN_NON_PARTICIPATION] = 'Carded Lucky Coin Non-Participation';
    //Multi Property Carded Lucky Coin Non-Participation
    exports.MULTI_PROPERTY_CARDED_LUCKY_COIN_NON_PARTICIPATION = '0x1F';
    codes[exports.MULTI_PROPERTY_CARDED_LUCKY_COIN_NON_PARTICIPATION] = 'Multi Property Carded Lucky Coin Non-Participation';
    //Celebration Award
    exports.CELEBRATION_AWARD = '0x20';
    codes[exports.CELEBRATION_AWARD] = 'Celebration Award';
    //Bonus Win
    exports.LUCKY_COIN_WINNER = '0x21';
    exports.BONUS_WIN = '0x21';
    codes[exports.BONUS_WIN] = 'Bonus Win';
    //MJT Session
    exports.MJT_SESSION = '0x22';
    codes[exports.MJT_SESSION] = 'MJT Session';
    //MJT Session
    exports.UNIVERSAL_4_SCREEN = '0x23';
    codes[exports.UNIVERSAL_4_SCREEN] = 'Universal Screen 4';
    //Handpay / Jackpot
    exports.HANDPAY_JACKPOT = '0x24';
    codes[exports.HANDPAY_JACKPOT] = 'Handpay / Jackpot';
    //Lucky Coin Reminder
    exports.LUCKY_COIN_REMINDER = '0x25';
    codes[exports.LUCKY_COIN_REMINDER] = 'Lucky Coin Reminder';
    //Preliminary Welcome
    exports.PRELIMINARY_WELCOME = '0x26';
    codes[exports.PRELIMINARY_WELCOME] = 'Preliminary Welcome';
    //Personal Lucky Coin Status
    exports.PERSONAL_LUCKY_COIN_STATUS = '0x27';
    codes[exports.PERSONAL_LUCKY_COIN_STATUS] = 'Personal Lucky Coin Status';
    //Pool 1 Multi Property Carded Lucky Coin Jackpot
    exports.POOL_1_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT = '0x28';
    codes[exports.POOL_1_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 1 Multi Property Carded Lucky Coin Jackpot';
    //Pool 2 Multi Property Carded Player Jackpot
    exports.POOL_2_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT = '0x29';
    codes[exports.POOL_2_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 2 Multi Property Carded Lucky Coin Jackpot';
    //Pool 3 Multi Property Carded Player Jackpot
    exports.POOL_3_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT = '0x2A';
    codes[exports.POOL_3_MULTI_PROPERTY_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 3 Multi Property Carded Lucky Coin Jackpot';
    //Pool 1 Carded Lucky Coin Jackpot
    exports.POOL_1_CARDED_LUCKY_COIN_JACKPOT = '0x2B';
    codes[exports.POOL_1_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 1 Carded Lucky Coin Jackpot';
    //Pool 2 Carded Lucky Coin Jackpot
    exports.POOL_2_CARDED_LUCKY_COIN_JACKPOT = '0x2C';
    codes[exports.POOL_2_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 2 Carded Lucky Coin Jackpot';
    //Pool 3 Carded Lucky Coin Jackpot
    exports.POOL_3_CARDED_LUCKY_COIN_JACKPOT = '0x2D';
    codes[exports.POOL_3_CARDED_LUCKY_COIN_JACKPOT] = 'Pool 3 Carded Lucky Coin Jackpot';
    //TITO Event Screen
    exports.TITO_EVENT_SCREEN = '0x2E';
    codes[exports.TITO_EVENT_SCREEN] = 'TITO Event Screen';
    //Personal Lucky Coin Winner
    exports.PERSONAL_LUCKY_COIN_WINNER = '0x30';
    codes[exports.PERSONAL_LUCKY_COIN_WINNER] = 'Personal Lucky Coin Winner';
    //Anniversary Screen
    exports.ANNIVERSARY_SCREEN = '0x31';
    codes[exports.ANNIVERSARY_SCREEN] = 'Anniversary Screen';
    //Birthday Screen
    exports.BIRTHDAY_SCREEN = '0x32';
    codes[exports.BIRTHDAY_SCREEN] = 'Birthday Screen';
    //Xtra-Credit Exit Screen
    exports.XTRA_CREDIT_EXIT_SCREEN = '0x33';
    codes[exports.XTRA_CREDIT_EXIT_SCREEN] = 'Xtra-Credit Exit Screen';
    //Point Play Session
    exports.POINT_PLAY_SESSION = '0x34';
    codes[exports.POINT_PLAY_SESSION] = 'Point Play Session';
    //Point Play Session Exit
    exports.POINT_PLAY_SESSION_EXIT = '0x35';
    codes[exports.POINT_PLAY_SESSION_EXIT] = 'Point Play Session Exit';
    //Abandoned Card Screen
    exports.ABANDONED_CARD_SCREEN = '0x36';
    codes[exports.ABANDONED_CARD_SCREEN] = 'Abandoned Card Screen';
    //MJT Appreciation Time
    exports.MJT_APPRECIATION_TIME = '0x37';
    codes[exports.MJT_APPRECIATION_TIME] = 'MJT Appreciation Time';

    //Pool 1 Magic Coin Jackpot
    exports.POOL_1_MAGIC_COIN_JACKPOT = '0x38';
    codes[exports.POOL_1_MAGIC_COIN_JACKPOT] = 'Pool 1 Magic Coin Jackpot';
    //Pool 2 Magic Coin Jackpot
    exports.POOL_2_MAGIC_COIN_JACKPOT = '0x39';
    codes[exports.POOL_2_MAGIC_COIN_JACKPOT] = 'Pool 2 Magic Coin Jackpot';
    //Pool 3 Magic Coin Jackpot
    exports.POOL_3_MAGIC_COIN_JACKPOT = '0x3A';
    codes[exports.POOL_3_MAGIC_COIN_JACKPOT] = 'Pool 3 Magic Coin Jackpot';
    //Pool 1 Magic Coin Reset
    exports.POOL_1_MAGIC_COIN_RESET = '0x3B';
    codes[exports.POOL_1_MAGIC_COIN_RESET] = 'Pool 1 Magic Coin Reset';
    //Pool 2 Magic Coin Reset
    exports.POOL_2_MAGIC_COIN_RESET = '0x3C';
    codes[exports.POOL_2_MAGIC_COIN_RESET] = 'Pool 2 Magic Coin Reset';
    //Pool 3 Magic Coin Reset
    exports.POOL_3_MAGIC_COIN_RESET = '0x3D';
    codes[exports.POOL_3_MAGIC_COIN_RESET] = 'Pool 3  Magic Coin Reset';
    //Magic Coin Non-Participation
    exports.MAGIC_COIN_NON_PARTICIPATION = '0x3E';
    codes[exports.MAGIC_COIN_NON_PARTICIPATION] = 'Magic Coin Non-Participation';
    //Jackpot Screen
    exports.JACKPOT_SCREEN = '0x40';
    codes[exports.JACKPOT_SCREEN] = 'Jackpot Screen';
    //Pool 1 Multi Property Carded Lucky Coin Reset
    exports.POOL_1_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET = '0x44';
    codes[exports.POOL_1_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET] = 'Pool 1 Multi Property Carded Lucky Coin Reset';
    //Pool 2 Multi Property Carded Lucky Coin Reset
    exports.POOL_2_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET = '0x45';
    codes[exports.POOL_2_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET] = 'Pool 2 Multi Property Carded Lucky Coin Reset';
    //Pool 3 Multi Property Carded Lucky Coin Reset
    exports.POOL_3_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET = '0x46';
    codes[exports.POOL_3_MULTI_PROPERTY_CARDED_LUCKY_COIN_RESET] = 'Pool 3 Multi Property Carded Lucky Coin Reset';
    //Idle Screen
    exports.IDLE_SCREEN = '0x47';
    codes[exports.IDLE_SCREEN] = 'Idle Screen';
    //W2G Accrual Screen
    exports.W2G_ACCRUAL_SCREEN = '0x4B';
    codes[exports.W2G_ACCRUAL_SCREEN] = 'W2G Accrual Screen';
    //Reserved Screen used for IReserve
    exports.IRESERVE_SCREEN = '0x4C';
    codes[exports.IRESERVE_SCREEN] = 'IReserve Screen';
    //Universal Screen 1
    exports.UNIVERSAL_SCREEN_1 = '0x4D';
    codes[exports.UNIVERSAL_SCREEN_1] = 'Universal Screen 1';
    //Universal Screen 2
    exports.UNIVERSAL_SCREEN_2 = '0x4E';
    codes[exports.UNIVERSAL_SCREEN_2] = 'Universal Screen 2';
    //Universal Screen 3
    exports.UNIVERSAL_SCREEN_3 = '0x4F';
    codes[exports.UNIVERSAL_SCREEN_3] = 'Universal Screen 3';
    //Responsible Gaming Screen 1
    exports.RESPONSIBLE_GAMING_SCREEN_1 = '0x50';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_1] = 'Responsible Gaming Screen 1';
    //Responsible Gaming Screen 2
    exports.RESPONSIBLE_GAMING_SCREEN_2 = '0x51';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_2] = 'Responsible Gaming Screen 2';
    //Responsible Gaming Screen 3
    exports.RESPONSIBLE_GAMING_SCREEN_3 = '0x52';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_3] = 'Responsible Gaming Screen 3';
    //Responsible Gaming Screen 4
    exports.RESPONSIBLE_GAMING_SCREEN_4 = '0x53';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_4] = 'Responsible Gaming Screen 4';
    //Responsible Gaming Screen 5
    exports.RESPONSIBLE_GAMING_SCREEN_5 = '0x54';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_5] = 'Responsible Gaming Screen 5';
    //Responsible Gaming Screen 6
    exports.RESPONSIBLE_GAMING_SCREEN_6 = '0x55';
    codes[exports.RESPONSIBLE_GAMING_SCREEN_6] = 'Responsible Gaming Screen 6';
    //Smart Card Screen High balance warning
    exports.SMART_CARD_SCREEN_1 = '0x56';
    codes[exports.SMART_CARD_SCREEN_1] = 'Smart Card Screen High balance warning';
    //Smart Card Screen Low balance warning
    exports.SMART_CARD_SCREEN_2 = '0x57';
    codes[exports.SMART_CARD_SCREEN_2] = 'Smart Card Screen Low balance warning';
    //Smart Card Screen Card disabled
    exports.SMART_CARD_SCREEN_3 = '0x58';
    codes[exports.SMART_CARD_SCREEN_3] = 'Smart Card Screen Card disabled';
    //Smart Card Screen Transfer failure
    exports.SMART_CARD_SCREEN_4 = '0x59';
    codes[exports.SMART_CARD_SCREEN_4] = 'Smart Card Screen Transfer failure';
    //Smart Card Screen Auto-transfer
    exports.SMART_CARD_SCREEN_5 = '0x5A';
    codes[exports.SMART_CARD_SCREEN_5] = 'Smart Card Screen Auto-transfer';
    //Smart Card Screen Unregistered card active
    exports.SMART_CARD_SCREEN_6 = '0x5B';
    codes[exports.SMART_CARD_SCREEN_6] = 'Smart Card Screen Unregistered card active';
    //Smart Card Screen Please wait
    exports.SMART_CARD_SCREEN_7 = '0x5C';
    codes[exports.SMART_CARD_SCREEN_7] = 'Smart Card Screen Please wait';
    //Smart Card Screen Cashless unavailable
    exports.SMART_CARD_SCREEN_8 = '0x5D';
    codes[exports.SMART_CARD_SCREEN_8] = 'Smart Card Screen Cashless unavailable';
    //MJT Session Time Screen
    exports.MJT_SESSION_TIME_SCREEN = '0x5E';
    codes[exports.MJT_SESSION_TIME_SCREEN] = 'MJT Session Time Screen';
    //MJT Session Games Screen
    exports.MJT_SESSION_GAMES_SCREEN = '0x5F';
    codes[exports.MJT_SESSION_GAMES_SCREEN] = 'MJT Session Games Screen';
    //In Session Message Screen 1
    exports.IN_SESSION_MESSAGE_SCREEN_1 = '0x68';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_1] = 'In Session Message Screen 1';
    //In Session Message Screen 2
    exports.IN_SESSION_MESSAGE_SCREEN_2 = '0x69';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_2] = 'In Session Message Screen 2';
    //In Session Message Screen 3
    exports.IN_SESSION_MESSAGE_SCREEN_3 = '0x6A';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_3] = 'In Session Message Screen 3';
    //In Session Message Screen 4
    exports.IN_SESSION_MESSAGE_SCREEN_4 = '0x6B';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_4] = 'In Session Message Screen 4';
    //In Session Message Screen 5
    exports.IN_SESSION_MESSAGE_SCREEN_5 = '0x6C';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_5] = 'In Session Message Screen 5';
    //In Session Message Screen 6
    exports.IN_SESSION_MESSAGE_SCREEN_6 = '0x6D';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_6] = 'In Session Message Screen 6';
    //In Session Message Screen 7
    exports.IN_SESSION_MESSAGE_SCREEN_7 = '0x6E';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_7] = 'In Session Message Screen 7';
    //In Session Message Screen 8
    exports.IN_SESSION_MESSAGE_SCREEN_8 = '0x6F';
    codes[exports.IN_SESSION_MESSAGE_SCREEN_8] = 'In Session Message Screen 8';
    //Bonus By Player Group Screen 1
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_1 = '0x78';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_1] = 'Bonus By Player Group Screen 1';
    //Bonus By Player Group Screen 2
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_2 = '0x79';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_2] = 'Bonus By Player Group Screen 2';
    //Bonus By Player Group Screen 3
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_3 = '0x7A';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_3] = 'Bonus By Player Group Screen 3';
    //Bonus By Player Group Screen 4
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_4 = '0x7B';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_4] = 'Bonus By Player Group Screen 4';
    //Bonus By Player Group Screen 5
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_5 = '0x7C';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_5] = 'Bonus By Player Group Screen 5';
    //Bonus By Player Group Screen 6
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_6 = '0x7D';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_6] = 'Bonus By Player Group Screen 6';
    //Bonus By Player Group Screen 7
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_7 = '0x7E';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_7] = 'Bonus By Player Group Screen 7';
    //Bonus By Player Group Screen 8
    exports.BONUS_BY_PLAYER_GROUP_SCREEN_8 = '0x7F';
    codes[exports.BONUS_BY_PLAYER_GROUP_SCREEN_8] = 'Bonus By Player Group Screen 8';
    //VPC Pin Screen
    exports.CARD_EXIT_SCREEN = '0x80';
    codes[exports.CARD_EXIT_SCREEN] = 'Card Exit Screen';
    //Universal 5 Screen
    exports.UNIVERSAL_5_SCREEN = '0x81';
    codes[exports.UNIVERSAL_5_SCREEN] = 'Universal 5 Screen';
    //Menu Screen
    exports.MENU_SCREEN = '0x82';
    codes[exports.MENU_SCREEN] = 'Menu Screen';
    //Pin Entry Screen
    exports.PIN_ENTRY_SCREEN = '0x83';
    codes[exports.PIN_ENTRY_SCREEN] = 'Pin Entry Screen';
    //Point Play Screen
    exports.POINT_PLAY_SCREEN = '0x84';
    codes[exports.POINT_PLAY_SCREEN] = 'Point Play Screen';
    //Point Play Confirm Screen
    exports.POINT_PLAY_CONFIRM_SCREEN = '0x85';
    codes[exports.POINT_PLAY_CONFIRM_SCREEN] = 'Point Play Confirm Screen';
    //Cashless Transfer Screen
    exports.CASHLESS_TRANSFER_SCREEN = '0x86';
    codes[exports.CASHLESS_TRANSFER_SCREEN] = 'Cashless Transfer Screen';
    //Cashless Transfer Confirm Screen
    exports.CASHLESS_TRANSFER_CONFIRM_SCREEN = '0x87';
    codes[exports.CASHLESS_TRANSFER_CONFIRM_SCREEN] = 'Cashless Transfer Confirm Screen';
    //Account Summary Screen
    exports.ACCOUNT_SUMMARY_SCREEN = '0x88';
    codes[exports.ACCOUNT_SUMMARY_SCREEN] = 'Account Summary Screen';
    //SCC Transfer Entry Screen
    exports.SCC_TRANSFER_ENTRY_SCREEN = '0x89';
    codes[exports.SCC_TRANSFER_ENTRY_SCREEN] = 'SCC Transfer Entry Screen';
    //Universal Bonus Screen 1
    exports.UNIVERSAL_BONUS_SCREEN_1 = '0x8A';
    codes[exports.UNIVERSAL_BONUS_SCREEN_1] = 'Universal Bonus Screen 1';
    //Universal Bonus Screen 2
    exports.UNIVERSAL_BONUS_SCREEN_2 = '0x8B';
    codes[exports.UNIVERSAL_BONUS_SCREEN_2] = 'Universal Bonus Screen 2';
    //Universal Bonus Screen 3
    exports.UNIVERSAL_BONUS_SCREEN_3 = '0x8C';
    codes[exports.UNIVERSAL_BONUS_SCREEN_3] = 'Universal Bonus Screen 3';
    //Universal Bonus Screen 4
    exports.UNIVERSAL_BONUS_SCREEN_4 = '0x8D';
    codes[exports.UNIVERSAL_BONUS_SCREEN_4] = 'Universal Bonus Screen 4';
    //Universal Bonus Screen 5
    exports.UNIVERSAL_BONUS_SCREEN_5 = '0x8E';
    codes[exports.UNIVERSAL_BONUS_SCREEN_5] = 'Universal Bonus Screen 5';
    //Universal Bonus Screen 6
    exports.UNIVERSAL_BONUS_SCREEN_6 = '0x8F';
    codes[exports.UNIVERSAL_BONUS_SCREEN_6] = 'Universal Bonus Screen 6';
    //Universal Bonus Screen 7
    exports.UNIVERSAL_BONUS_SCREEN_7 = '0x90';
    codes[exports.UNIVERSAL_BONUS_SCREEN_7] = 'Universal Bonus Screen 7';
    //Universal Bonus Screen 8
    exports.UNIVERSAL_BONUS_SCREEN_8 = '0x91';
    codes[exports.UNIVERSAL_BONUS_SCREEN_8] = 'Universal Bonus Screen 8';
    //Universal Bonus Screen 9
    exports.UNIVERSAL_BONUS_SCREEN_9 = '0x92';
    codes[exports.UNIVERSAL_BONUS_SCREEN_9] = 'Universal Bonus Screen 9';
    //Universal Bonus Screen 10
    exports.UNIVERSAL_BONUS_SCREEN_10 = '0x93';
    codes[exports.UNIVERSAL_BONUS_SCREEN_10] = 'Universal Bonus Screen 10';
    //VPC PIN Screen
    exports.VPC_PIN_SCREEN = '0x94';
    codes[exports.VPC_PIN_SCREEN] = 'VPC PIN Screen';
    //VPC Pin Validating Screen
    exports.VPC_PIN_VALIDATING_SCREEN = '0x95';
    codes[exports.VPC_PIN_VALIDATING_SCREEN] = 'VPC Pin Validating Screen';
    //VPC Pin Locked Screen
    exports.VPC_PIN_LOCKED_SCREEN = '0x96';
    codes[exports.VPC_PIN_LOCKED_SCREEN] = 'VPC Pin Locked Screen';
    //VPC Pin Failure Screen
    exports.VPC_PIN_FAILURE_SCREEN = '0x97';
    codes[exports.VPC_PIN_FAILURE_SCREEN] = 'VPC Pin Failure Screen';
    //VPC Pin Success Screen
    exports.VPC_PIN_SUCCESS_SCREEN = '0x98';
    codes[exports.VPC_PIN_SUCCESS_SCREEN] = 'VPC Pin Success Screen';
    //VPC Host Down Screen
    exports.VPC_HOST_DOWN_SCREEN = '0x99';
    codes[exports.VPC_HOST_DOWN_SCREEN] = 'VPC Host Down Screen';
    //VPC Invalid Card Screen
    exports.VPC_INVALID_CARD_SCREEN = '0x9A';
    codes[exports.VPC_INVALID_CARD_SCREEN] = 'VPC Invalid Card Screen';
    //VPC Account Cancelled Screen
    exports.VPC_ACCOUNT_CANCELLED_SCREEN = '0x9B';
    codes[exports.VPC_ACCOUNT_CANCELLED_SCREEN] = 'VPC Account Cancelled Screen';
    //VPC No Limit Screen
    exports.VPC_NO_LIMIT_SCREEN = '0x9C';
    codes[exports.VPC_NO_LIMIT_SCREEN] = 'VPC No Limit Screen';
    //VPC Zero Limit Screen
    exports.VPC_ZERO_LIMIT_SCREEN = '0x9D';
    codes[exports.VPC_ZERO_LIMIT_SCREEN] = 'VPC Zero Limit Screen';
    //VPC Card In Use Screen
    exports.VPC_CARD_IN_USE_SCREEN = '0x9E';
    codes[exports.VPC_CARD_IN_USE_SCREEN] = 'VPC Card In Use Screen';
    //VPC Limit 1 Hit Screen
    exports.VPC_LIMIT_1_HIT_SCREEN = '0x9F';
    codes[exports.VPC_LIMIT_1_HIT_SCREEN] = 'VPC Limit 1 Hit Screen';
    //VPC Limit 2 Hit Screen
    exports.VPC_LIMIT_2_HIT_SCREEN = '0xA0';
    codes[exports.VPC_LIMIT_2_HIT_SCREEN] = 'VPC Limit 2 Hit Screen';
    //VPC Multiple Limit Hit Screen
    exports.VPC_MULTIPLE_LIMIT_HIT_SCREEN = '0xA1';
    codes[exports.VPC_MULTIPLE_LIMIT_HIT_SCREEN] = 'VPC Multiple Limit Hit Screen';
    //VPC Limit 1 Alert 1 Screen
    exports.VPC_LIMIT_1_ALERT_1_SCREEN = '0xA2';
    codes[exports.VPC_LIMIT_1_ALERT_1_SCREEN] = 'VPC Limit 1 Alert 1 Screen';
    //VPC Limit 1 Alert 2 Screen
    exports.VPC_LIMIT_1_ALERT_2_SCREEN = '0xA3';
    codes[exports.VPC_LIMIT_1_ALERT_2_SCREEN] = 'VPC Limit 1 Alert 2 Screen';
    //VPC Limit 2 Alert 1 Screen
    exports.VPC_LIMIT_2_ALERT_1_SCREEN = '0xA4';
    codes[exports.VPC_LIMIT_2_ALERT_1_SCREEN] = 'VPC Limit 2 Alert 1 Screen';
    //VPC Limit 2 Alert 2 Screen
    exports.VPC_LIMIT_2_ALERT_2_SCREEN = '0xA5';
    codes[exports.VPC_LIMIT_2_ALERT_2_SCREEN] = 'VPC Limit 2 Alert 2 Screen';
    //VPC Abandonded Card Screen
    exports.VPC_ABANDONDED_CARD_SCREEN = '0xA6';
    codes[exports.VPC_ABANDONDED_CARD_SCREEN] = 'VPC Abandonded Card Screen';
    //VPC Live Action Summary Screen
    exports.VPC_LIVE_ACTION_SUMMARY_SCREEN = '0xA7';
    codes[exports.VPC_LIVE_ACTION_SUMMARY_SCREEN] = 'VPC Live Action Summary Screen';
    //VPC Remove Card Screen
    exports.VPC_REMOVE_CARD_SCREEN = '0xA8';
    codes[exports.VPC_REMOVE_CARD_SCREEN] = 'VPC Remove Card Screen';
    //VPC Statement Available Screen
    exports.VPC_STATEMENT_AVAILABLE_SCREEN = '0xA9';
    codes[exports.VPC_STATEMENT_AVAILABLE_SCREEN] = 'VPC Statement Available Screen';
    //VPC Login Timeout Screen
    exports.VPC_LOGIN_TIMEOUT_SCREEN = '0xAA';
    codes[exports.VPC_LOGIN_TIMEOUT_SCREEN] = 'VPC Login Timeout Screen';
    //VPC Limit 1 Alert 3
    exports.VPC_LIMIT_1_ALERT_3 = '0xAB';
    codes[exports.VPC_LIMIT_1_ALERT_3] = 'VPC Limit 1 Alert 3';
    //VPC Limit 2 Alert 3
    exports.VPC_LIMIT_2_ALERT_3 = '0xAC';
    codes[exports.VPC_LIMIT_2_ALERT_3] = 'VPC Limit 2 Alert 3';
    //VPC Idle Screen
    exports.VPC_IDLE_SCREEN = '0xAD';
    codes[exports.VPC_IDLE_SCREEN] = 'VPC Idle Screen';
    //VPC Card-out Screen
    exports.VPC_CARD_OUT_SCREEN = '0xAE';
    codes[exports.VPC_CARD_OUT_SCREEN] = 'VPC Card-out Screen';
    //Scrn Tax Transfer
    exports.SCRN_TAX_TRANSFER = "0xAF";
    codes[exports.SCRN_TAX_TRANSFER] = 'Scrn Tax Transfer';

    /**
     * Return human friendly text for a given code
     * @param code {String} String representation of a hexcode
     */
    exports.getText = function (code) {
        if (codes.hasOwnProperty(code)) {
            return codes[code];
        } else {
            throw new Error('code does not exist: ' + code);
        }
    };

})(typeof exports === 'undefined' ?
    window.screenIds = {} :
    exports);
