/* jslint browser: true */

var odometerObject = {};

/**
 * Create Odometer Set from HTML elements
 * @param selector (Object)
 */
function BonusPool(selector) {
    var classEnum = {
        hidden: "app-odometer-hidden",
        one: "app-odometer-one",
        ten: "app-odometer-ten",
        onehundred: "app-odometer-one-hundred",
        onethousand: "app-odometer-one-thousand",
        tenthousand: "app-odometer-ten-thousand",
        onehundredthousand: "app-odometer-one-hundred-thousand"
    };

    if (!selector) {
        throw new Error("selector parameter is required");
    }
    console.log("selector =" + selector);
    var placesMatcher = /[0-9]+[^\. ]/;
    var currentLen = 0;
    $(selector).addClass(classEnum.hidden);

    $(selector).on('odometerdone', function (e) {
        $(selector).removeClass(classEnum.hidden);
    });

    this.update = function (value) {
        var decimalValue = value/100;
        $(selector).removeClass(classEnum.hidden);
        $(selector).removeClass(classEnum.one);
        $(selector).removeClass(classEnum.ten);
        $(selector).removeClass(classEnum.onehundred);
        $(selector).removeClass(classEnum.onethousand);
        $(selector).removeClass(classEnum.tenthousand);
        $(selector).removeClass(classEnum.onehundredthousand);

        var result = String(decimalValue).match(placesMatcher);

        var len = (result === null) ? 0 : result[0].length;
        if (decimalValue < 10)
            len = 1;
        switch (len) {
            case 0:
            case 1:
                $(selector).addClass(classEnum.one);
                break;
            case 2:
                $(selector).addClass(classEnum.ten);
                break;
            case 3:
                $(selector).addClass(classEnum.onehundred);
                break;
            case 4:
                $(selector).addClass(classEnum.onethousand);
                break;
            case 5:
                $(selector).addClass(classEnum.tenthousand);
                break;
            default:
                $(selector).addClass(classEnum.onehundredthousand);
        }

        // Odometer animation is not great when changing the font-size and removeing a digit.
        // This will hide the odometer during the downsizing aciton by adding a hidden class.
        // Once the action is complete hidden will be removed.
        if (currentLen > len) {
            $(selector).addClass(classEnum.hidden);
        }

        currentLen = len;
        $(selector).html(decimalValue.toFixed(2));
    };

    return {
        update: this.update
    };
}

/**
 * Create Odometer Set from HTML elements
 */
function createOdometerSet(tagList)
//be sure the tagList contains element ids that exist and are formatted as 'Odometer_bonusId' or  'Odometer_LevelName'
{
    for (var i = 0; i < tagList.length; i++) {
        if (document.getElementById(tagList[i]) == null) {
            throw new Error("attempted to create odometer on unknown element: " + tagList[i]);
        }
        var bonusPool = new BonusPool("[id='" + tagList[i] + "']");
        var split = tagList[i].split('Odometer_');
        var updateString = 'levelUpdate-' + split[1];
        window.addEventListener(updateString, levelUpdateCallback);
        odometerObject[split[1]] = bonusPool;
    }
}

var levelUpdateCallback = function (event) {
    if (odometerObject[event.detail.levelName] != null) {
        odometerObject[event.detail.levelName].update(event.detail.balance);
    }
    else if (odometerObject[event.detail.bonusId] != null) {
        odometerObject[event.detail.bonusId].update(event.detail.balance);
    }
};
