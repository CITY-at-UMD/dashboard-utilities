const {
	blueGrey,
	indigo,
	green,
	deepOrange,
	brown,
	amber,
	orange,
	blue,
	lightGreen
} = require("@material-ui/core/colors");
import sum from "simple-statistics/sum";
import { filterTimeseries, totalTimeseries, euiTimeScaler } from "./index.js";
// Conversions
const conversionFactors = {
	electricity: {
		energy: 3.4121416331, // kWh to kBtu
		cost: 0.111, //$/kWh,
		emissions: 0.53 //CO2e
	},
	steam: {
		energy: 1.19, // lbs to kBtu,
		cost: 0.0255, //$/lbs,
		emissions: 0.1397 //CO2e
	},
	hw: {
		energy: 1, // kBtu to kBtu,
		cost: 0, //$/kBtu,
		emissions: 0 //CO2e
	},
	water: {
		energy: 0, // gals to kBtu,
		cost: 0.019, //$/gal,
		emissions: 0 //CO2e
	},
	chw: {
		energy: 12, // TonHrs to kBtu,
		cost: 0.186, //$/TonHr,
		emissions: 0 //CO2e
	},
	ng: {
		energy: 99.9761, // therm to kBtu,
		cost: 0, //$/kWh,
		emissions: 11.7 //therm to lbs CO2e
	}
};
const convert = (value, meterType, to) => {
	return value * conversionFactors[meterType][to];
};

// Buildings and Meters
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
const units = {
	electricity: ["kWh", "MWh", "MJ", "kW"],
	steam: ["lbs", "kBtu", "btu"],
	chw: ["ton-hr", "kBtu", "btu"],
	ng: ["therm", "ccf", "mcf", "kBtu"],
	oil: ["gals", "barallel", "kBtu", "btu"],
	water: ["gals"]
};

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

const SimpleMeter = m => ({
	_id: m._id,
	type: m.type,
	isSubMeter: m.isSubMeter,
	isVirtualMeter: m.isVirtualMeter,
	name: m.name,
	units: m.units
});
const sortMeters = (a, b) =>
	meterOrder.indexOf(a) < meterOrder.indexOf(b) ? -1 : 1;

const getAvailalbeMeters = (
	meters = [], // array of types, array of meters, 2d array of either previous
	{ total, emissions, cost } = {}
) => {
	if (!Array.isArray(meters)) meters = [meters];
	let meterTypes = meters
		.map(m => {
			if (Array.isArray(m)) {
				return m.map(t => (typeof t === "object" ? t.type : t));
			} else {
				return [m];
			}
		})
		.reduce((a, b) => a.concat(b), []);
	let utilities = [...new Set(meterTypes)].sort(sortMeters);
	if (emissions) utilities.unshift("emissions");
	if (cost) utilities.unshift("cost");
	if (total) utilities.unshift("energy");
	return utilities;
};

const calculateBreakdown = (startDate, endDate, ...utilities) => {
	// [{type, data}]
	let breakdown = utilities.map(({ type, data }) => {
		return {
			type,
			value: convert(
				totalTimeseries(filterTimeseries(data, startDate, endDate)),
				type,
				"energy"
			)
		};
	});
	return breakdown;
};
const calculateEUI = (startDate, endDate, area, ...utilities) => {
	let total = sum(
		utilities.map(({ type, data }) =>
			convert(
				totalTimeseries(filterTimeseries(data, startDate, endDate)),
				type,
				"energy"
			)
		)
	);
	return total / area * euiTimeScaler(startDate, endDate);
};

module.exports = {
	meterOrder,
	sortMeters,
	Meters,
	getAvailalbeMeters,
	SimpleMeter,
	units,
	convert,
	conversionFactors
};
