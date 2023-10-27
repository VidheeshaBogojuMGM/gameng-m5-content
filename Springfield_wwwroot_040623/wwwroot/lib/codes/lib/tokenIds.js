/**
 * exports human friendly hexcode descriptions for tokenUpdates
 * @exports tokenIds
 */
(function (exports) {
    /*jslint maxlen: 200 */

    var codes = {};
    //SRP Points Earned so far
    exports.SRP_POINTS_EARNED = '0x0F';
    codes[exports.SRP_POINTS_EARNED] = 'SRP Points Earned so far';
    //Machine Asset Number
    exports.MACHINE_ASSET_NUMBER = '0x10';
    codes[exports.MACHINE_ASSET_NUMBER] = 'Machine Asset Number';
    //Player Point Balance
    exports.PLAYER_POINT_BALANCE = '0x11';
    codes[exports.PLAYER_POINT_BALANCE] = 'Player Point Balance';
    //Player Point Countdown
    exports.PLAYER_POINT_COUNTDOWN = '0x12';
    codes[exports.PLAYER_POINT_COUNTDOWN] = 'Player Point Countdown';
    //Player Points Earned this session
    exports.PLAYER_POINTS_EARNED_SESSION = '0x13';
    codes[exports.PLAYER_POINTS_EARNED_SESSION] = 'Player Points Earned this session';
    //Last Machine Event Recorded
    exports.LAST_MACHINE_EVENT_RECORDED = '0x14';
    codes[exports.LAST_MACHINE_EVENT_RECORDED] = 'Last Machine Event Recorded';
    //'Free For All (Won So Far)
    exports.FREE_FOR_ALL_WON = '0x15';
    codes[exports.FREE_FOR_ALL_WON] = 'Free For All (Won So Far)';
    //Welcome Back Points to go
    exports.WELCOME_BACK_POINTS_TO_GO = '0x16';
    codes[exports.WELCOME_BACK_POINTS_TO_GO] = 'Welcome Back Points to go';
    //Unique Id (of BE2)
    exports.UNIQUE_ID_OF_BE2 = '0x17';
    codes[exports.UNIQUE_ID_OF_BE2] = 'Unique Id (of BE2)';
    //Current MJT Multiplier
    exports.CURRENT_MJT_MULTIPLIER = '0x18';
    codes[exports.CURRENT_MJT_MULTIPLIER] = 'Current MJT Multiplier';
    //Free Play Amount (in cents)
    exports.FREE_PLAY_AMOUNT_IN_CENTS = '0x19';
    codes[exports.FREE_PLAY_AMOUNT_IN_CENTS] = 'Free Play Amount (in cents)';
    //Match Play (Xtra Credit) Balance
    exports.MATCH_PLAY_XTRA_CREDIT_BALANCE = '0x1A';
    codes[exports.MATCH_PLAY_XTRA_CREDIT_BALANCE] = 'Match Play (Xtra Credit) Balance';
    //Player Point Balance available for Point Play
    exports.PLAYER_POINT_PLAY_BALANCE = '0x1B';
    codes[exports.PLAYER_POINT_PLAY_BALANCE] = 'Player Point Balance available for Point Play';
    //Point Multiplier integer token
    exports.POINT_MULTIPLIER_INTEGER_TOKEN = '0x1D';
    codes[exports.POINT_MULTIPLIER_INTEGER_TOKEN] = 'Point Multiplier integer token';
    //Amount of bonus/consolation win in coins
    exports.AMOUNT_OF_BONUS_WIN_IN_COINS = '0x1E';
    codes[exports.AMOUNT_OF_BONUS_WIN_IN_COINS] = 'Amount of bonus/consolation win in coins';
    //The current Bill Meter Denomination
    exports.BILL_METER_DENOMINATION = '0x20';
    codes[exports.BILL_METER_DENOMINATION] = 'The current Bill Meter Denomination';
    //The players cumulative SRP Award Amount
    exports.CUMULATIVE_SRP_AWARD_AMOUNT = '0x21';
    codes[exports.CUMULATIVE_SRP_AWARD_AMOUNT] = 'The players cumulative SRP Award Amount';
    //The SRP Award Amount for this players next Tier -0 if at top tier
    exports.SRP_AWARD_AMOUNT_NEXT_TIER = '0x22';
    codes[exports.SRP_AWARD_AMOUNT_NEXT_TIER] = 'The SRP Award Amount for this players next Tier -0 if at top tier';
    //The amount of Xtra Credit Inactive Storage
    exports.XTRA_CREDIT_INACTIVE_AMOUNT = '0x23';
    codes[exports.XTRA_CREDIT_INACTIVE_AMOUNT] = 'The amount of Xtra Credit Inactive Storage';
    //Current pool amount (Carded Lucky Coin)
    exports.CARDED_LUCKY_COIN_POOL = '0x24';
    codes[exports.CARDED_LUCKY_COIN_POOL] = 'Current pool amount (Carded Lucky Coin)';
    //Handpay Amount
    exports.HANDPAY_AMOUNT = '0x25';
    codes[exports.HANDPAY_AMOUNT] = 'Handpay Amount';
    //Free Play Amount (in cents)
    exports.FREE_PLAY_AMOUNT_CENTS = '0x26';
    codes[exports.FREE_PLAY_AMOUNT_CENTS] = 'Free Play Amount (in cents)';
    //Match Play (Xtra Credit) balance (in cents)
    exports.MATCH_PLAY_XTRA_CREDIT_CENTS = '0x27';
    codes[exports.MATCH_PLAY_XTRA_CREDIT_CENTS] = 'Match Play (Xtra Credit) balance (in cents)';
    //RPP (Personal Progressive) current pool balance in dollars
    exports.PERSONAL_PROGRESSIVE_DOLLARS = '0x28';
    codes[exports.PERSONAL_PROGRESSIVE_DOLLARS] = 'RPP (Personal Progressive) current pool balance in dollars';
    //Amount of bonus/consolation win in dollars
    exports.BONUS_CONSOLATION_WIN_DOLLARS = '0x29';
    codes[exports.BONUS_CONSOLATION_WIN_DOLLARS] = 'Amount of bonus/consolation win in dollars';
    //EFT balance for Current Card in dollars
    exports.EFT_BALANCE_CURRENT_CARD_DOLLARS = '0x2A';
    codes[exports.EFT_BALANCE_CURRENT_CARD_DOLLARS] = 'EFT balance for Current Card in dollars';
    //EFT Amount Transferred to machine in dollars
    exports.EFT_AMOUNT_TRANSFER_DOLLARS = '0x2B';
    codes[exports.EFT_AMOUNT_TRANSFER_DOLLARS] = 'EFT Amount Transferred to machine in dollars';
    //Welcome Back (Return Play) award amount in dollars
    exports.WELCOME_BACK_RETURN_PLAY_AWARD_DOLLARS = '0x2C';
    codes[exports.WELCOME_BACK_RETURN_PLAY_AWARD_DOLLARS] = 'Welcome Back (Return Play) award amount in dollars';
    //Funds Transfer Recall amount in dollars
    exports.FUNDS_TRANSFER_RECALL_AMOUNT_DOLLARS = '0x2D';
    codes[exports.FUNDS_TRANSFER_RECALL_AMOUNT_DOLLARS] = 'Funds Transfer Recall amount in dollars';
    //Comp balance money token
    exports.COMP_BALANCE_MONEY_TOKEN = '0x2E';
    codes[exports.COMP_BALANCE_MONEY_TOKEN] = 'Comp balance money token';
    //Players "Preferred" name
    exports.PLAYERS_PREFERRED_NAME = '0x30';
    codes[exports.PLAYERS_PREFERRED_NAME] = 'Players "Preferred" name';
    //Players Card Number
    exports.PLAYERS_CARD_NUMBER = '0x31';
    codes[exports.PLAYERS_CARD_NUMBER] = 'Players Card Number';
     //Normally NULL, changed to non-NULL on Abandoned Card
    exports.NON_NULL_ON_ABANDONED_CARD = '0x33';
    codes[exports.NON_NULL_ON_ABANDONED_CARD] = 'Normally NULL, changed to non-NULL on Abandoned Card';
    //The System Time
    exports.THE_SYSTEM_TIME = '0x34';
    codes[exports.THE_SYSTEM_TIME] = 'The System Time';
     //Floor location of duplicate card
    exports.FLOOR_LOCATION_DUPLICATE_CARD = '0x36';
    codes[exports.FLOOR_LOCATION_DUPLICATE_CARD] = 'Floor location of duplicate card';
    //The SRP threshold for the next tier – 0 if at top tier
    exports.SRP_THRESHOLD_NEXT_TIER = '0x40';
    codes[exports.SRP_THRESHOLD_NEXT_TIER] = 'The SRP threshold for th next tier – 0 if at top tier';
    //Points required to reach next threshold - 0 if at top tier
    exports.POINTS_TO_NEXT_THRESHOLD = '0x41';
    codes[exports.POINTS_TO_NEXT_THRESHOLD] = 'Points required to reach next threshold - 0 if at top tier';
    //'The SRP threshold for the top tier for this players level
    exports.SRP_THRESHOLD_TOP_TIER = '0x42';
    codes[exports.SRP_THRESHOLD_TOP_TIER] = 'The SRP threshold for the top tier for this players level';
    //Point Accumulation by player ranking points earned during session
    exports.POINT_ACCUMULATION_PLAYER_RANKING = '0x43';
    codes[exports.POINT_ACCUMULATION_PLAYER_RANKING] = 'Point Accumulation by player ranking points earned during session';
    //Current MJT counting down the seconds or games left
    exports.MJT_COUNTDOWN = '0x44';
    codes[exports.MJT_COUNTDOWN] = 'Current MJT counting down the seconds or games left';
    //Player ID
    exports.PLAYER_ID = '0x45';
    codes[exports.PLAYER_ID] = 'Player ID';
    //Player ID
    exports.DRAW_COUNTDOWN = '0x46';
    codes[exports.DRAW_COUNTDOWN] = 'Draw Countdown';
    //Player session games played
    exports.PLAYER_SESSION_GAMES_PLAYED = '0x47';
    codes[exports.PLAYER_SESSION_GAMES_PLAYED] = 'Player session games played';
    //Sum of all SRP awards for this player level
    exports.SUM_OF_SRP_PLAYER_LEVEL_AWARDS = '0x70';
    codes[exports.SUM_OF_SRP_PLAYER_LEVEL_AWARDS] = 'Sum of all SRP awards for this player level';
    //PLC (RPP, Personal Progressive) Eligibility Threshold
    exports.PLC_RPP_PERSONAL_PROGRESSIVE_THRESHOLD = '0x71';
    codes[exports.PLC_RPP_PERSONAL_PROGRESSIVE_THRESHOLD] = 'PLC (RPP, Personal Progressive) Eligibility Threshold';
    //PLC (RPP, Personal Progressive) Distance to go to eligibility threshold
    exports.PLC_RPP_PERSONAL_PROGRESSIVE_TO_GO = '0x72';
    codes[exports.PLC_RPP_PERSONAL_PROGRESSIVE_TO_GO] = 'PLC (RPP, Personal Progressive) Distance to go to eligibility threshold';
    //PLC (RPP, Personal Progressive) maximum possible award
    exports.PLC_RPP_PERSONAL_PROGRESSIVE_MAXIMUM_AWARD = '0x73';
    codes[exports.PLC_RPP_PERSONAL_PROGRESSIVE_MAXIMUM_AWARD] = 'PLC (RPP, Personal Progressive) maximum possible award';
    //PLC (RPP, Personal Progressive) Awarded Value
    exports.PLC_RPP_PERSONAL_PROGRESSIVE_AWARDED_VALUE = '0x74';
    codes[exports.PLC_RPP_PERSONAL_PROGRESSIVE_AWARDED_VALUE] = 'PLC (RPP, Personal Progressive) Awarded Value';
    //Same as "points countdown" but in money
    exports.POINTS_COUNTDOWN_IN_MONEY = '0x75';
    codes[exports.POINTS_COUNTDOWN_IN_MONEY] = 'Same as "points countdown" but in money';
    //Current Cashless Balance of Card (MSC or SCC)
    exports.CASHLESS_BALANCE_OF_CARD = '0x7A';
    codes[exports.CASHLESS_BALANCE_OF_CARD] = 'Current Cashless Balance of Card (MSC or SCC)';
    //Players total money available (Credit Meter + Card Balance for MSC or SCC)
    exports.TOTAL_MONEY_AVAILABLE = '0x7B';
    codes[exports.TOTAL_MONEY_AVAILABLE] = 'Players total money available (Credit Meter + Card Balance for MSC or SCC)';
    //'Free For All (Won So Far) in Cents
    exports.FREE_FOR_ALL_WON_CENTS = '0x7C';
    codes[exports.FREE_FOR_ALL_WON_CENTS] = 'Free For All (Won So Far) in Cents';
    //Floor Location
    exports.FLOOR_LOCATION = '0xAF';
    codes[exports.FLOOR_LOCATION] = 'Floor Location';
    //Assigned Numbers
    exports.ASSIGNED_NUMBERS = '0xB0';
    codes[exports.ASSIGNED_NUMBERS] = 'Assigned Numbers for Lucky Draw';
    //Winning Numbers
    exports.WINNING_NUMBERS = '0xB1';
    codes[exports.WINNING_NUMBERS] = 'Winning Numbers for Lucky Draw';
    //Time to Next Draw
    exports.TIME_TO_NEXT_DRAW = '0xB2';
    codes[exports.TIME_TO_NEXT_DRAW] = 'Time to Next Draw';
    //Draw Name
    exports.DRAW_NAME = '0xB3';
    codes[exports.DRAW_NAME] = 'Draw name';
    //VFD Message Line 1
    exports.VFD_MESSAGE_LINE_1 = '0xFE';
    codes[exports.VFD_MESSAGE_LINE_1] = 'VFD Message Line 1';
    //VFD Message Line 2
    exports.VFD_MESSAGE_LINE_2 = '0xFF';
    codes[exports.VFD_MESSAGE_LINE_2] = 'VFD Message Line 2';

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
    window.tokenIds = {} :
    exports);
