'use strict';

var DAILY_LIMIT = 0;
var WEEKLY_LIMIT = 1;
var MONTHLY_LIMIT = 2;
var NO_LIMIT = 0;
var LOSS_LIMIT = 1;
var TIME_LIMIT = 2;
var NO_LIMIT_LOSS = 3;
var NO_LIMIT_TIME = 4;
var LIMIT1 = 1;
var LIMIT2 = 2;

var globalState = {};

function processVPCData(vpcPlayerData, state) {
    globalState = state;
    let vpcConvertedData = {};
    vpcConvertedData.Limit1 = {};
    vpcConvertedData.Limit2 = {};
    vpcConvertedData.Limit1.Type = vpcPlayerData.limits[0].type;
    vpcConvertedData.Limit2.Type = vpcPlayerData.limits[1].type;
    vpcConvertedData.Limit1.Period = vpcPlayerData.limits[0].period;
    vpcConvertedData.Limit2.Period = vpcPlayerData.limits[1].period;
    vpcConvertedData.Limit1.Threshold1 = vpcPlayerData.limits[0].alertThresholds[0];
    vpcConvertedData.Limit1.Threshold2 = vpcPlayerData.limits[0].alertThresholds[1];
    vpcConvertedData.Limit1.MaxThreshold = vpcPlayerData.limits[0].threshold;
    vpcConvertedData.Limit2.Threshold1 = vpcPlayerData.limits[1].alertThresholds[0];
    vpcConvertedData.Limit2.Threshold2 = vpcPlayerData.limits[1].alertThresholds[1];
    vpcConvertedData.Limit2.MaxThreshold = vpcPlayerData.limits[1].threshold;
    vpcConvertedData.Limit1.Session = vpcPlayerData.limits[0].session;
    vpcConvertedData.Limit2.Session = vpcPlayerData.limits[1].session;
    vpcConvertedData.Limit1.Current = vpcPlayerData.limits[0].current;
    vpcConvertedData.Limit2.Current = vpcPlayerData.limits[1].current;
    vpcConvertedData.Limit1.Hit = vpcPlayerData.limits[0].hit;
    vpcConvertedData.Limit2.Hit = vpcPlayerData.limits[1].hit;
    vpcConvertedData.LimitToShow = vpcPlayerData.limitToShow;
    vpcConvertedData.TimeSinceLastLimitSet = vpcPlayerData.lastTimeLimitSet;
    vpcConvertedData.PlayerMessage = vpcPlayerData.playerMessage;
    vpcConvertedData.HaveHostData = vpcPlayerData.haveHostData;
    vpcConvertedData.Limit1.Percentage = (Number(vpcConvertedData.Limit1.Current / vpcConvertedData.Limit1.MaxThreshold) * 100);
    vpcConvertedData.Limit2.Percentage = (Number(vpcConvertedData.Limit2.Current / vpcConvertedData.Limit2.MaxThreshold) * 100);
    vpcConvertedData.Limit1.Percentage = roundPercentage(vpcConvertedData.Limit1.Percentage);
    vpcConvertedData.Limit2.Percentage = roundPercentage(vpcConvertedData.Limit2.Percentage);
    if ((vpcConvertedData.Limit1.Type === LOSS_LIMIT) || (vpcConvertedData.Limit1.Type === NO_LIMIT_LOSS)) {
        vpcConvertedData.Limit1.Current = roundUpLossLimit(vpcConvertedData.Limit1.Current);
        vpcConvertedData.Limit1.Session = roundUpLossLimit(vpcConvertedData.Limit1.Session);
    }
    else if ((vpcConvertedData.Limit1.Type === TIME_LIMIT) || (vpcConvertedData.Limit1.Type === NO_LIMIT_TIME)) {
        vpcConvertedData.Limit1.Current = roundUpTimeLimit(vpcConvertedData.Limit1.Current);
        vpcConvertedData.Limit1.Session = roundUpTimeLimit(vpcConvertedData.Limit1.Session);
    }
    if ((vpcConvertedData.Limit2.Type === LOSS_LIMIT) || (vpcConvertedData.Limit2.Type === NO_LIMIT_LOSS)) {
        vpcConvertedData.Limit2.Current = roundUpLossLimit(vpcConvertedData.Limit2.Current);
        vpcConvertedData.Limit2.Session = roundUpLossLimit(vpcConvertedData.Limit2.Session);
    }
    else if ((vpcConvertedData.Limit2.Type === TIME_LIMIT) || (vpcConvertedData.Limit2.Type === NO_LIMIT_TIME)) {
        vpcConvertedData.Limit2.Current = roundUpTimeLimit(vpcConvertedData.Limit2.Current);
        vpcConvertedData.Limit2.Session = roundUpTimeLimit(vpcConvertedData.Limit2.Session);
    }
    /* These are additional calcualted values to be used, left in raw format to interpret later */
    if (vpcConvertedData.Limit1.Hit === 0) {
        vpcConvertedData.Limit1.LeftToPlay = vpcConvertedData.Limit1.Current > vpcConvertedData.Limit1.MaxThreshold ? 0 : vpcConvertedData.Limit1.MaxThreshold - vpcConvertedData.Limit1.Current;
    }
    else {
        vpcConvertedData.Limit1.LeftToPlay = 0;
    }
    if (vpcConvertedData.Limit2.Hit === 0) {
        vpcConvertedData.Limit2.LeftToPlay = vpcConvertedData.Limit2.Current > vpcConvertedData.Limit2.MaxThreshold ? 0 : vpcConvertedData.Limit2.MaxThreshold - vpcConvertedData.Limit2.Current;
    }
    else {
        vpcConvertedData.Limit2.LeftToPlay = 0;
    }
    /* If over limit, calculate the overlimit value */
    if ((vpcConvertedData.Limit1.Hit === 1) && (vpcConvertedData.Limit1.Current >= vpcConvertedData.Limit1.MaxThreshold)) {
        vpcConvertedData.Limit1.Overlimit = vpcConvertedData.Limit1.Current - vpcConvertedData.Limit1.MaxThreshold;
    }
    else {
        vpcConvertedData.Limit1.Overlimit = 0;
    }

    if ((vpcConvertedData.Limit2.Hit === 1) && (vpcConvertedData.Limit2.Current >= vpcConvertedData.Limit2.MaxThreshold)) {
        vpcConvertedData.Limit2.Overlimit = vpcConvertedData.Limit2.Current - vpcConvertedData.Limit2.MaxThreshold;
    }
    else {
        vpcConvertedData.Limit2.Overlimit = 0;
    }

    /* Check if this a loyalty card or VPC only */
    if ((vpcPlayerData.cardId.length === 20) || (vpcPlayerData.cardId.length === 10)) {
        vpcConvertedData.IsCrownLoyalty = vpcPlayerData.cardId.substr(0, 1) !== '0';
    }
    else {
        vpcConvertedData.IsCrownLoyalty = false;
    }
    return convertVpcDataForDisplay(vpcConvertedData);
}
function roundPercentage(aValue) {
    if (aValue <= 0) {
        return 0;
    } else if (aValue >= 100) {
        return 100;
    } else {
        return Math.floor(aValue);
    }
}
function roundUpLossLimit(aValue) {
    return aValue < 0 ? 0 : Math.floor(aValue / 100) * 100;
}
function roundUpTimeLimit(aValue) {
    return aValue < 0 ? 0 : Math.floor(aValue / 60) * 60;
}

function convertVpcDataForDisplay(vpcData) {
    let vpcDisplayData = {};
    vpcDisplayData.Limit1 = {};
    vpcDisplayData.Limit2 = {};
    if ((vpcData.Limit1.Type === LOSS_LIMIT) || (vpcData.Limit1.Type === NO_LIMIT_LOSS)) {
        populateLossLimitData(vpcData, LIMIT1, vpcDisplayData);
        vpcDisplayData.Limit1.Name = "LOSS";
    }
    else if ((vpcData.Limit1.Type === TIME_LIMIT) || (vpcData.Limit1.Type === NO_LIMIT_TIME)) {
        populateTimeLimitData(vpcData, LIMIT1, vpcDisplayData);
        vpcDisplayData.Limit1.Name = "TIME";
    }
    /* Check limit 2 type and set values for display */
    if ((vpcData.Limit2.Type === LOSS_LIMIT) || (vpcData.Limit2.Type === NO_LIMIT_LOSS)) {
        populateLossLimitData(vpcData, LIMIT2, vpcDisplayData);
        vpcDisplayData.Limit2.Name = "LOSS";
    }
    else if ((vpcData.Limit2.Type === TIME_LIMIT) || (vpcData.Limit2.Type === NO_LIMIT_TIME)) {
        populateTimeLimitData(vpcData, LIMIT2, vpcDisplayData);
        vpcDisplayData.Limit2.Name = "TIME";
    }
    vpcDisplayData.Limit1.Type = convertLimitType(vpcData.Limit1.Type);
    vpcDisplayData.Limit2.Type = convertLimitType(vpcData.Limit2.Type);
    if (vpcData.playerMessage === undefined) {
        vpcDisplayData.PlayerMessage = vpcData.PlayerMessage;
    }
    else {
        vpcDisplayData.PlayerMessage = "\"" + vpcData.PlayerMessage + "\"";
    }
    vpcDisplayData.LimitToShow = vpcData.LimitToShow;
    vpcDisplayData.TimeSinceLastLimitSet = "Time since you last set a limit {0}".translate().changePlaceholder(convertSecondsToHoursMins(vpcData.TimeSinceLastLimitSet));
    vpcDisplayData.Limit1.Hit = vpcData.Limit1.Hit;
    vpcDisplayData.Limit2.Hit = vpcData.Limit2.Hit;
    vpcDisplayData.IsCrownLoyalty = vpcData.IsCrownLoyalty;
    vpcDisplayData.HaveHostData = vpcData.HaveHostData;
    vpcDisplayData.Limit1.ZeroLimit = (vpcData.Limit1.MaxThreshold === 0 && vpcData.Limit1.Type > 0 && vpcData.Limit1.Type < 3) ? true : false;
    vpcDisplayData.Limit2.ZeroLimit = (vpcData.Limit2.MaxThreshold === 0 && vpcData.Limit2.Type > 0 && vpcData.Limit2.Type < 3) ? true : false;
    vpcDisplayData.Limit1.Period = convertPeriodType(vpcData.Limit1.Period);
    vpcDisplayData.Limit2.Period = convertPeriodType(vpcData.Limit2.Period);
    vpcDisplayData.Limit1.Percentage = vpcData.Limit1.Percentage;
    vpcDisplayData.Limit2.Percentage = vpcData.Limit2.Percentage;
    return vpcDisplayData;
}


function convertLimitType(aValue) {
    if (aValue === NO_LIMIT) {
        return "No Limit";
    }
    else if (aValue === LOSS_LIMIT) {
        return "Loss";
    }
    else if (aValue === TIME_LIMIT) {
        return "Time";
    }
    else if (aValue === NO_LIMIT_LOSS) {
        return "No Limit Loss";
    }
    else if (aValue === NO_LIMIT_TIME) {
        return "No Limit Time";
    }
    else {
        return "Unknown";
    }
}

function convertPeriodType(aValue) {
    if (aValue === DAILY_LIMIT) {
        return "daily";
    }
    else if (aValue === WEEKLY_LIMIT) {
        return "weekly";
    }
    else if (aValue === MONTHLY_LIMIT) {
        return "monthly";
    }
    else {
        return "unknown";
    }
}

function populateTimeLimitData(vpcData, limitToPopulate, vpcDisplayData) {
    var periodType = "";
    var periodstr = "";
    if (limitToPopulate === 1) {
        switch (vpcData.Limit1.Period) {
            case DAILY_LIMIT:
                periodType = "today".translate();
                periodstr = "day".translate();
                break;
            case WEEKLY_LIMIT:
                periodType = "week".translate();
                periodstr = "week".translate();
                break;
            case MONTHLY_LIMIT:
                periodType = "month".translate();
                periodstr = "month".translate();
                break;
        }
        vpcDisplayData.Limit1.RemainingText = "Remaining {0}".translate().changePlaceholder(periodType);
        vpcDisplayData.Limit1.TotalText = "Total time {0}".translate().changePlaceholder(periodType);

        if (vpcData.Limit1.Type === NO_LIMIT_TIME)
            vpcDisplayData.Limit1.LimitSummary = "Time Spent".translate();
        else
            vpcDisplayData.Limit1.LimitSummary = "Your time limit is {0} per {1}".translate().changePlaceholder(convertSecondsToHoursMins(vpcData.Limit1.MaxThreshold), periodstr);

        vpcDisplayData.Limit1.SessionText = "Time spent this session".translate();
        vpcDisplayData.Limit1.RemainingAmount = convertSecondsToHoursMins(vpcData.Limit1.LeftToPlay);
        vpcDisplayData.Limit1.SessionAmount = convertSecondsToHoursMins(vpcData.Limit1.Session);
        vpcDisplayData.Limit1.TotalAmount = convertSecondsToHoursMins(vpcData.Limit1.Current);
        vpcDisplayData.Limit1.OverlimitText = convertSecondsToHoursMins(vpcData.Limit1.Overlimit);
    }
    else if (limitToPopulate === 2) {
        switch (vpcData.Limit2.Period) {
            case DAILY_LIMIT:
                periodType = "today".translate();
                periodstr = "day".translate();
                break;
            case WEEKLY_LIMIT:
                periodType = "week".translate();
                periodstr = "week".translate();
                break;
            case MONTHLY_LIMIT:
                periodType = "month".translate();
                periodstr = "month".translate();
                break;
        }

        vpcDisplayData.Limit2.RemainingText = "Remaining {0}".translate().changePlaceholder(periodType);
        vpcDisplayData.Limit2.TotalText = "Total time {0}".translate().changePlaceholder(periodType);

        if (vpcData.Limit2.Type === NO_LIMIT_TIME)
            vpcDisplayData.Limit2.LimitSummary = "Time Spent".translate();
        else
            vpcDisplayData.Limit2.LimitSummary = "Your time limit is {0} per {1}".translate().changePlaceholder(convertSecondsToHoursMins(vpcData.Limit2.MaxThreshold), periodstr);

        vpcDisplayData.Limit2.SessionText = "Time spent this session".translate();
        vpcDisplayData.Limit2.RemainingAmount = convertSecondsToHoursMins(vpcData.Limit2.LeftToPlay);
        vpcDisplayData.Limit2.SessionAmount = convertSecondsToHoursMins(vpcData.Limit2.Session);
        vpcDisplayData.Limit2.TotalAmount = convertSecondsToHoursMins(vpcData.Limit2.Current);
        vpcDisplayData.Limit2.OverlimitText = convertSecondsToHoursMins(vpcData.Limit2.Overlimit);
    }
}

function populateLossLimitData(vpcData, limitToPopulate, vpcDisplayData) {
    var periodType = "";
    var periodstr = "";
    if (limitToPopulate === 1) {
        switch (vpcData.Limit1.Period) {
            case DAILY_LIMIT:
                periodType = "today".translate();
                periodstr = "day".translate();
                break;
            case WEEKLY_LIMIT:
                periodType = "week".translate();
                periodstr = "week".translate();
                break;
            case MONTHLY_LIMIT:
                periodType = "month".translate();
                periodstr = "month".translate();
                break;
        }

        vpcDisplayData.Limit1.RemainingText = "Remaining {0}".translate().changePlaceholder(periodType);
        vpcDisplayData.Limit1.TotalText = "Total lost {0}".translate().changePlaceholder(periodType);
        if (vpcData.Limit1.Type === NO_LIMIT_LOSS)
            vpcDisplayData.Limit1.LimitSummary = "Money Lost".translate();
        else
            vpcDisplayData.Limit1.LimitSummary = "Your loss limit is {0} per {1}".translate().changePlaceholder(convertLossToDollars(vpcData.Limit1.MaxThreshold), periodstr);

        vpcDisplayData.Limit1.SessionText = "Lost this session".translate();
        vpcDisplayData.Limit1.RemainingAmount = convertLossToDollars(vpcData.Limit1.LeftToPlay);
        vpcDisplayData.Limit1.SessionAmount = vpcData.Limit1.Session < 0 ? convertLossToDollars(0) : convertLossToDollars(vpcData.Limit1.Session);
        vpcDisplayData.Limit1.TotalAmount = vpcData.Limit1.Current < 0 ? convertLossToDollars(0) : convertLossToDollars(vpcData.Limit1.Current);
        vpcDisplayData.Limit1.OverlimitText = convertLossToDollars(vpcData.Limit1.Overlimit);
    }
    else if (limitToPopulate === 2) {
        switch (vpcData.Limit2.Period) {
            case DAILY_LIMIT:
                periodType = "today".translate();
                periodstr = "day".translate();
                break;
            case WEEKLY_LIMIT:
                periodType = "week".translate();
                periodstr = "week".translate();
                break;
            case MONTHLY_LIMIT:
                periodType = "month".translate();
                periodstr = "month".translate();
                break;
        }

        vpcDisplayData.Limit2.RemainingText = "Remaining {0}".translate().changePlaceholder(periodType);
        vpcDisplayData.Limit2.TotalText = "Total lost {0}".translate().changePlaceholder(periodType);

        if (vpcData.Limit2.Type === NO_LIMIT_LOSS)
            vpcDisplayData.Limit2.LimitSummary = "Money Lost".translate();
        else
            vpcDisplayData.Limit2.LimitSummary = "Your loss limit is {0} per {1}".translate().changePlaceholder(convertLossToDollars(vpcData.Limit2.MaxThreshold), periodstr);

        vpcDisplayData.Limit2.SessionText = "Lost this session".translate();
        vpcDisplayData.Limit2.RemainingAmount = convertLossToDollars(vpcData.Limit2.LeftToPlay);
        vpcDisplayData.Limit2.SessionAmount = vpcData.Limit2.Session < 0 ? convertLossToDollars(0) : convertLossToDollars(vpcData.Limit2.Session);
        vpcDisplayData.Limit2.TotalAmount = vpcData.Limit2.Current < 0 ? convertLossToDollars(0) : convertLossToDollars(vpcData.Limit2.Current);
        vpcDisplayData.Limit2.OverlimitText = convertLossToDollars(vpcData.Limit2.Overlimit);
    }
}

function convertSecondsToHoursMins(aValue) {
    let m = Math.floor((aValue % 3600) / 60);
    let h = Math.floor(aValue / (60 * 60));
    let hourStr = h + "h";
    if ((m !== 0) && (h !== 0)) {
        let minuteStr = " " + m + "m";
        return hourStr + minuteStr;
    }
    else if (h === 0) {
        return m + "m";
    }
    else if (m === 0) {
        return hourStr;
    }
    return hourStr;
}

function convertLossToDollars(aValue) {
    let dollars = aValue / 100;
    dollars = Math.floor(dollars);
    return globalState.appConfig.currencySymbol + dollars;
}
