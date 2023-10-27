/**
 * exports human friendly hexcode descriptions for gameEvents
 * @exports gameEventIds
 */
(function (exports) {

    var codes = {};
    //Cashout ticket printed (the ASP BE2 erroneously sends 0x3F)
    exports.CASHOUT_TICKET_PRINTED = '0x3D';
    codes[exports.CASHOUT_TICKET_PRINTED] = 'Cashout ticket printed';
    //$1 Bill inserted
    exports.BILL_INSERTED_1 = '0x47';
    codes[exports.BILL_INSERTED_1] = '$1 Bill inserted';
    //$5 Bill inserted
    exports.BILL_INSERTED_5 = '0x48';
    codes[exports.BILL_INSERTED_5] = '$5 Bill inserted';
    //$10 Bill inserted
    exports.BILL_INSERTED_10 = '0x49';
    codes[exports.BILL_INSERTED_10] = '$10 Bill inserted';
    //$20 Bill inserted
    exports.BILL_INSERTED_20 = '0x4A';
    codes[exports.BILL_INSERTED_20] = '$20 Bill inserted';
    //$50 Bill inserted
    exports.BILL_INSERTED_50 = '0x4B';
    codes[exports.BILL_INSERTED_50] = '$50 Bill inserted';
    //$100 Bill inserted
    exports.BILL_INSERTED_100 = '0x4C';
    codes[exports.BILL_INSERTED_100] = '$100 Bill inserted';
    //$2 Bill inserted
    exports.BILL_INSERTED_2 = '0x4D';
    codes[exports.BILL_INSERTED_2] = '$2 Bill inserted';
    //$500 Bill inserted
    exports.BILL_INSERTED_500 = '0x4E';
    codes[exports.BILL_INSERTED_500] = '$500 Bill inserted';
    //Any other bill inserted
    exports.BILL_INSERTED_OTHER = '0x4F';
    codes[exports.BILL_INSERTED_OTHER] = 'Any other bill inserted';
    //$200 Bill inserted
    exports.BILL_INSERTED_200 = '0x50';
    codes[exports.BILL_INSERTED_200] = '$200 Bill inserted';
    //Cashout button pressed
    exports.CASHOUT_BUTTON_PRESSED = '0x66';
    codes[exports.CASHOUT_BUTTON_PRESSED] = 'Cashout button pressed';
    //Ticket inserted
    exports.TICKET_INSERTED = '0x67';
    codes[exports.TICKET_INSERTED] = 'Ticket inserted';

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
    window.gameEventIds = {} :
    exports);

