const {
	blueGrey,
	indigo,
	green,
	deepOrange,
	brown,
	amber,
	grey,
	orange,
	blue,
	lightGreen
} = require("@material-ui/core/colors");
const {
	mean,
	interquartileRange,
	quantile,
	min,
	max,
	sum,
	medianAbsoluteDeviation,
	modeSorted,
	medianSorted,
	uniqueCountSorted,
	variance,
	standardDeviation
} = require("simple-statistics");

const {
	subYears,
	getYear,
	format,
	addMinutes,
	addHours,
	addDays,
	addMonths,
	addYears,
	subMonths,
	startOfMonth,
	startOfDay,
	startOfYear,
	endOfYear,
	endOfMonth,
	endOfDay,
	differenceInYears,
	parse
} = require("date-fns");
const groupBy = require("lodash/groupBy");
const merge = require("lodash/merge");
// Conversions
const conversionFactors = {
	electricity: {
		energy: 3.4121416331, // kWh to kBtu
		// cost: 0.111, //$/kWh,
		emissions: 0.53 //CO2e
	},
	steam: {
		energy: 1.19, // lbs to kBtu,
		// cost: 0.0255, //$/lbs,
		emissions: 0.1397 //CO2e
	},
	hw: {
		energy: 1, // kBtu to kBtu,
		// cost: 0, //$/kBtu,
		emissions: 0 //CO2e
	},
	water: {
		energy: 0, // gals to kBtu,
		// cost: 0.019, //$/gal,
		emissions: 0 //CO2e
	},
	chw: {
		energy: 12, // TonHrs to kBtu,
		// cost: 0.186, //$/TonHr,
		emissions: 0 //CO2e
	},
	ng: {
		energy: 99.9761, // therm to kBtu,
		// cost: 0, //$/kWh,
		emissions: 11.7 //therm to lbs CO2e
	},
	oil: {
		energy: 165.726,
		emissions: 22.4
	}
};
const convert = (
	value,
	meterType,
	to,
	conversionFactors = conversionFactors
) => {
	return value * conversionFactors[meterType][to];
};
// Buildings and Meters
const units = {
	electricity: ["kWh", "MWh", "MJ", "kW"],
	steam: ["lbs", "kBtu", "btu"],
	chw: ["ton-hr", "kBtu", "btu"],
	ng: ["therm", "ccf", "mcf", "kBtu"],
	oil: ["gals", "barallel", "kBtu", "btu"],
	water: ["gals"]
};

// Formatting
const capFirst = (string = "") =>
	string.replace(
		/\w\S*/g,
		txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
const replaceAll = (string = "", search, replacement) =>
	string.replace(new RegExp(search, "g"), replacement);
const stringifyID = id =>
	id < 10 ? `00${id}` : id < 100 ? `0${id}` : String(id);
const formatNumber = number =>
	isNaN(number) ? "0" : parseInt(Math.round(number), 10).toLocaleString();
const formatFloat = number =>
	isNaN(number) ? "0" : parseFloat(number).toLocaleString();
const formatPercent = number =>
	isNaN(number) ? "0" : formatNumber(number * 100);
const toURLQuery = obj =>
	"?".concat(
		Object.keys(obj)
			.map(k => [k, obj[k]].join("="))
			.join("&")
	);
const parseQueryParams = query =>
	new Map(
		query
			.replace("?", "")
			.split("&")
			.map(s => s.split("="))
	);
//Map
const calcScale = (values, units = "") => {
	values = values.filter(v => v > 0);
	if (values.length < 1) return { low: 1, high: 2, max: 3, units };
	return {
		low: parseInt(quantile(values, 0.5), 10),
		high: parseInt(quantile(values, 0.75), 10),
		max: parseInt(max(values), 10),
		units
	};
};
const chooseIcon = (basename, { low, high }, value) => {
	let icon = `${basename}-err`;
	if (!value || !low || !high) return icon;
	value <= low
		? (icon = `${basename}-low`)
		: value <= high
			? (icon = `${basename}-med`)
			: (icon = `${basename}-high`);
	return icon;
};
//Charting Functions
const timeseriesToXY = (data, scale = 1) =>
	data.map(v => ({
		x: new Date(v[0]),
		y: v[1] / scale
	}));
// General Functions & Adjustments
const calcProgress = (value, baseline) => (value - baseline) / baseline;
const normalize = (x, min, max) => (x - min) / (max - min);
const normalizeBack = (x, min, max) => x * (max - min) + min;
const euiTimeScaler = (startDate, endDate) => {
	if (isNaN(startDate)) {
		startDate = new Date(startDate).valueOf();
	}
	if (isNaN(endDate)) {
		endDate = new Date(endDate).valueOf();
	}
	let msyear = 31557600000; // 365.25 days
	return msyear / (endDate - startDate);
};
const validEmail = string => {
	let nr = new RegExp(
		// eslint-disable-next-line
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
	return Boolean(string.match(nr));
};
// Statistics
const calcCVRMSE = (actual, simulated) => {
	var diffArray = [],
		actualValues = [];
	for (var i in actual) {
		diffArray.push(Math.pow(actual[i] - simulated[i], 2));
		actualValues.push(actual[i]);
	}
	var n = diffArray.length,
		p = 1.0;
	var ybar = sum(actualValues) / actualValues.length;
	var cvrmse = Math.sqrt(sum(diffArray) / (n - p)) / ybar;
	return cvrmse * 100;
};
const calcNMBE = (actual, simulated) => {
	var diffArray = [],
		actualValues = [];
	for (var i in actual) {
		diffArray.push(actual[i] - simulated[i]);
		actualValues.push(actual[i]);
	}
	var n = diffArray.length,
		p = 1.0;
	var ybar = sum(actualValues) / actualValues.length;
	var nmbe = sum(diffArray) / ((n - p) * ybar);
	return nmbe * 100;
};
const dataStatistics = (values, filterZero = false) => {
	if (filterZero) {
		values = values.filter(v => v > 0);
	}
	if (values.length < 2) {
		// throw new Error('Not Enough Values')
		return {};
	}
	values = values.sort();
	let iq = interquartileRange(values),
		q1 = quantile(values, 0.25),
		q3 = quantile(values, 0.75),
		lowerInnerFence = q1 - 1.5 * iq,
		lowerOuterFence = q3 - 3 * iq,
		upperInnerFence = q1 + 1.5 * iq,
		upperOuterFence = q3 + 3 * iq;
	return {
		iq,
		q1,
		q3,
		lowerInnerFence,
		lowerOuterFence,
		upperInnerFence,
		upperOuterFence,
		min: min(values),
		max: max(values),
		mean: mean(values),
		mode: modeSorted(values),
		median: medianSorted(values),
		medianAbsoluteDeviation: medianAbsoluteDeviation(values),
		uniqueCountSorted: uniqueCountSorted(values),
		standardDeviation: standardDeviation(values),
		variance: variance(values)
	};
};
const boxPlot = (values, filterZero = false) => {
	if (filterZero) {
		values = values.filter(v => v > 0);
	}
	if (values.length < 2) {
		throw new Error("not enough values");
	}
	let q1 = quantile(values, 0.25),
		q3 = quantile(values, 0.75),
		minVal = min(values),
		maxVal = max(values);
	return {
		q1,
		q3,
		min: minVal,
		max: maxVal
	};
};

// Dates
const intervalStart = (date, interval) => {
	//Supported Intervals: day, month, year
	let t;
	switch (interval) {
		case "day":
			t = startOfDay(date);
			break;
		case "month":
			t = startOfMonth(date);
			break;
		default:
			t = startOfYear(date);
	}
	return t.valueOf();
};
const dateRange = (startDate, endDate, interval, step = 1) => {
	// Supported Inervals: minutes,hour,day, month, year
	startDate = parse(startDate);
	endDate = parse(endDate);
	let range = [startDate];
	if (startDate >= endDate) return [];
	while (range[range.length - 1].valueOf() < endDate.valueOf()) {
		let d;
		switch (interval) {
			case "minute":
				d = addMinutes(range[range.length - 1], step);
				break;
			case "hour":
				d = addHours(range[range.length - 1], step);
				break;
			case "day":
				d = addDays(range[range.length - 1], step);
				break;
			case "month":
				d = addMonths(range[range.length - 1], step);
				break;
			default:
				d = addYears(range[range.length - 1], step);
		}
		range.push(d);
	}
	return range;
};

// Timeseries [[dateTime, value, origionalValue], ...]
// Stats
const minTimeseries = ts => min(ts.map(v => v[1]));
const maxTimeseries = ts => max(ts.map(v => v[1]));
const maxTimeseriesWithDate = ts => ts.sort((a, b) => b[1] - a[1])[0];
const cardinalityTimeseries = ts => new Set(ts.map(v => v[1])).size;
const getFirstTimestamp = ts => new Date(min(ts.map(v => v[0])));
const getLastTimestamp = ts => new Date(max(ts.map(v => v[0])));

// Formatting
const timeseriesToObject = ts =>
	ts
		.filter(t => t[1] !== NaN || t[1] !== null)
		.reduce((a, b) => Object.assign(a, { [b[0]]: b[1] }), {});
const objToTimeseries = ts =>
	Object.entries(ts)
		.map(([d, v]) => [new Date(d), v])
		.sort((a, b) => a[0] - b[0]);

// Merging
const mergeTimeseries = ({ raw = [], clean = [], forecast = [] }) => {
	let data = objToTimeseries(
		merge(
			timeseriesToObject(forecast),
			timeseriesToObject(raw),
			timeseriesToObject(clean)
		)
	);
	return data;
};
const mergeOrderedTimeseries = (...arrayOfTimeseries) => {
	let data = arrayOfTimeseries.map(a =>
		timeseriesToObject(a.map(v => [new Date(v[0]), v[1]]))
	);
	let merged = Object.assign(...data.reverse());
	// console.log(merged);
	let ts = objToTimeseries(merged);
	return ts;
};
// Reduce
const reduceTimeseries = (...arrays) => {
	let data = arrays.map(a =>
		a.map(([date, value]) => [new Date(date).valueOf(), value])
	);
	let ts = [
		...data.map(a => new Map(a)).reduce((a, b) => {
			for (var date of b.keys()) {
				a.has(date)
					? a.set(date, b.get(date) + a.get(date))
					: a.set(date, b.get(date));
			}
			return a;
		}, new Map())
	]
		.sort((a, b) => a[0] - b[0])
		.map(([date, value]) => [new Date(date), value]);
	return ts;
};
// Cleaning
const cleanTimeseries = (data, replacement, min, max) => {
	data = data.map(
		v => (v[1] > max || v[1] < min ? [v[0], replacement, v[1]] : v)
	);
	return data;
};
const uncleanTimeseries = data => data.map(r => (r[2] ? [r[0], r[2]] : r));
const interpolateTimeseries = (array, index) => {
	let prevIndex = index - 1 < 0 ? 0 : index - 1;
	let prev = array
		.slice(0, prevIndex)
		.filter(v => v[1])
		.reverse()[0];
	let next = array.slice(index + 1).filter(v => v[1])[0];
	return ((prev ? prev[1] : 0) + (next ? next[1] : 0)) / 2;
};
const cleanTimeseriesInterpolate = (data, min, max) => {
	data = data
		.map(v => (isNaN(v[1]) ? [v[0], 0, v[1]] : v))
		.map(v => (v[1] < min ? [v[0], null, v[1]] : v)) //min
		.map(v => (v[1] > max ? [v[0], null, v[1]] : v)) //max
		.map((v, i, array) => {
			if (!v[1]) {
				let avg = interpolateTimeseries(array, i);
				return [v[0], avg, v[2]];
			} else {
				return v;
			}
		}); //interpolate
	return data;
};
// Filtering
const filterTimeseries = (data, startDate, endDate) => {
	startDate = new Date(startDate);
	endDate = new Date(endDate);
	return data
		.map(([date, value]) => [new Date(date), value])
		.filter(t => t[0] >= startDate && t[0] <= endDate);
};
// Mapping and Sorting
const valuesTimeseries = data => data.map(v => v[1]);
const sortTimeseries = ts => ts.sort((a, b) => a[0] - b[0]);
// Grouping
const groupTimeseriesDay = ts =>
	Object.entries(groupBy(ts, v => startOfDay(v[0]))).map(
		([day, timeseries]) => [new Date(day), timeseries]
	);
const groupTimeseries = (data, interval) => {
	//Supported Intervals: day, month, year
	let group = data.map(v => [parse(v[0]).valueOf(), v[1]]).reduce((a, b) => {
		let t = intervalStart(b[0], interval);
		if (a.has(t)) {
			a.set(t, [...a.get(t), b]);
		} else {
			a.set(t, [b]);
		}
		return a;
	}, new Map());
	return [...group];
};
// Aggregation
const aggregateTimeSeries = (data, interval) => {
	//Supported Intervals: day, month, year
	let red = data.map(v => [parse(v[0]), v[1]]).reduce((a, b) => {
		let ts = intervalStart(b[0], interval);
		if (!a.has(ts)) {
			a.set(ts, b[1]);
		} else {
			a.set(ts, a.get(ts) + b[1]);
		}
		return a;
	}, new Map());
	data = [...red].map(v => [new Date(v[0]), v[1]]);
	return data;
};
const totalTimeseries = data => data.map(a => a[1]).reduce((a, b) => a + b, 0);
const averageTimeseries = data => mean(data.map(v => v[1]));
const monthlyValueWithTrend = (data, units, month, baseline) => {
	let dm = new Map(data);
	if (!dm.has(month.valueOf())) {
		return { value: 0, trend: { value: null, text: "" } };
	}
	let value = dm.get(month.valueOf()),
		baselineValue = dm.get(baseline.valueOf()) || 0;
	return {
		value,
		units,
		trend: {
			value: calcProgress(value, baselineValue) * 100,
			text: `${format(baseline, "MMM YYYY")}`
		}
	};
};
// ETC
const isTimeseriesUniform = data => cardinalityTimeseries(data) < 3;
const makeDailyTimeseries = (date, value, interval, step) => {
	let range = dateRange(date, endOfDay(date), interval);
	let data = range.map((d, i, arr) => [d.valueOf(), value / arr.length]);
	return data;
};
const findMissingDays = (data, { startDate, endDate } = {}) => {
	// Sort Data
	data = data.sort((a, b) => a[0] - b[0]);
	// Set Default Start Dates
	if (!startDate) {
		startDate = data[0][0];
	}
	if (!endDate) {
		endDate = data[data.length - 1][0];
	}
	let range = dateRange(startDate, endDate, "day");
	let fullTs = new Set(range.map(d => d.valueOf()));
	let dataDates = new Set(data.map(d => d[0]));
	let missing = new Set([...fullTs].filter(d => !dataDates.has(d)));
	return [...missing];
};

const calcTotals = (
	data,
	totalType,
	{ typeLimit = [], conversionFactors = conversionFactors } = {}
) => {
	let total = Object.keys(data)
		.filter(k => typeLimit.indexOf(k) === -1)
		.filter(k => conversionFactors.hasOwnProperty(k) && data[k].length > 0)
		.map(k => {
			return data[k].map(v => [
				v[0],
				convert(v[1], k, totalType, conversionFactors)
			]);
		})
		.reduce((a, b) => reduceTimeseries(a, b), []);
	return total;
};
const calcDataIntensity = (
	data = [],
	area = 1,
	startDate,
	endDate,
	{ typeLimit = [] } = {}
) => {
	let total = totalTimeseries(filterTimeseries(data, startDate, endDate));
	return (total / area) * euiTimeScaler(startDate, endDate);
};
// Energy
const calcMeterTotal = (
	data,
	type,
	startDate,
	endDate,
	limit = [],
	conversionFactors = conversionFactors
) => {
	let total = Object.keys(data)
		.filter(k => limit.indexOf(k) === -1)
		.filter(k => conversionFactors.hasOwnProperty(k) && data[k].length > 0)
		.map((k, i) =>
			filterTimeseries(data[k], startDate, endDate).map(v => [
				v[0],
				convert(v[1], k, type)
			])
		)
		.reduce((a, b) => reduceTimeseries(a, b), []);
	return total;
};
const calcEUI = (data, area, startDate, endDate, limit = []) => {
	let totalEnergy = totalTimeseries(
		calcMeterTotal(data, "energy", startDate, endDate, limit)
	);
	return (totalEnergy / area) * euiTimeScaler(startDate, endDate);
};
const calcIntensity = (
	data,
	type,
	area,
	startDate,
	endDate,
	limit = [],
	btu = false
) => {
	if (["energy", "emissions", "cost"].indexOf(type) !== -1) {
		let totalEnergy = totalTimeseries(
			calcMeterTotal(data, type, startDate, endDate, limit)
		);
		return (totalEnergy / area) * euiTimeScaler(startDate, endDate);
	} else {
		if (!data.hasOwnProperty(type)) return 0;
		let total = totalTimeseries(
			filterTimeseries(data[type], startDate, endDate)
		);
		let value = (total / area) * euiTimeScaler(startDate, endDate);
		return btu ? convert(value, type, "energy") : value;
	}
};

const EUIByType = (
	data,
	area,
	startDate,
	endDate,
	limit = [],
	conversionFactors = conversionFactors
) => {
	let years = new Array(differenceInYears(endDate, startDate) + 1)
		.fill(0)
		.map((v, i) => {
			let y = new Date(startDate.getFullYear() + i, 0);
			return [y, startOfMonth(endOfYear(y))];
		});
	let byType = Object.keys(data)
		.filter(
			k =>
				conversionFactors.hasOwnProperty(k) &&
				conversionFactors[k].energy > 0 &&
				limit.indexOf(k) === -1
		)
		.map((k, i) =>
			years.map(year => {
				let sd = year[0].valueOf();
				let ed = year[1].valueOf();
				if (ed > endDate.valueOf()) {
					ed = endDate.valueOf();
					sd = startOfMonth(subMonths(ed, 11)).valueOf();
				}
				let timeScaler = euiTimeScaler(sd, ed);
				let value = convert(
					(totalTimeseries(filterTimeseries(data[k], sd, ed)) *
						timeScaler) /
						area,
					k,
					"energy"
				);
				return {
					type: k,
					year: new Date(getYear(ed), 0).valueOf(),
					value
				};
			})
		);
	return byType;
};
const EUIByYear = (
	data,
	area,
	startDate,
	endDate,
	limit = [],
	baselineYear,
	conversionFactors = conversionFactors
) => {
	let years = new Array(differenceInYears(endDate, startDate) + 1)
		.fill(0)
		.map((v, i) => {
			let y = new Date(startDate.getFullYear() + i, 0);
			return [y, startOfMonth(endOfYear(y))];
		});
	let types = Object.keys(data).filter(
		k =>
			conversionFactors.hasOwnProperty(k) &&
			conversionFactors[k].energy > 0 &&
			limit.indexOf(k) === -1
	);
	let baseline = new Map(
		types.map(t => [
			t,
			calcIntensity(
				data,
				t,
				area,
				baselineYear.valueOf(),
				startOfMonth(endOfYear(baselineYear)).valueOf(),
				limit,
				true
			)
		])
	);
	years = years.map(([start, end]) => [
		start.valueOf(),
		types.map(t => {
			let value = calcIntensity(
				data,
				t,
				area,
				start.valueOf(),
				end.valueOf(),
				limit,
				true
			);
			return {
				type: t,
				progress: calcProgress(value, baseline.get(t)),
				value
			};
		})
	]);
	return years;
};
const calcBuildingEUI = (data, area) => {
	let eui;
	if (!data || !area) {
		eui = {
			year: 0,
			month: 0
		};
	} else {
		let yearStart = startOfYear(subYears(new Date(), 1)),
			yearEnd = endOfYear(yearStart),
			monthStart = startOfMonth(subMonths(new Date(), 2)),
			monthEnd = endOfMonth(monthStart);
		eui = {
			year: calcEUI(data, area, yearStart, yearEnd) || 0,
			month: calcEUI(data, area, monthStart, monthEnd) || 0
		};
	}
	return eui;
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
	oil: {
		type: "oil",
		name: "Fuel Oil",
		icon: "local_gas_station",
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
	"oil",
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

module.exports = {
	Meters,
	meterOrder,
	sortMeters,
	getAvailableMeters,
	simpleMeter,
	calcScale,
	chooseIcon,
	validEmail,
	toURLQuery,
	parseQueryParams,
	conversionFactors,
	units,
	convert,
	capFirst,
	replaceAll,
	stringifyID,
	formatNumber,
	formatFloat,
	formatPercent,
	calcProgress,
	normalize,
	normalizeBack,
	euiTimeScaler,
	calcCVRMSE,
	calcNMBE,
	boxPlot,
	minTimeseries,
	maxTimeseries,
	reduceTimeseries,
	filterTimeseries,
	groupTimeseries,
	groupTimeseriesDay,
	aggregateTimeSeries,
	totalTimeseries,
	averageTimeseries,
	makeDailyTimeseries,
	findMissingDays,
	calcEUI,
	calcBuildingEUI,
	calcIntensity,
	EUIByType,
	EUIByYear,
	calcMeterTotal,
	cleanTimeseriesInterpolate,
	dataStatistics,
	uncleanTimeseries,
	interpolateTimeseries,
	maxTimeseriesWithDate,
	valuesTimeseries,
	timeseriesToXY,
	cleanTimeseries,
	isTimeseriesUniform,
	monthlyValueWithTrend,
	getLastTimestamp,
	getFirstTimestamp,
	timeseriesToObject,
	objToTimeseries,
	mergeTimeseries,
	mergeOrderedTimeseries,
	sortTimeseries,
	calcTotals,
	calcDataIntensity
};
