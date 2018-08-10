"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utilities = require("./utilities.js");

var _utilities2 = _interopRequireDefault(_utilities);

var _meters = require("./meters.js");

var _meters2 = _interopRequireDefault(_meters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { utilities: _utilities2.default, meters: _meters2.default };
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.simpleMeter = exports.getAvailableMeters = exports.sortMeters = exports.meterOrder = exports.Meters = undefined;

var _colors = require("@material-ui/core/colors");

const Meters = {
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

const meterOrder = ["eui", "energy", "emissions", "cost", "electricity", "steam", "ng", "chw", "hw", "water"];
const simpleMeter = m => ({
    _id: m._id,
    type: m.type,
    isSubMeter: m.isSubMeter,
    isVirtualMeter: m.isVirtualMeter,
    name: m.name,
    units: m.units
});
const sortMeters = (a, b) => meterOrder.indexOf(a) < meterOrder.indexOf(b) ? -1 : 1;
const getAvailableMeters = (buildings = [], total, emissions, cost) => {
    let meters = [...new Set(buildings.map(b => Object.keys((b.data || {}).actual || {})).reduce((a, b) => a.concat(b), []))].sort(sortMeters);
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeseriesObjectToArray = exports.TimeseriesArrayToObject = exports.preAllocateTimeseriesMinutes = exports.getFirstTimestamp = exports.getLastTimestamp = exports.monthlyValueWithTrend = exports.isTimeseriesUniform = exports.cleanTimeseries = exports.timeseriesToXY = exports.valuesTimeseries = exports.maxTimeseriesWithDate = exports.interpolateTimeseries = exports.uncleanTimeseries = exports.spaceTypes = exports.dataStatistics = exports.cleanTimeseriesInterpolate = exports.calcMeterTotal = exports.EUIByYear = exports.EUIByType = exports.calcIntensity = exports.calcBuildingEUI = exports.calcEUI = exports.findMissingDays = exports.makeDailyTimeseries = exports.averageTimeseries = exports.totalTimeseries = exports.aggregateTimeSeries = exports.groupTimeseries = exports.filterTimeseries = exports.reduceTimeseries = exports.maxTimeseries = exports.minTimeseries = exports.boxPlot = exports.calcNMBE = exports.calcCVRMSE = exports.euiTimeScaler = exports.normalizeBack = exports.normalize = exports.calcProgress = exports.formatPercent = exports.formatFloat = exports.formatNumber = exports.stringifyID = exports.replaceAll = exports.capFirst = exports.convert = exports.buildingTypes = exports.units = exports.conversionFactors = exports.parseQueryParams = exports.toURLQuery = exports.validEmail = exports.chooseIcon = exports.calcScale = undefined;

var _simpleStatistics = require("simple-statistics");

var _dateFns = require("date-fns");

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
const units = {
  electricity: ["kWh", "MWh", "MJ", "kW"],
  steam: ["lbs", "kBtu", "btu"],
  chw: ["ton-hr", "kBtu", "btu"],
  ng: ["therm", "ccf", "mcf", "kBtu"],
  oil: ["gals", "barallel", "kBtu", "btu"],
  water: ["gals"]
};
const buildingTypes = ["Office", "Residential", "Lab", "Classroom", "Other", "Gym", "Resaurant", "Super Market", "Hospital", "Mid-Rise Apartment", "Hotel", "Retail", "Warehouse"];
const spaceTypes = ["Dining", "Kitchen", "Corridor", "ER_Exam", "ER_NurseStn", "ER_Trauma", "ER_Triage", "ICU_NurseStn", "ICU_Open", "ICU_PatRm", "Lab", "Lobby", "NurseStn", "OR", "Office", "PatCorridor", "PatRoom", "PhysTherapy", "Radiology", "Banquet", "Cafe", "GuestRoom", "Laundry", "Mechanical", "Retail", "Storage", "Apartment", "Attic", "BreakRoom", "ClosedOffice", "Conference", "Elec/MechRoom", "IT_Room", "OpenOffice", "PrintRoom", "Restroom", "Stair", "Vending", "Anesthesia", "BioHazard", "CleanWork", "DressingRoom", "Exam", "Hall", "Janitor", "LockerRoom", "Lounge", "MRI", "MRI_Control", "MedGas", "NurseStation", "PACU", "PhysicalTherapy", "PreOp", "ProcedureRoom", "Soil Work", "Toilet", "Xray", "Cafeteria", "Classroom", "Gym", "Library", "Back_Space", "Entry", "Point_of_Sale", "Auditorium", "Exercise", "GuestLounge", "Meeting", "PublicRestroom", "StaffLounge", "WholeBuilding", "Bulk", "Fine"];

// Formatting
const capFirst = (string = "") => string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
const replaceAll = (string = "", search, replacement) => string.replace(new RegExp(search, "g"), replacement);
const stringifyID = id => id < 10 ? `00${id}` : id < 100 ? `0${id}` : String(id);
const formatNumber = number => isNaN(number) ? "0" : parseInt(Math.round(number), 10).toLocaleString();
const formatFloat = number => isNaN(number) ? "0" : parseFloat(number).toLocaleString();
const formatPercent = number => isNaN(number) ? "0" : formatNumber(number * 100);
const toURLQuery = obj => "?".concat(Object.keys(obj).map(k => [k, obj[k]].join("=")).join("&"));
const parseQueryParams = query => new Map(query.replace("?", "").split("&").map(s => s.split("=")));
//Map
const calcScale = (values, units = "") => {
  values = values.filter(v => v > 0);
  if (values.length < 1) return { low: 1, high: 2, max: 3 };
  return {
    low: parseInt((0, _simpleStatistics.quantile)(values, 0.5), 10),
    high: parseInt((0, _simpleStatistics.quantile)(values, 0.75), 10),
    max: parseInt((0, _simpleStatistics.max)(values), 10),
    units
  };
};
const chooseIcon = (basename, { low, high }, value) => {
  let icon = `${basename}-err`;
  if (!value || !low || !high) return icon;
  value <= low ? icon = `${basename}-low` : value <= high ? icon = `${basename}-med` : icon = `${basename}-high`;
  return icon;
};
//Charting Functions
const timeseriesToXY = (data, scale = 1) => data.map(v => ({
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
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
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
  var ybar = (0, _simpleStatistics.sum)(actualValues) / actualValues.length;
  var cvrmse = Math.sqrt((0, _simpleStatistics.sum)(diffArray) / (n - p)) / ybar;
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
  var ybar = (0, _simpleStatistics.sum)(actualValues) / actualValues.length;
  var nmbe = (0, _simpleStatistics.sum)(diffArray) / ((n - p) * ybar);
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
  let iq = (0, _simpleStatistics.interquartileRange)(values),
      q1 = (0, _simpleStatistics.quantile)(values, 0.25),
      q3 = (0, _simpleStatistics.quantile)(values, 0.75),
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
    min: (0, _simpleStatistics.min)(values),
    max: (0, _simpleStatistics.max)(values),
    mean: (0, _simpleStatistics.mean)(values),
    mode: (0, _simpleStatistics.modeSorted)(values),
    median: (0, _simpleStatistics.medianSorted)(values),
    medianAbsoluteDeviation: (0, _simpleStatistics.medianAbsoluteDeviation)(values),
    uniqueCountSorted: (0, _simpleStatistics.uniqueCountSorted)(values),
    standardDeviation: (0, _simpleStatistics.standardDeviation)(values),
    variance: (0, _simpleStatistics.variance)(values)
  };
};
const boxPlot = (values, filterZero = false) => {
  if (filterZero) {
    values = values.filter(v => v > 0);
  }
  if (values.length < 2) {
    throw new Error("not enough values");
  }
  let q1 = (0, _simpleStatistics.quantile)(values, 0.25),
      q3 = (0, _simpleStatistics.quantile)(values, 0.75),
      minVal = (0, _simpleStatistics.min)(values),
      maxVal = (0, _simpleStatistics.max)(values);
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
      t = (0, _dateFns.startOfDay)(date);
      break;
    case "month":
      t = (0, _dateFns.startOfMonth)(date);
      break;
    default:
      t = (0, _dateFns.startOfYear)(date);
  }
  return t.valueOf();
};
const dateRange = (startDate, endDate, interval, step = 1) => {
  // Supported Inervals: minutes,hour,day, month, year
  startDate = (0, _dateFns.parse)(startDate);
  endDate = (0, _dateFns.parse)(endDate);
  let range = [startDate];
  if (startDate >= endDate) return [];
  while (range[range.length - 1].valueOf() < endDate.valueOf()) {
    let d;
    switch (interval) {
      case "minute":
        d = (0, _dateFns.addMinutes)(range[range.length - 1], step);
        break;
      case "hour":
        d = (0, _dateFns.addHours)(range[range.length - 1], step);
        break;
      case "day":
        d = (0, _dateFns.addDays)(range[range.length - 1], step);
        break;
      case "month":
        d = (0, _dateFns.addMonths)(range[range.length - 1], step);
        break;
      default:
        d = (0, _dateFns.addYears)(range[range.length - 1], step);
    }
    range.push(d);
  }
  return range;
};

// Timeseries [[dateTime, value, origionalValue], ...]
// Stats
const minTimeseries = ts => (0, _simpleStatistics.min)(ts.map(v => v[1]));
const maxTimeseries = ts => (0, _simpleStatistics.max)(ts.map(v => v[1]));
const maxTimeseriesWithDate = ts => ts.sort((a, b) => b[1] - a[1])[0];
const cardinalityTimeseries = ts => new Set(ts.map(v => v[1])).size;
const getFirstTimestamp = ts => new Date((0, _simpleStatistics.min)(ts.map(v => v[0])));
const getLastTimestamp = ts => new Date((0, _simpleStatistics.max)(ts.map(v => v[0])));
// Reduce
const reduceTimeseries = (...arrays) => [...arrays.map(a => new Map(a)).reduce((a, b) => {
  for (var date of b.keys()) {
    a.has(date) ? a.set(date, b.get(date) + a.get(date)) : a.set(date, b.get(date));
  }
  return a;
}, new Map())].sort((a, b) => a[0] - b[0]);
// Cleaning
const cleanTimeseries = (data, replacement, min, max) => {
  data = data.map(v => v[1] > max || v[1] < min ? [v[0], replacement, v[1]] : v);
  return data;
};
const uncleanTimeseries = data => data.map(r => r[2] ? [r[0], r[2]] : r);
const interpolateTimeseries = (array, index) => {
  let prevIndex = index - 1 < 0 ? 0 : index - 1;
  let prev = array.slice(0, prevIndex).filter(v => v[1]).reverse()[0];
  let next = array.slice(index + 1).filter(v => v[1])[0];
  return ((prev ? prev[1] : 0) + (next ? next[1] : 0)) / 2;
};
const cleanTimeseriesInterpolate = (data, min, max) => {
  data = data.map(v => isNaN(v[1]) ? [v[0], 0, v[1]] : v).map(v => v[1] < min ? [v[0], null, v[1]] : v) //min
  .map(v => v[1] > max ? [v[0], null, v[1]] : v) //max
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
const filterTimeseries = (data, startDate, endDate) => data.filter(t => t[0] >= startDate && t[0] <= endDate);
// Mapping
const valuesTimeseries = data => data.map(v => v[1]);
// Pre Allocate
const preAllocateTimeseriesMinutes = () => {
  let o = {};
  for (var h = 0; h < 24; h++) {
    o[h] = {};
    for (var m = 0; m < 60; m++) {
      o[h][m] = null;
    }
  }
  return o;
};
// const preAllocateTimeseriesSeconds = () => {
//   let o = {};
//   for (var h = 0; h < 24; h++) {
//     o[h] = {};
//     for (var m = 0; m < 60; m++) {
//       o[h][m] = {};
//       for (var s = 0; s < 60; s++) {
//         o[h][m][s] = null;
//       }
//     }
//   }
//   return o;
// };
// Transform
const TimeseriesArrayToObject = data => {
  let days = groupTimeseries(data, "day").map(([day, ts]) => {
    let obj = preAllocateTimeseriesMinutes();
    for (var x = 0; x < ts.length; x++) {
      let hr = (0, _dateFns.getHours)(ts[x][0]),
          m = (0, _dateFns.getMinutes)(ts[x][0]);
      obj[hr][m] = ts[x][1];
    }
    return [day, obj];
  });
  return days;
};
const TimeseriesObjectToArray = (data, timestamp) => {
  let array = Object.keys(data).map(h => Object.keys(data[h]).map(m => Object.keys(data[h][m].map(s => [(0, _dateFns.setHours)((0, _dateFns.setMinutes)((0, _dateFns.setSeconds)(timestamp, s), m), h), data[h][m]])))).reduce((a, b) => a.concat(b)).sort((a, b) => a[0].valueOf() - b[0].valueOf());
  return array;
};
// Grouping
const groupTimeseries = (data, interval) => {
  //Supported Intervals: day, month, year
  let group = data.map(v => [(0, _dateFns.parse)(v[0]).valueOf(), v[1]]).reduce((a, b) => {
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
  let red = data.map(v => [(0, _dateFns.parse)(v[0]), v[1]]).reduce((a, b) => {
    let ts = intervalStart(b[0], interval);
    if (!a.has(ts)) {
      a.set(ts, b[1]);
    } else {
      a.set(ts, a.get(ts) + b[1]);
    }
    return a;
  }, new Map());
  data = [...red].map(v => [new Date(v[0]).valueOf(), v[1]]);
  return data;
};
const totalTimeseries = data => data.map(a => a[1]).reduce((a, b) => a + b, 0);
const averageTimeseries = data => (0, _simpleStatistics.mean)(data.map(v => v[1]));
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
      text: `${(0, _dateFns.format)(baseline, "MMM YYYY")}`
    }
  };
};
// ETC
const isTimeseriesUniform = data => cardinalityTimeseries(data) < 3;
const makeDailyTimeseries = (date, value, interval, step) => {
  let range = dateRange(date, (0, _dateFns.endOfDay)(date), interval);
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

// Energy
const calcMeterTotal = (data, type, startDate, endDate, limit = []) => {
  let total = Object.keys(data).filter(k => limit.indexOf(k) === -1).filter(k => conversionFactors.hasOwnProperty(k) && data[k].length > 0).map((k, i) => filterTimeseries(data[k], startDate, endDate).map(v => [v[0], convert(v[1], k, type)])).reduce((a, b) => reduceTimeseries(a, b), []);
  return total;
};
const calcEUI = (data, area, startDate, endDate, limit = []) => {
  let totalEnergy = totalTimeseries(calcMeterTotal(data, "energy", startDate, endDate, limit));
  return totalEnergy / area * euiTimeScaler(startDate, endDate);
};
const calcIntensity = (data, type, area, startDate, endDate, limit = [], btu = false) => {
  if (["energy", "emissions", "cost"].indexOf(type) !== -1) {
    let totalEnergy = totalTimeseries(calcMeterTotal(data, type, startDate, endDate, limit));
    return totalEnergy / area * euiTimeScaler(startDate, endDate);
  } else {
    if (!data.hasOwnProperty(type)) return 0;
    let total = totalTimeseries(filterTimeseries(data[type], startDate, endDate));
    let value = total / area * euiTimeScaler(startDate, endDate);
    return btu ? convert(value, type, "energy") : value;
  }
};

const EUIByType = (data, area, startDate, endDate, limit = []) => {
  let years = new Array((0, _dateFns.differenceInYears)(endDate, startDate) + 1).fill(0).map((v, i) => {
    let y = new Date(startDate.getFullYear() + i, 0);
    return [y, (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(y))];
  });
  let byType = Object.keys(data).filter(k => conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1).map((k, i) => years.map(year => {
    let sd = year[0].valueOf();
    let ed = year[1].valueOf();
    if (ed > endDate.valueOf()) {
      ed = endDate.valueOf();
      sd = (0, _dateFns.startOfMonth)((0, _dateFns.subMonths)(ed, 11)).valueOf();
    }
    let timeScaler = euiTimeScaler(sd, ed);
    let value = convert(totalTimeseries(filterTimeseries(data[k], sd, ed)) * timeScaler / area, k, "energy");
    return {
      type: k,
      year: new Date((0, _dateFns.getYear)(ed), 0).valueOf(),
      value
    };
  }));
  return byType;
};
const EUIByYear = (data, area, startDate, endDate, limit = [], baselineYear) => {
  let years = new Array((0, _dateFns.differenceInYears)(endDate, startDate) + 1).fill(0).map((v, i) => {
    let y = new Date(startDate.getFullYear() + i, 0);
    return [y, (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(y))];
  });
  let types = Object.keys(data).filter(k => conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1);
  let baseline = new Map(types.map(t => [t, calcIntensity(data, t, area, baselineYear.valueOf(), (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(baselineYear)).valueOf(), limit, true)]));
  years = years.map(([start, end]) => [start.valueOf(), types.map(t => {
    let value = calcIntensity(data, t, area, start.valueOf(), end.valueOf(), limit, true);
    return {
      type: t,
      progress: calcProgress(value, baseline.get(t)),
      value
    };
  })]);
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
    let yearStart = (0, _dateFns.startOfYear)((0, _dateFns.subYears)(new Date(), 1)),
        yearEnd = (0, _dateFns.endOfYear)(yearStart),
        monthStart = (0, _dateFns.startOfMonth)((0, _dateFns.subMonths)(new Date(), 2)),
        monthEnd = (0, _dateFns.endOfMonth)(monthStart);
    eui = {
      year: calcEUI(data, area, yearStart, yearEnd) || 0,
      month: calcEUI(data, area, monthStart, monthEnd) || 0
    };
  }
  return eui;
};

exports.calcScale = calcScale;
exports.chooseIcon = chooseIcon;
exports.validEmail = validEmail;
exports.toURLQuery = toURLQuery;
exports.parseQueryParams = parseQueryParams;
exports.conversionFactors = conversionFactors;
exports.units = units;
exports.buildingTypes = buildingTypes;
exports.convert = convert;
exports.capFirst = capFirst;
exports.replaceAll = replaceAll;
exports.stringifyID = stringifyID;
exports.formatNumber = formatNumber;
exports.formatFloat = formatFloat;
exports.formatPercent = formatPercent;
exports.calcProgress = calcProgress;
exports.normalize = normalize;
exports.normalizeBack = normalizeBack;
exports.euiTimeScaler = euiTimeScaler;
exports.calcCVRMSE = calcCVRMSE;
exports.calcNMBE = calcNMBE;
exports.boxPlot = boxPlot;
exports.minTimeseries = minTimeseries;
exports.maxTimeseries = maxTimeseries;
exports.reduceTimeseries = reduceTimeseries;
exports.filterTimeseries = filterTimeseries;
exports.groupTimeseries = groupTimeseries;
exports.aggregateTimeSeries = aggregateTimeSeries;
exports.totalTimeseries = totalTimeseries;
exports.averageTimeseries = averageTimeseries;
exports.makeDailyTimeseries = makeDailyTimeseries;
exports.findMissingDays = findMissingDays;
exports.calcEUI = calcEUI;
exports.calcBuildingEUI = calcBuildingEUI;
exports.calcIntensity = calcIntensity;
exports.EUIByType = EUIByType;
exports.EUIByYear = EUIByYear;
exports.calcMeterTotal = calcMeterTotal;
exports.cleanTimeseriesInterpolate = cleanTimeseriesInterpolate;
exports.dataStatistics = dataStatistics;
exports.spaceTypes = spaceTypes;
exports.uncleanTimeseries = uncleanTimeseries;
exports.interpolateTimeseries = interpolateTimeseries;
exports.maxTimeseriesWithDate = maxTimeseriesWithDate;
exports.valuesTimeseries = valuesTimeseries;
exports.timeseriesToXY = timeseriesToXY;
exports.cleanTimeseries = cleanTimeseries;
exports.isTimeseriesUniform = isTimeseriesUniform;
exports.monthlyValueWithTrend = monthlyValueWithTrend;
exports.getLastTimestamp = getLastTimestamp;
exports.getFirstTimestamp = getFirstTimestamp;
exports.preAllocateTimeseriesMinutes = preAllocateTimeseriesMinutes;
exports.TimeseriesArrayToObject = TimeseriesArrayToObject;
exports.TimeseriesObjectToArray = TimeseriesObjectToArray;
