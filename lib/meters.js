"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.simpleMeter = exports.getAvailableMeters = exports.sortMeters = exports.meterOrder = exports.Meters = undefined;

var _colors = require("@material-ui/core/colors");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Meters = {
    eui: {
        type: "eui",
        name: "EUI",
        icon: "account_balance",
        color: _colors.blueGrey,
        units: "kBtu/ft²",
        intensityUnits: "kBtu/ft²",
        largeUnits: "kBtu/ft²",
        demandUnits: "kBtu/ft²/hr",
        largeDemandUnits: "kBtu/ft²/hr"
    },
    energy: {
        type: "energy",
        name: "Total Energy",
        icon: "account_balance",
        color: _colors.blueGrey,
        units: "kBtu",
        intensityUnits: "kBtu/ft²",
        largeUnits: "MBtu",
        demandUnits: "kBtu/hr",
        largeDemandUnits: "MBtu/hr"
    },
    electricity: {
        type: "electricity",
        name: "Electricity",
        icon: "power",
        color: _colors.green,
        units: "kWh",
        intensityUnits: "kWh/ft²",
        largeUnits: "MWh",
        demandUnits: "kW",
        largeDemandUnits: "MW"
    },
    steam: {
        type: "steam",
        name: "Steam",
        icon: "whatshot",
        color: _colors.deepOrange,
        units: "lbs",
        intensityUnits: "lbs/ft²",
        largeUnits: "1,000 lbs",
        demandUnits: "lbs/hr",
        largeDemandUnits: "1,000 lbs/hr"
    },
    ng: {
        type: "ng",
        name: "Natural Gas",
        icon: "grain",
        color: _colors.orange,
        units: "Therms",
        intensityUnits: "Therms/ft²",
        largeUnits: "1,000 Therms",
        demandUnits: "Therms/hr",
        largeDemandUnits: "1,000 Therms/hr"
    },
    chw: {
        type: "chw",
        name: "Chilled Water",
        icon: "ac_unit",
        color: _colors.indigo,
        units: "TonHrs",
        intensityUnits: "TonHrs/ft²",
        largeUnits: "1,000 TonHrs",
        demandUnits: "Tons",
        largeDemandUnits: "1,000 Tons"
    },
    hw: {
        type: "hw",
        name: "Hot Water",
        icon: "invert_colors",
        color: _colors.amber,
        units: "kBtu",
        intensityUnits: "kBtu/ft²",
        largeUnits: "Mbtu",
        demandUnits: "KBtu/hr",
        largeDemandUnits: "MBtu/hr"
    },
    water: {
        type: "water",
        name: "Water",
        icon: "opacity",
        color: _colors.blue,
        units: "gals",
        intensityUnits: "gals/ft²",
        largeUnits: "1,000 gals",
        demandUnits: "gals/hr",
        largeDemandUnits: "1,000 gals/hr"
    },
    cost: {
        type: "cost",
        name: "Cost",
        icon: "attach_money",
        color: _colors.lightGreen,
        units: "$",
        intensityUnits: "$/ft²",
        largeUnits: "$1,000",
        demandUnits: "$/hr",
        largeDemandUnits: "1,000 $/hr"
    },
    emissions: {
        type: "emissions",
        name: "CO2e Emissions",
        icon: "cloud",
        color: _colors.brown,
        units: "lbs CO2e",
        intensityUnits: "lbs CO2e/ft²",
        largeUnits: "1,000 lbs CO2e",
        demandUnits: "CO2e/hr",
        largeDemandUnits: "1,000 CO2e/hr"
    }
};

var meterOrder = ["eui", "energy", "emissions", "cost", "electricity", "steam", "ng", "chw", "hw", "water"];
var simpleMeter = function simpleMeter(m) {
    return {
        _id: m._id,
        type: m.type,
        isSubMeter: m.isSubMeter,
        isVirtualMeter: m.isVirtualMeter,
        name: m.name,
        units: m.units
    };
};
var sortMeters = function sortMeters(a, b) {
    return meterOrder.indexOf(a) < meterOrder.indexOf(b) ? -1 : 1;
};
var getAvailableMeters = function getAvailableMeters() {
    var buildings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var total = arguments[1];
    var emissions = arguments[2];
    var cost = arguments[3];

    var meters = [].concat(_toConsumableArray(new Set(buildings.map(function (b) {
        return Object.keys((b.data || {}).actual || {});
    }).reduce(function (a, b) {
        return a.concat(b);
    }, [])))).sort(sortMeters);
    if (emissions) meters.unshift("emissions");
    if (cost) meters.unshift("cost");
    if (total) meters.unshift("energy");
    return meters;
};

exports.Meters = Meters;
exports.meterOrder = meterOrder;
exports.sortMeters = sortMeters;
exports.getAvailableMeters = getAvailableMeters;
exports.simpleMeter = simpleMeter;
//# sourceMappingURL=meters.js.map