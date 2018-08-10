"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeseriesObjectToArray = exports.TimeseriesArrayToObject = exports.preAllocateTimeseriesMinutes = exports.getFirstTimestamp = exports.getLastTimestamp = exports.monthlyValueWithTrend = exports.isTimeseriesUniform = exports.cleanTimeseries = exports.timeseriesToXY = exports.valuesTimeseries = exports.maxTimeseriesWithDate = exports.interpolateTimeseries = exports.uncleanTimeseries = exports.spaceTypes = exports.dataStatistics = exports.cleanTimeseriesInterpolate = exports.calcMeterTotal = exports.EUIByYear = exports.EUIByType = exports.calcIntensity = exports.calcBuildingEUI = exports.calcEUI = exports.findMissingDays = exports.makeDailyTimeseries = exports.averageTimeseries = exports.totalTimeseries = exports.aggregateTimeSeries = exports.groupTimeseries = exports.filterTimeseries = exports.reduceTimeseries = exports.maxTimeseries = exports.minTimeseries = exports.boxPlot = exports.calcNMBE = exports.calcCVRMSE = exports.euiTimeScaler = exports.normalizeBack = exports.normalize = exports.calcProgress = exports.formatPercent = exports.formatFloat = exports.formatNumber = exports.stringifyID = exports.replaceAll = exports.capFirst = exports.convert = exports.buildingTypes = exports.units = exports.conversionFactors = exports.parseQueryParams = exports.toURLQuery = exports.validEmail = exports.chooseIcon = exports.calcScale = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _simpleStatistics = require("simple-statistics");

var _dateFns = require("date-fns");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Conversions
var conversionFactors = {
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
var convert = function convert(value, meterType, to) {
  return value * conversionFactors[meterType][to];
};
// Buildings and Meters
var units = {
  electricity: ["kWh", "MWh", "MJ", "kW"],
  steam: ["lbs", "kBtu", "btu"],
  chw: ["ton-hr", "kBtu", "btu"],
  ng: ["therm", "ccf", "mcf", "kBtu"],
  oil: ["gals", "barallel", "kBtu", "btu"],
  water: ["gals"]
};
var buildingTypes = ["Office", "Residential", "Lab", "Classroom", "Other", "Gym", "Resaurant", "Super Market", "Hospital", "Mid-Rise Apartment", "Hotel", "Retail", "Warehouse"];
var spaceTypes = ["Dining", "Kitchen", "Corridor", "ER_Exam", "ER_NurseStn", "ER_Trauma", "ER_Triage", "ICU_NurseStn", "ICU_Open", "ICU_PatRm", "Lab", "Lobby", "NurseStn", "OR", "Office", "PatCorridor", "PatRoom", "PhysTherapy", "Radiology", "Banquet", "Cafe", "GuestRoom", "Laundry", "Mechanical", "Retail", "Storage", "Apartment", "Attic", "BreakRoom", "ClosedOffice", "Conference", "Elec/MechRoom", "IT_Room", "OpenOffice", "PrintRoom", "Restroom", "Stair", "Vending", "Anesthesia", "BioHazard", "CleanWork", "DressingRoom", "Exam", "Hall", "Janitor", "LockerRoom", "Lounge", "MRI", "MRI_Control", "MedGas", "NurseStation", "PACU", "PhysicalTherapy", "PreOp", "ProcedureRoom", "Soil Work", "Toilet", "Xray", "Cafeteria", "Classroom", "Gym", "Library", "Back_Space", "Entry", "Point_of_Sale", "Auditorium", "Exercise", "GuestLounge", "Meeting", "PublicRestroom", "StaffLounge", "WholeBuilding", "Bulk", "Fine"];

// Formatting
var capFirst = function capFirst() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
var replaceAll = function replaceAll() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var search = arguments[1];
  var replacement = arguments[2];
  return string.replace(new RegExp(search, "g"), replacement);
};
var stringifyID = function stringifyID(id) {
  return id < 10 ? "00" + id : id < 100 ? "0" + id : String(id);
};
var formatNumber = function formatNumber(number) {
  return isNaN(number) ? "0" : parseInt(Math.round(number), 10).toLocaleString();
};
var formatFloat = function formatFloat(number) {
  return isNaN(number) ? "0" : parseFloat(number).toLocaleString();
};
var formatPercent = function formatPercent(number) {
  return isNaN(number) ? "0" : formatNumber(number * 100);
};
var toURLQuery = function toURLQuery(obj) {
  return "?".concat(Object.keys(obj).map(function (k) {
    return [k, obj[k]].join("=");
  }).join("&"));
};
var parseQueryParams = function parseQueryParams(query) {
  return new Map(query.replace("?", "").split("&").map(function (s) {
    return s.split("=");
  }));
};
//Map
var calcScale = function calcScale(values) {
  var units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  values = values.filter(function (v) {
    return v > 0;
  });
  if (values.length < 1) return { low: 1, high: 2, max: 3 };
  return {
    low: parseInt((0, _simpleStatistics.quantile)(values, 0.5), 10),
    high: parseInt((0, _simpleStatistics.quantile)(values, 0.75), 10),
    max: parseInt((0, _simpleStatistics.max)(values), 10),
    units: units
  };
};
var chooseIcon = function chooseIcon(basename, _ref, value) {
  var low = _ref.low,
      high = _ref.high;

  var icon = basename + "-err";
  if (!value || !low || !high) return icon;
  value <= low ? icon = basename + "-low" : value <= high ? icon = basename + "-med" : icon = basename + "-high";
  return icon;
};
//Charting Functions
var timeseriesToXY = function timeseriesToXY(data) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return data.map(function (v) {
    return {
      x: new Date(v[0]),
      y: v[1] / scale
    };
  });
};
// General Functions & Adjustments
var calcProgress = function calcProgress(value, baseline) {
  return (value - baseline) / baseline;
};
var normalize = function normalize(x, min, max) {
  return (x - min) / (max - min);
};
var normalizeBack = function normalizeBack(x, min, max) {
  return x * (max - min) + min;
};
var euiTimeScaler = function euiTimeScaler(startDate, endDate) {
  if (isNaN(startDate)) {
    startDate = new Date(startDate).valueOf();
  }
  if (isNaN(endDate)) {
    endDate = new Date(endDate).valueOf();
  }
  var msyear = 31557600000; // 365.25 days
  return msyear / (endDate - startDate);
};
var validEmail = function validEmail(string) {
  var nr = new RegExp(
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return Boolean(string.match(nr));
};
// Statistics
var calcCVRMSE = function calcCVRMSE(actual, simulated) {
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
var calcNMBE = function calcNMBE(actual, simulated) {
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
var dataStatistics = function dataStatistics(values) {
  var filterZero = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (filterZero) {
    values = values.filter(function (v) {
      return v > 0;
    });
  }
  if (values.length < 2) {
    // throw new Error('Not Enough Values')
    return {};
  }
  values = values.sort();
  var iq = (0, _simpleStatistics.interquartileRange)(values),
      q1 = (0, _simpleStatistics.quantile)(values, 0.25),
      q3 = (0, _simpleStatistics.quantile)(values, 0.75),
      lowerInnerFence = q1 - 1.5 * iq,
      lowerOuterFence = q3 - 3 * iq,
      upperInnerFence = q1 + 1.5 * iq,
      upperOuterFence = q3 + 3 * iq;
  return {
    iq: iq,
    q1: q1,
    q3: q3,
    lowerInnerFence: lowerInnerFence,
    lowerOuterFence: lowerOuterFence,
    upperInnerFence: upperInnerFence,
    upperOuterFence: upperOuterFence,
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
var boxPlot = function boxPlot(values) {
  var filterZero = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (filterZero) {
    values = values.filter(function (v) {
      return v > 0;
    });
  }
  if (values.length < 2) {
    throw new Error("not enough values");
  }
  var q1 = (0, _simpleStatistics.quantile)(values, 0.25),
      q3 = (0, _simpleStatistics.quantile)(values, 0.75),
      minVal = (0, _simpleStatistics.min)(values),
      maxVal = (0, _simpleStatistics.max)(values);
  return {
    q1: q1,
    q3: q3,
    min: minVal,
    max: maxVal
  };
};

// Dates
var intervalStart = function intervalStart(date, interval) {
  //Supported Intervals: day, month, year
  var t = void 0;
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
var dateRange = function dateRange(startDate, endDate, interval) {
  var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  // Supported Inervals: minutes,hour,day, month, year
  startDate = (0, _dateFns.parse)(startDate);
  endDate = (0, _dateFns.parse)(endDate);
  var range = [startDate];
  if (startDate >= endDate) return [];
  while (range[range.length - 1].valueOf() < endDate.valueOf()) {
    var d = void 0;
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
var minTimeseries = function minTimeseries(ts) {
  return (0, _simpleStatistics.min)(ts.map(function (v) {
    return v[1];
  }));
};
var maxTimeseries = function maxTimeseries(ts) {
  return (0, _simpleStatistics.max)(ts.map(function (v) {
    return v[1];
  }));
};
var maxTimeseriesWithDate = function maxTimeseriesWithDate(ts) {
  return ts.sort(function (a, b) {
    return b[1] - a[1];
  })[0];
};
var cardinalityTimeseries = function cardinalityTimeseries(ts) {
  return new Set(ts.map(function (v) {
    return v[1];
  })).size;
};
var getFirstTimestamp = function getFirstTimestamp(ts) {
  return new Date((0, _simpleStatistics.min)(ts.map(function (v) {
    return v[0];
  })));
};
var getLastTimestamp = function getLastTimestamp(ts) {
  return new Date((0, _simpleStatistics.max)(ts.map(function (v) {
    return v[0];
  })));
};
// Reduce
var reduceTimeseries = function reduceTimeseries() {
  for (var _len = arguments.length, arrays = Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }

  return [].concat(_toConsumableArray(arrays.map(function (a) {
    return new Map(a);
  }).reduce(function (a, b) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = b.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var date = _step.value;

        a.has(date) ? a.set(date, b.get(date) + a.get(date)) : a.set(date, b.get(date));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return a;
  }, new Map()))).sort(function (a, b) {
    return a[0] - b[0];
  });
};
// Cleaning
var cleanTimeseries = function cleanTimeseries(data, replacement, min, max) {
  data = data.map(function (v) {
    return v[1] > max || v[1] < min ? [v[0], replacement, v[1]] : v;
  });
  return data;
};
var uncleanTimeseries = function uncleanTimeseries(data) {
  return data.map(function (r) {
    return r[2] ? [r[0], r[2]] : r;
  });
};
var interpolateTimeseries = function interpolateTimeseries(array, index) {
  var prevIndex = index - 1 < 0 ? 0 : index - 1;
  var prev = array.slice(0, prevIndex).filter(function (v) {
    return v[1];
  }).reverse()[0];
  var next = array.slice(index + 1).filter(function (v) {
    return v[1];
  })[0];
  return ((prev ? prev[1] : 0) + (next ? next[1] : 0)) / 2;
};
var cleanTimeseriesInterpolate = function cleanTimeseriesInterpolate(data, min, max) {
  data = data.map(function (v) {
    return isNaN(v[1]) ? [v[0], 0, v[1]] : v;
  }).map(function (v) {
    return v[1] < min ? [v[0], null, v[1]] : v;
  }) //min
  .map(function (v) {
    return v[1] > max ? [v[0], null, v[1]] : v;
  }) //max
  .map(function (v, i, array) {
    if (!v[1]) {
      var avg = interpolateTimeseries(array, i);
      return [v[0], avg, v[2]];
    } else {
      return v;
    }
  }); //interpolate
  return data;
};
// Filtering
var filterTimeseries = function filterTimeseries(data, startDate, endDate) {
  return data.filter(function (t) {
    return t[0] >= startDate && t[0] <= endDate;
  });
};
// Mapping
var valuesTimeseries = function valuesTimeseries(data) {
  return data.map(function (v) {
    return v[1];
  });
};
// Pre Allocate
var preAllocateTimeseriesMinutes = function preAllocateTimeseriesMinutes() {
  var o = {};
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
var TimeseriesArrayToObject = function TimeseriesArrayToObject(data) {
  var days = groupTimeseries(data, "day").map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        day = _ref3[0],
        ts = _ref3[1];

    var obj = preAllocateTimeseriesMinutes();
    for (var x = 0; x < ts.length; x++) {
      var hr = (0, _dateFns.getHours)(ts[x][0]),
          m = (0, _dateFns.getMinutes)(ts[x][0]);
      obj[hr][m] = ts[x][1];
    }
    return [day, obj];
  });
  return days;
};
var TimeseriesObjectToArray = function TimeseriesObjectToArray(data, timestamp) {
  var array = Object.keys(data).map(function (h) {
    return Object.keys(data[h]).map(function (m) {
      return Object.keys(data[h][m].map(function (s) {
        return [(0, _dateFns.setHours)((0, _dateFns.setMinutes)((0, _dateFns.setSeconds)(timestamp, s), m), h), data[h][m]];
      }));
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }).sort(function (a, b) {
    return a[0].valueOf() - b[0].valueOf();
  });
  return array;
};
// Grouping
var groupTimeseries = function groupTimeseries(data, interval) {
  //Supported Intervals: day, month, year
  var group = data.map(function (v) {
    return [(0, _dateFns.parse)(v[0]).valueOf(), v[1]];
  }).reduce(function (a, b) {
    var t = intervalStart(b[0], interval);
    if (a.has(t)) {
      a.set(t, [].concat(_toConsumableArray(a.get(t)), [b]));
    } else {
      a.set(t, [b]);
    }
    return a;
  }, new Map());
  return [].concat(_toConsumableArray(group));
};
// Aggregation
var aggregateTimeSeries = function aggregateTimeSeries(data, interval) {
  //Supported Intervals: day, month, year
  var red = data.map(function (v) {
    return [(0, _dateFns.parse)(v[0]), v[1]];
  }).reduce(function (a, b) {
    var ts = intervalStart(b[0], interval);
    if (!a.has(ts)) {
      a.set(ts, b[1]);
    } else {
      a.set(ts, a.get(ts) + b[1]);
    }
    return a;
  }, new Map());
  data = [].concat(_toConsumableArray(red)).map(function (v) {
    return [new Date(v[0]).valueOf(), v[1]];
  });
  return data;
};
var totalTimeseries = function totalTimeseries(data) {
  return data.map(function (a) {
    return a[1];
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
};
var averageTimeseries = function averageTimeseries(data) {
  return (0, _simpleStatistics.mean)(data.map(function (v) {
    return v[1];
  }));
};
var monthlyValueWithTrend = function monthlyValueWithTrend(data, units, month, baseline) {
  var dm = new Map(data);
  if (!dm.has(month.valueOf())) {
    return { value: 0, trend: { value: null, text: "" } };
  }
  var value = dm.get(month.valueOf()),
      baselineValue = dm.get(baseline.valueOf()) || 0;
  return {
    value: value,
    units: units,
    trend: {
      value: calcProgress(value, baselineValue) * 100,
      text: "" + (0, _dateFns.format)(baseline, "MMM YYYY")
    }
  };
};
// ETC
var isTimeseriesUniform = function isTimeseriesUniform(data) {
  return cardinalityTimeseries(data) < 3;
};
var makeDailyTimeseries = function makeDailyTimeseries(date, value, interval, step) {
  var range = dateRange(date, (0, _dateFns.endOfDay)(date), interval);
  var data = range.map(function (d, i, arr) {
    return [d.valueOf(), value / arr.length];
  });
  return data;
};
var findMissingDays = function findMissingDays(data) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      startDate = _ref4.startDate,
      endDate = _ref4.endDate;

  // Sort Data
  data = data.sort(function (a, b) {
    return a[0] - b[0];
  });
  // Set Default Start Dates
  if (!startDate) {
    startDate = data[0][0];
  }
  if (!endDate) {
    endDate = data[data.length - 1][0];
  }
  var range = dateRange(startDate, endDate, "day");
  var fullTs = new Set(range.map(function (d) {
    return d.valueOf();
  }));
  var dataDates = new Set(data.map(function (d) {
    return d[0];
  }));
  var missing = new Set([].concat(_toConsumableArray(fullTs)).filter(function (d) {
    return !dataDates.has(d);
  }));
  return [].concat(_toConsumableArray(missing));
};

// Energy
var calcMeterTotal = function calcMeterTotal(data, type, startDate, endDate) {
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var total = Object.keys(data).filter(function (k) {
    return limit.indexOf(k) === -1;
  }).filter(function (k) {
    return conversionFactors.hasOwnProperty(k) && data[k].length > 0;
  }).map(function (k, i) {
    return filterTimeseries(data[k], startDate, endDate).map(function (v) {
      return [v[0], convert(v[1], k, type)];
    });
  }).reduce(function (a, b) {
    return reduceTimeseries(a, b);
  }, []);
  return total;
};
var calcEUI = function calcEUI(data, area, startDate, endDate) {
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var totalEnergy = totalTimeseries(calcMeterTotal(data, "energy", startDate, endDate, limit));
  return totalEnergy / area * euiTimeScaler(startDate, endDate);
};
var calcIntensity = function calcIntensity(data, type, area, startDate, endDate) {
  var limit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var btu = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  if (["energy", "emissions", "cost"].indexOf(type) !== -1) {
    var totalEnergy = totalTimeseries(calcMeterTotal(data, type, startDate, endDate, limit));
    return totalEnergy / area * euiTimeScaler(startDate, endDate);
  } else {
    if (!data.hasOwnProperty(type)) return 0;
    var total = totalTimeseries(filterTimeseries(data[type], startDate, endDate));
    var value = total / area * euiTimeScaler(startDate, endDate);
    return btu ? convert(value, type, "energy") : value;
  }
};

var EUIByType = function EUIByType(data, area, startDate, endDate) {
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var years = new Array((0, _dateFns.differenceInYears)(endDate, startDate) + 1).fill(0).map(function (v, i) {
    var y = new Date(startDate.getFullYear() + i, 0);
    return [y, (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(y))];
  });
  var byType = Object.keys(data).filter(function (k) {
    return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
  }).map(function (k, i) {
    return years.map(function (year) {
      var sd = year[0].valueOf();
      var ed = year[1].valueOf();
      if (ed > endDate.valueOf()) {
        ed = endDate.valueOf();
        sd = (0, _dateFns.startOfMonth)((0, _dateFns.subMonths)(ed, 11)).valueOf();
      }
      var timeScaler = euiTimeScaler(sd, ed);
      var value = convert(totalTimeseries(filterTimeseries(data[k], sd, ed)) * timeScaler / area, k, "energy");
      return {
        type: k,
        year: new Date((0, _dateFns.getYear)(ed), 0).valueOf(),
        value: value
      };
    });
  });
  return byType;
};
var EUIByYear = function EUIByYear(data, area, startDate, endDate) {
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var baselineYear = arguments[5];

  var years = new Array((0, _dateFns.differenceInYears)(endDate, startDate) + 1).fill(0).map(function (v, i) {
    var y = new Date(startDate.getFullYear() + i, 0);
    return [y, (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(y))];
  });
  var types = Object.keys(data).filter(function (k) {
    return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
  });
  var baseline = new Map(types.map(function (t) {
    return [t, calcIntensity(data, t, area, baselineYear.valueOf(), (0, _dateFns.startOfMonth)((0, _dateFns.endOfYear)(baselineYear)).valueOf(), limit, true)];
  }));
  years = years.map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        start = _ref6[0],
        end = _ref6[1];

    return [start.valueOf(), types.map(function (t) {
      var value = calcIntensity(data, t, area, start.valueOf(), end.valueOf(), limit, true);
      return {
        type: t,
        progress: calcProgress(value, baseline.get(t)),
        value: value
      };
    })];
  });
  return years;
};
var calcBuildingEUI = function calcBuildingEUI(data, area) {
  var eui = void 0;
  if (!data || !area) {
    eui = {
      year: 0,
      month: 0
    };
  } else {
    var yearStart = (0, _dateFns.startOfYear)((0, _dateFns.subYears)(new Date(), 1)),
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
//# sourceMappingURL=utilities.js.map