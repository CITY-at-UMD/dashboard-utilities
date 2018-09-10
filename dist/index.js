(function () {
  'use strict';

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var _require = require("@material-ui/core/colors"),
      blueGrey = _require.blueGrey,
      indigo = _require.indigo,
      green = _require.green,
      deepOrange = _require.deepOrange,
      brown = _require.brown,
      amber = _require.amber,
      orange = _require.orange,
      blue = _require.blue,
      lightGreen = _require.lightGreen;

  var _require2 = require("simple-statistics"),
      mean = _require2.mean,
      interquartileRange = _require2.interquartileRange,
      quantile = _require2.quantile,
      min = _require2.min,
      max = _require2.max,
      sum = _require2.sum,
      medianAbsoluteDeviation = _require2.medianAbsoluteDeviation,
      modeSorted = _require2.modeSorted,
      medianSorted = _require2.medianSorted,
      uniqueCountSorted = _require2.uniqueCountSorted,
      variance = _require2.variance,
      standardDeviation = _require2.standardDeviation;

  var _require3 = require("date-fns"),
      subYears = _require3.subYears,
      getYear = _require3.getYear,
      format = _require3.format,
      addMinutes = _require3.addMinutes,
      addHours = _require3.addHours,
      addDays = _require3.addDays,
      addMonths = _require3.addMonths,
      addYears = _require3.addYears,
      subMonths = _require3.subMonths,
      startOfMonth = _require3.startOfMonth,
      startOfDay = _require3.startOfDay,
      startOfYear = _require3.startOfYear,
      endOfYear = _require3.endOfYear,
      endOfMonth = _require3.endOfMonth,
      endOfDay = _require3.endOfDay,
      differenceInYears = _require3.differenceInYears,
      parse = _require3.parse;

  var groupBy = require("lodash/groupBy");
  var merge = require("lodash/merge");
  // Conversions
  var conversionFactors = {
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
  	}
  };
  var convert = function convert(value, meterType, to) {
  	var conversionFactors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : conversionFactors;

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
  	if (values.length < 1) return { low: 1, high: 2, max: 3, units: units };
  	return {
  		low: parseInt(quantile(values, 0.5), 10),
  		high: parseInt(quantile(values, 0.75), 10),
  		max: parseInt(max(values), 10),
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
  	var ybar = sum(actualValues) / actualValues.length;
  	var cvrmse = Math.sqrt(sum(diffArray) / (n - p)) / ybar;
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
  	var ybar = sum(actualValues) / actualValues.length;
  	var nmbe = sum(diffArray) / ((n - p) * ybar);
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
  	var iq = interquartileRange(values),
  	    q1 = quantile(values, 0.25),
  	    q3 = quantile(values, 0.75),
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
  	var q1 = quantile(values, 0.25),
  	    q3 = quantile(values, 0.75),
  	    minVal = min(values),
  	    maxVal = max(values);
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
  var dateRange = function dateRange(startDate, endDate, interval) {
  	var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  	// Supported Inervals: minutes,hour,day, month, year
  	startDate = parse(startDate);
  	endDate = parse(endDate);
  	var range = [startDate];
  	if (startDate >= endDate) return [];
  	while (range[range.length - 1].valueOf() < endDate.valueOf()) {
  		var d = void 0;
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
  var minTimeseries = function minTimeseries(ts) {
  	return min(ts.map(function (v) {
  		return v[1];
  	}));
  };
  var maxTimeseries = function maxTimeseries(ts) {
  	return max(ts.map(function (v) {
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
  	return new Date(min(ts.map(function (v) {
  		return v[0];
  	})));
  };
  var getLastTimestamp = function getLastTimestamp(ts) {
  	return new Date(max(ts.map(function (v) {
  		return v[0];
  	})));
  };

  // Formatting
  var timeseriesToObject = function timeseriesToObject(ts) {
  	return ts.filter(function (t) {
  		return t[1] !== NaN || t[1] !== null;
  	}).reduce(function (a, b) {
  		return Object.assign(a, defineProperty({}, b[0], b[1]));
  	}, {});
  };
  var objToTimeseries = function objToTimeseries(ts) {
  	return Object.entries(ts).map(function (_ref2) {
  		var _ref3 = slicedToArray(_ref2, 2),
  		    d = _ref3[0],
  		    v = _ref3[1];

  		return [new Date(d), v];
  	}).sort(function (a, b) {
  		return a[0] - b[0];
  	});
  };

  // Merging
  var mergeTimeseries = function mergeTimeseries(_ref4) {
  	var _ref4$raw = _ref4.raw,
  	    raw = _ref4$raw === undefined ? [] : _ref4$raw,
  	    _ref4$clean = _ref4.clean,
  	    clean = _ref4$clean === undefined ? [] : _ref4$clean,
  	    _ref4$forecast = _ref4.forecast,
  	    forecast = _ref4$forecast === undefined ? [] : _ref4$forecast;

  	var data = objToTimeseries(merge(timeseriesToObject(forecast), timeseriesToObject(raw), timeseriesToObject(clean)));
  	return data;
  };
  var mergeOrderedTimeseries = function mergeOrderedTimeseries() {
  	for (var _len = arguments.length, arrayOfTimeseries = Array(_len), _key = 0; _key < _len; _key++) {
  		arrayOfTimeseries[_key] = arguments[_key];
  	}

  	var data = arrayOfTimeseries.map(function (a) {
  		return timeseriesToObject(a.map(function (v) {
  			return [new Date(v[0]), v[1]];
  		}));
  	});
  	var merged = Object.assign.apply(Object, toConsumableArray(data.reverse()));
  	// console.log(merged);
  	var ts = objToTimeseries(merged);
  	return ts;
  };
  // Reduce
  var reduceTimeseries = function reduceTimeseries() {
  	for (var _len2 = arguments.length, arrays = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  		arrays[_key2] = arguments[_key2];
  	}

  	var data = arrays.map(function (a) {
  		return a.map(function (_ref5) {
  			var _ref6 = slicedToArray(_ref5, 2),
  			    date = _ref6[0],
  			    value = _ref6[1];

  			return [new Date(date).valueOf(), value];
  		});
  	});
  	var ts = [].concat(toConsumableArray(data.map(function (a) {
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
  	}).map(function (_ref7) {
  		var _ref8 = slicedToArray(_ref7, 2),
  		    date = _ref8[0],
  		    value = _ref8[1];

  		return [new Date(date), value];
  	});
  	return ts;
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
  	startDate = new Date(startDate);
  	endDate = new Date(endDate);
  	return data.map(function (_ref9) {
  		var _ref10 = slicedToArray(_ref9, 2),
  		    date = _ref10[0],
  		    value = _ref10[1];

  		return [new Date(date), value];
  	}).filter(function (t) {
  		return t[0] >= startDate && t[0] <= endDate;
  	});
  };
  // Mapping and Sorting
  var valuesTimeseries = function valuesTimeseries(data) {
  	return data.map(function (v) {
  		return v[1];
  	});
  };
  var sortTimeseries = function sortTimeseries(ts) {
  	return ts.sort(function (a, b) {
  		return a[0] - b[0];
  	});
  };
  // Grouping
  var groupTimeseriesDay = function groupTimeseriesDay(ts) {
  	return Object.entries(groupBy(ts, function (v) {
  		return startOfDay(v[0]);
  	})).map(function (_ref11) {
  		var _ref12 = slicedToArray(_ref11, 2),
  		    day = _ref12[0],
  		    timeseries = _ref12[1];

  		return [new Date(day), timeseries];
  	});
  };
  var groupTimeseries = function groupTimeseries(data, interval) {
  	//Supported Intervals: day, month, year
  	var group = data.map(function (v) {
  		return [parse(v[0]).valueOf(), v[1]];
  	}).reduce(function (a, b) {
  		var t = intervalStart(b[0], interval);
  		if (a.has(t)) {
  			a.set(t, [].concat(toConsumableArray(a.get(t)), [b]));
  		} else {
  			a.set(t, [b]);
  		}
  		return a;
  	}, new Map());
  	return [].concat(toConsumableArray(group));
  };
  // Aggregation
  var aggregateTimeSeries = function aggregateTimeSeries(data, interval) {
  	//Supported Intervals: day, month, year
  	var red = data.map(function (v) {
  		return [parse(v[0]), v[1]];
  	}).reduce(function (a, b) {
  		var ts = intervalStart(b[0], interval);
  		if (!a.has(ts)) {
  			a.set(ts, b[1]);
  		} else {
  			a.set(ts, a.get(ts) + b[1]);
  		}
  		return a;
  	}, new Map());
  	data = [].concat(toConsumableArray(red)).map(function (v) {
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
  	return mean(data.map(function (v) {
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
  			text: "" + format(baseline, "MMM YYYY")
  		}
  	};
  };
  // ETC
  var isTimeseriesUniform = function isTimeseriesUniform(data) {
  	return cardinalityTimeseries(data) < 3;
  };
  var makeDailyTimeseries = function makeDailyTimeseries(date, value, interval, step) {
  	var range = dateRange(date, endOfDay(date), interval);
  	var data = range.map(function (d, i, arr) {
  		return [d.valueOf(), value / arr.length];
  	});
  	return data;
  };
  var findMissingDays = function findMissingDays(data) {
  	var _ref13 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
  	    startDate = _ref13.startDate,
  	    endDate = _ref13.endDate;

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
  	var missing = new Set([].concat(toConsumableArray(fullTs)).filter(function (d) {
  		return !dataDates.has(d);
  	}));
  	return [].concat(toConsumableArray(missing));
  };

  var calcTotals = function calcTotals(data, totalType, _ref14) {
  	var _ref14$typeLimit = _ref14.typeLimit,
  	    typeLimit = _ref14$typeLimit === undefined ? [] : _ref14$typeLimit,
  	    _ref14$conversionFact = _ref14.conversionFactors,
  	    conversionFactors = _ref14$conversionFact === undefined ? conversionFactors : _ref14$conversionFact;

  	var total = Object.keys(data).filter(function (k) {
  		return typeLimit.indexOf(k) === -1;
  	}).filter(function (k) {
  		return conversionFactors.hasOwnProperty(k) && data[k].length > 0;
  	}).map(function (k) {
  		return data[k].map(function (v) {
  			return [v[0], convert(v[1], k, totalType, conversionFactors)];
  		});
  	}).reduce(function (a, b) {
  		return reduceTimeseries(a, b);
  	}, []);
  	return total;
  };
  var calcDataIntensity = function calcDataIntensity() {
  	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  	var area = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  	var startDate = arguments[2];
  	var endDate = arguments[3];
  	var _ref15 = arguments[4];
  	var _ref15$typeLimit = _ref15.typeLimit;

  	var total = totalTimeseries(filterTimeseries(data, startDate, endDate));
  	return total / area * euiTimeScaler(startDate, endDate);
  };
  // Energy
  var calcMeterTotal = function calcMeterTotal(data, type, startDate, endDate) {
  	var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  	var conversionFactors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : conversionFactors;

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
  	var conversionFactors = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : conversionFactors;

  	var years = new Array(differenceInYears(endDate, startDate) + 1).fill(0).map(function (v, i) {
  		var y = new Date(startDate.getFullYear() + i, 0);
  		return [y, startOfMonth(endOfYear(y))];
  	});
  	var byType = Object.keys(data).filter(function (k) {
  		return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
  	}).map(function (k, i) {
  		return years.map(function (year) {
  			var sd = year[0].valueOf();
  			var ed = year[1].valueOf();
  			if (ed > endDate.valueOf()) {
  				ed = endDate.valueOf();
  				sd = startOfMonth(subMonths(ed, 11)).valueOf();
  			}
  			var timeScaler = euiTimeScaler(sd, ed);
  			var value = convert(totalTimeseries(filterTimeseries(data[k], sd, ed)) * timeScaler / area, k, "energy");
  			return {
  				type: k,
  				year: new Date(getYear(ed), 0).valueOf(),
  				value: value
  			};
  		});
  	});
  	return byType;
  };
  var EUIByYear = function EUIByYear(data, area, startDate, endDate) {
  	var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  	var baselineYear = arguments[5];
  	var conversionFactors = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : conversionFactors;

  	var years = new Array(differenceInYears(endDate, startDate) + 1).fill(0).map(function (v, i) {
  		var y = new Date(startDate.getFullYear() + i, 0);
  		return [y, startOfMonth(endOfYear(y))];
  	});
  	var types = Object.keys(data).filter(function (k) {
  		return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
  	});
  	var baseline = new Map(types.map(function (t) {
  		return [t, calcIntensity(data, t, area, baselineYear.valueOf(), startOfMonth(endOfYear(baselineYear)).valueOf(), limit, true)];
  	}));
  	years = years.map(function (_ref16) {
  		var _ref17 = slicedToArray(_ref16, 2),
  		    start = _ref17[0],
  		    end = _ref17[1];

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
  		var yearStart = startOfYear(subYears(new Date(), 1)),
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
  var Meters = {
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

  	var meters = [].concat(toConsumableArray(new Set(buildings.map(function (b) {
  		return Object.keys((b.data || {}).actual || {});
  	}).reduce(function (a, b) {
  		return a.concat(b);
  	}, [])))).sort(sortMeters);
  	if (emissions) meters.unshift("emissions");
  	if (cost) meters.unshift("cost");
  	if (total) meters.unshift("energy");
  	return meters;
  };

  module.exports = {
  	Meters: Meters,
  	meterOrder: meterOrder,
  	sortMeters: sortMeters,
  	getAvailableMeters: getAvailableMeters,
  	simpleMeter: simpleMeter,
  	calcScale: calcScale,
  	chooseIcon: chooseIcon,
  	validEmail: validEmail,
  	toURLQuery: toURLQuery,
  	parseQueryParams: parseQueryParams,
  	conversionFactors: conversionFactors,
  	units: units,
  	convert: convert,
  	capFirst: capFirst,
  	replaceAll: replaceAll,
  	stringifyID: stringifyID,
  	formatNumber: formatNumber,
  	formatFloat: formatFloat,
  	formatPercent: formatPercent,
  	calcProgress: calcProgress,
  	normalize: normalize,
  	normalizeBack: normalizeBack,
  	euiTimeScaler: euiTimeScaler,
  	calcCVRMSE: calcCVRMSE,
  	calcNMBE: calcNMBE,
  	boxPlot: boxPlot,
  	minTimeseries: minTimeseries,
  	maxTimeseries: maxTimeseries,
  	reduceTimeseries: reduceTimeseries,
  	filterTimeseries: filterTimeseries,
  	groupTimeseries: groupTimeseries,
  	groupTimeseriesDay: groupTimeseriesDay,
  	aggregateTimeSeries: aggregateTimeSeries,
  	totalTimeseries: totalTimeseries,
  	averageTimeseries: averageTimeseries,
  	makeDailyTimeseries: makeDailyTimeseries,
  	findMissingDays: findMissingDays,
  	calcEUI: calcEUI,
  	calcBuildingEUI: calcBuildingEUI,
  	calcIntensity: calcIntensity,
  	EUIByType: EUIByType,
  	EUIByYear: EUIByYear,
  	calcMeterTotal: calcMeterTotal,
  	cleanTimeseriesInterpolate: cleanTimeseriesInterpolate,
  	dataStatistics: dataStatistics,
  	uncleanTimeseries: uncleanTimeseries,
  	interpolateTimeseries: interpolateTimeseries,
  	maxTimeseriesWithDate: maxTimeseriesWithDate,
  	valuesTimeseries: valuesTimeseries,
  	timeseriesToXY: timeseriesToXY,
  	cleanTimeseries: cleanTimeseries,
  	isTimeseriesUniform: isTimeseriesUniform,
  	monthlyValueWithTrend: monthlyValueWithTrend,
  	getLastTimestamp: getLastTimestamp,
  	getFirstTimestamp: getFirstTimestamp,
  	timeseriesToObject: timeseriesToObject,
  	objToTimeseries: objToTimeseries,
  	mergeTimeseries: mergeTimeseries,
  	mergeOrderedTimeseries: mergeOrderedTimeseries,
  	sortTimeseries: sortTimeseries,
  	calcTotals: calcTotals,
  	calcDataIntensity: calcDataIntensity
  };

}());
