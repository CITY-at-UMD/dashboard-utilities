import {
    blueGrey,
    indigo,
    green,
    deepOrange,
    brown,
    amber,
    orange,
    blue,
    lightGreen
} from "@material-ui/core/colors";

const Meters = {
    eui: {
        type: "eui",
        name: "EUI",
        icon: "account_balance",
        color: blueGrey,
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
        color: blueGrey,
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
        color: green,
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
        color: deepOrange,
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
        color: orange,
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
        color: indigo,
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
        color: amber,
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
        color: blue,
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
        color: lightGreen,
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
        color: brown,
        units: "lbs CO2e",
        intensityUnits: "lbs CO2e/ft²",
        largeUnits: "1,000 lbs CO2e",
        demandUnits: "CO2e/hr",
        largeDemandUnits: "1,000 CO2e/hr"
    }
};

const meterOrder = [
    "eui",
    "energy",
    "emissions",
    "cost",
    "electricity",
    "steam",
    "ng",
    "chw",
    "hw",
    "water"
];
const simpleMeter = m => ({
    _id: m._id,
    type: m.type,
    isSubMeter: m.isSubMeter,
    isVirtualMeter: m.isVirtualMeter,
    name: m.name,
    units: m.units
});
const sortMeters = (a, b) =>
    meterOrder.indexOf(a) < meterOrder.indexOf(b) ? -1 : 1;
const getAvailableMeters = (buildings = [], total, emissions, cost) => {
    let meters = [
        ...new Set(
            buildings
                .map(b => Object.keys((b.data || {}).actual || {}))
                .reduce((a, b) => a.concat(b), [])
        )
    ].sort(sortMeters);
    if (emissions) meters.unshift("emissions");
    if (cost) meters.unshift("cost");
    if (total) meters.unshift("energy");
    return meters;
};

export { Meters, meterOrder, sortMeters, getAvailableMeters, simpleMeter };
