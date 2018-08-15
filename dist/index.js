var utilities = (function (simpleStatistics,dateFns,colors) {
  'use strict';

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

  var _require = require("lodash"),
      groupBy = _require.groupBy;
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
      low: parseInt(simpleStatistics.quantile(values, 0.5), 10),
      high: parseInt(simpleStatistics.quantile(values, 0.75), 10),
      max: parseInt(simpleStatistics.max(values), 10),
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
    var ybar = simpleStatistics.sum(actualValues) / actualValues.length;
    var cvrmse = Math.sqrt(simpleStatistics.sum(diffArray) / (n - p)) / ybar;
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
    var ybar = simpleStatistics.sum(actualValues) / actualValues.length;
    var nmbe = simpleStatistics.sum(diffArray) / ((n - p) * ybar);
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
    var iq = simpleStatistics.interquartileRange(values),
        q1 = simpleStatistics.quantile(values, 0.25),
        q3 = simpleStatistics.quantile(values, 0.75),
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
      min: simpleStatistics.min(values),
      max: simpleStatistics.max(values),
      mean: simpleStatistics.mean(values),
      mode: simpleStatistics.modeSorted(values),
      median: simpleStatistics.medianSorted(values),
      medianAbsoluteDeviation: simpleStatistics.medianAbsoluteDeviation(values),
      uniqueCountSorted: simpleStatistics.uniqueCountSorted(values),
      standardDeviation: simpleStatistics.standardDeviation(values),
      variance: simpleStatistics.variance(values)
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
    var q1 = simpleStatistics.quantile(values, 0.25),
        q3 = simpleStatistics.quantile(values, 0.75),
        minVal = simpleStatistics.min(values),
        maxVal = simpleStatistics.max(values);
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
        t = dateFns.startOfDay(date);
        break;
      case "month":
        t = dateFns.startOfMonth(date);
        break;
      default:
        t = dateFns.startOfYear(date);
    }
    return t.valueOf();
  };
  var dateRange = function dateRange(startDate, endDate, interval) {
    var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    // Supported Inervals: minutes,hour,day, month, year
    startDate = dateFns.parse(startDate);
    endDate = dateFns.parse(endDate);
    var range = [startDate];
    if (startDate >= endDate) return [];
    while (range[range.length - 1].valueOf() < endDate.valueOf()) {
      var d = void 0;
      switch (interval) {
        case "minute":
          d = dateFns.addMinutes(range[range.length - 1], step);
          break;
        case "hour":
          d = dateFns.addHours(range[range.length - 1], step);
          break;
        case "day":
          d = dateFns.addDays(range[range.length - 1], step);
          break;
        case "month":
          d = dateFns.addMonths(range[range.length - 1], step);
          break;
        default:
          d = dateFns.addYears(range[range.length - 1], step);
      }
      range.push(d);
    }
    return range;
  };

  // Timeseries [[dateTime, value, origionalValue], ...]
  // Stats
  var minTimeseries = function minTimeseries(ts) {
    return simpleStatistics.min(ts.map(function (v) {
      return v[1];
    }));
  };
  var maxTimeseries = function maxTimeseries(ts) {
    return simpleStatistics.max(ts.map(function (v) {
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
    return new Date(simpleStatistics.min(ts.map(function (v) {
      return v[0];
    })));
  };
  var getLastTimestamp = function getLastTimestamp(ts) {
    return new Date(simpleStatistics.max(ts.map(function (v) {
      return v[0];
    })));
  };
  // Reduce
  var reduceTimeseries = function reduceTimeseries() {
    for (var _len = arguments.length, arrays = Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return [].concat(toConsumableArray(arrays.map(function (a) {
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
      var _ref3 = slicedToArray(_ref2, 2),
          day = _ref3[0],
          ts = _ref3[1];

      var obj = preAllocateTimeseriesMinutes();
      for (var x = 0; x < ts.length; x++) {
        var hr = dateFns.getHours(ts[x][0]),
            m = dateFns.getMinutes(ts[x][0]);
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
          return [dateFns.setHours(dateFns.setMinutes(dateFns.setSeconds(timestamp, s), m), h), data[h][m]];
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
  var groupTimeseriesDay = function groupTimeseriesDay(ts) {
    return Object.entries(groupBy(ts, function (v) {
      return dateFns.startOfDay(v[0]).valueOf();
    })).map(function (_ref4) {
      var _ref5 = slicedToArray(_ref4, 2),
          day = _ref5[0],
          timeseries = _ref5[1];

      return [Number(day), timeseries];
    });
  };
  var groupTimeseries = function groupTimeseries(data, interval) {
    //Supported Intervals: day, month, year
    var group = data.map(function (v) {
      return [dateFns.parse(v[0]).valueOf(), v[1]];
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
      return [dateFns.parse(v[0]), v[1]];
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
    return simpleStatistics.mean(data.map(function (v) {
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
        text: "" + dateFns.format(baseline, "MMM YYYY")
      }
    };
  };
  // ETC
  var isTimeseriesUniform = function isTimeseriesUniform(data) {
    return cardinalityTimeseries(data) < 3;
  };
  var makeDailyTimeseries = function makeDailyTimeseries(date, value, interval, step) {
    var range = dateRange(date, dateFns.endOfDay(date), interval);
    var data = range.map(function (d, i, arr) {
      return [d.valueOf(), value / arr.length];
    });
    return data;
  };
  var findMissingDays = function findMissingDays(data) {
    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        startDate = _ref6.startDate,
        endDate = _ref6.endDate;

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

    var years = new Array(dateFns.differenceInYears(endDate, startDate) + 1).fill(0).map(function (v, i) {
      var y = new Date(startDate.getFullYear() + i, 0);
      return [y, dateFns.startOfMonth(dateFns.endOfYear(y))];
    });
    var byType = Object.keys(data).filter(function (k) {
      return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
    }).map(function (k, i) {
      return years.map(function (year) {
        var sd = year[0].valueOf();
        var ed = year[1].valueOf();
        if (ed > endDate.valueOf()) {
          ed = endDate.valueOf();
          sd = dateFns.startOfMonth(dateFns.subMonths(ed, 11)).valueOf();
        }
        var timeScaler = euiTimeScaler(sd, ed);
        var value = convert(totalTimeseries(filterTimeseries(data[k], sd, ed)) * timeScaler / area, k, "energy");
        return {
          type: k,
          year: new Date(dateFns.getYear(ed), 0).valueOf(),
          value: value
        };
      });
    });
    return byType;
  };
  var EUIByYear = function EUIByYear(data, area, startDate, endDate) {
    var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var baselineYear = arguments[5];

    var years = new Array(dateFns.differenceInYears(endDate, startDate) + 1).fill(0).map(function (v, i) {
      var y = new Date(startDate.getFullYear() + i, 0);
      return [y, dateFns.startOfMonth(dateFns.endOfYear(y))];
    });
    var types = Object.keys(data).filter(function (k) {
      return conversionFactors.hasOwnProperty(k) && conversionFactors[k].energy > 0 && limit.indexOf(k) === -1;
    });
    var baseline = new Map(types.map(function (t) {
      return [t, calcIntensity(data, t, area, baselineYear.valueOf(), dateFns.startOfMonth(dateFns.endOfYear(baselineYear)).valueOf(), limit, true)];
    }));
    years = years.map(function (_ref7) {
      var _ref8 = slicedToArray(_ref7, 2),
          start = _ref8[0],
          end = _ref8[1];

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
      var yearStart = dateFns.startOfYear(dateFns.subYears(new Date(), 1)),
          yearEnd = dateFns.endOfYear(yearStart),
          monthStart = dateFns.startOfMonth(dateFns.subMonths(new Date(), 2)),
          monthEnd = dateFns.endOfMonth(monthStart);
      eui = {
        year: calcEUI(data, area, yearStart, yearEnd) || 0,
        month: calcEUI(data, area, monthStart, monthEnd) || 0
      };
    }
    return eui;
  };

  var utilities = /*#__PURE__*/Object.freeze({
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
    preAllocateTimeseriesMinutes: preAllocateTimeseriesMinutes,
    TimeseriesArrayToObject: TimeseriesArrayToObject,
    TimeseriesObjectToArray: TimeseriesObjectToArray
  });

  var Meters = {
      eui: {
          type: "eui",
          name: "EUI",
          icon: "account_balance",
          color: colors.blueGrey,
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
          color: colors.blueGrey,
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
          color: colors.green,
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
          color: colors.deepOrange,
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
          color: colors.orange,
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
          color: colors.indigo,
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
          color: colors.amber,
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
          color: colors.blue,
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
          color: colors.lightGreen,
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
          color: colors.brown,
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

  var meters = /*#__PURE__*/Object.freeze({
    Meters: Meters,
    meterOrder: meterOrder,
    sortMeters: sortMeters,
    getAvailableMeters: getAvailableMeters,
    simpleMeter: simpleMeter
  });

  var index = Object.assign({}, utilities, meters);

  return index;

}(simpleStatistics,dateFns,colors));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsaXRpZXMuanMiLCIuLi9zcmMvbWV0ZXJzLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIG1lYW4sXG4gIGludGVycXVhcnRpbGVSYW5nZSxcbiAgcXVhbnRpbGUsXG4gIG1pbixcbiAgbWF4LFxuICBzdW0sXG4gIG1lZGlhbkFic29sdXRlRGV2aWF0aW9uLFxuICBtb2RlU29ydGVkLFxuICBtZWRpYW5Tb3J0ZWQsXG4gIHVuaXF1ZUNvdW50U29ydGVkLFxuICB2YXJpYW5jZSxcbiAgc3RhbmRhcmREZXZpYXRpb25cbn0gZnJvbSBcInNpbXBsZS1zdGF0aXN0aWNzXCI7XG5pbXBvcnQge1xuICBzdWJZZWFycyxcbiAgZ2V0WWVhcixcbiAgZm9ybWF0LFxuICBhZGRNaW51dGVzLFxuICBhZGRIb3VycyxcbiAgYWRkRGF5cyxcbiAgYWRkTW9udGhzLFxuICBhZGRZZWFycyxcbiAgc3ViTW9udGhzLFxuICBzdGFydE9mTW9udGgsXG4gIHN0YXJ0T2ZEYXksXG4gIHN0YXJ0T2ZZZWFyLFxuICBlbmRPZlllYXIsXG4gIGVuZE9mTW9udGgsXG4gIGVuZE9mRGF5LFxuICBkaWZmZXJlbmNlSW5ZZWFycyxcbiAgcGFyc2UsXG4gIGdldEhvdXJzLFxuICBnZXRNaW51dGVzLFxuICBzZXRIb3VycyxcbiAgc2V0TWludXRlcyxcbiAgc2V0U2Vjb25kc1xufSBmcm9tIFwiZGF0ZS1mbnNcIjtcbmNvbnN0IHsgZ3JvdXBCeSB9ID0gcmVxdWlyZShcImxvZGFzaFwiKTtcbi8vIENvbnZlcnNpb25zXG5jb25zdCBjb252ZXJzaW9uRmFjdG9ycyA9IHtcbiAgZWxlY3RyaWNpdHk6IHtcbiAgICBlbmVyZ3k6IDMuNDEyMTQxNjMzMSwgLy8ga1doIHRvIGtCdHVcbiAgICBjb3N0OiAwLjExMSwgLy8kL2tXaCxcbiAgICBlbWlzc2lvbnM6IDAuNTMgLy9DTzJlXG4gIH0sXG4gIHN0ZWFtOiB7XG4gICAgZW5lcmd5OiAxLjE5LCAvLyBsYnMgdG8ga0J0dSxcbiAgICBjb3N0OiAwLjAyNTUsIC8vJC9sYnMsXG4gICAgZW1pc3Npb25zOiAwLjEzOTcgLy9DTzJlXG4gIH0sXG4gIGh3OiB7XG4gICAgZW5lcmd5OiAxLCAvLyBrQnR1IHRvIGtCdHUsXG4gICAgY29zdDogMCwgLy8kL2tCdHUsXG4gICAgZW1pc3Npb25zOiAwIC8vQ08yZVxuICB9LFxuICB3YXRlcjoge1xuICAgIGVuZXJneTogMCwgLy8gZ2FscyB0byBrQnR1LFxuICAgIGNvc3Q6IDAuMDE5LCAvLyQvZ2FsLFxuICAgIGVtaXNzaW9uczogMCAvL0NPMmVcbiAgfSxcbiAgY2h3OiB7XG4gICAgZW5lcmd5OiAxMiwgLy8gVG9uSHJzIHRvIGtCdHUsXG4gICAgY29zdDogMC4xODYsIC8vJC9Ub25IcixcbiAgICBlbWlzc2lvbnM6IDAgLy9DTzJlXG4gIH0sXG4gIG5nOiB7XG4gICAgZW5lcmd5OiA5OS45NzYxLCAvLyB0aGVybSB0byBrQnR1LFxuICAgIGNvc3Q6IDAsIC8vJC9rV2gsXG4gICAgZW1pc3Npb25zOiAxMS43IC8vdGhlcm0gdG8gbGJzIENPMmVcbiAgfVxufTtcbmNvbnN0IGNvbnZlcnQgPSAodmFsdWUsIG1ldGVyVHlwZSwgdG8pID0+IHtcbiAgcmV0dXJuIHZhbHVlICogY29udmVyc2lvbkZhY3RvcnNbbWV0ZXJUeXBlXVt0b107XG59O1xuLy8gQnVpbGRpbmdzIGFuZCBNZXRlcnNcbmNvbnN0IHVuaXRzID0ge1xuICBlbGVjdHJpY2l0eTogW1wia1doXCIsIFwiTVdoXCIsIFwiTUpcIiwgXCJrV1wiXSxcbiAgc3RlYW06IFtcImxic1wiLCBcImtCdHVcIiwgXCJidHVcIl0sXG4gIGNodzogW1widG9uLWhyXCIsIFwia0J0dVwiLCBcImJ0dVwiXSxcbiAgbmc6IFtcInRoZXJtXCIsIFwiY2NmXCIsIFwibWNmXCIsIFwia0J0dVwiXSxcbiAgb2lsOiBbXCJnYWxzXCIsIFwiYmFyYWxsZWxcIiwgXCJrQnR1XCIsIFwiYnR1XCJdLFxuICB3YXRlcjogW1wiZ2Fsc1wiXVxufTtcblxuLy8gRm9ybWF0dGluZ1xuY29uc3QgY2FwRmlyc3QgPSAoc3RyaW5nID0gXCJcIikgPT5cbiAgc3RyaW5nLnJlcGxhY2UoXG4gICAgL1xcd1xcUyovZyxcbiAgICB0eHQgPT4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICk7XG5jb25zdCByZXBsYWNlQWxsID0gKHN0cmluZyA9IFwiXCIsIHNlYXJjaCwgcmVwbGFjZW1lbnQpID0+XG4gIHN0cmluZy5yZXBsYWNlKG5ldyBSZWdFeHAoc2VhcmNoLCBcImdcIiksIHJlcGxhY2VtZW50KTtcbmNvbnN0IHN0cmluZ2lmeUlEID0gaWQgPT5cbiAgaWQgPCAxMCA/IGAwMCR7aWR9YCA6IGlkIDwgMTAwID8gYDAke2lkfWAgOiBTdHJpbmcoaWQpO1xuY29uc3QgZm9ybWF0TnVtYmVyID0gbnVtYmVyID0+XG4gIGlzTmFOKG51bWJlcikgPyBcIjBcIiA6IHBhcnNlSW50KE1hdGgucm91bmQobnVtYmVyKSwgMTApLnRvTG9jYWxlU3RyaW5nKCk7XG5jb25zdCBmb3JtYXRGbG9hdCA9IG51bWJlciA9PlxuICBpc05hTihudW1iZXIpID8gXCIwXCIgOiBwYXJzZUZsb2F0KG51bWJlcikudG9Mb2NhbGVTdHJpbmcoKTtcbmNvbnN0IGZvcm1hdFBlcmNlbnQgPSBudW1iZXIgPT5cbiAgaXNOYU4obnVtYmVyKSA/IFwiMFwiIDogZm9ybWF0TnVtYmVyKG51bWJlciAqIDEwMCk7XG5jb25zdCB0b1VSTFF1ZXJ5ID0gb2JqID0+XG4gIFwiP1wiLmNvbmNhdChcbiAgICBPYmplY3Qua2V5cyhvYmopXG4gICAgICAubWFwKGsgPT4gW2ssIG9ialtrXV0uam9pbihcIj1cIikpXG4gICAgICAuam9pbihcIiZcIilcbiAgKTtcbmNvbnN0IHBhcnNlUXVlcnlQYXJhbXMgPSBxdWVyeSA9PlxuICBuZXcgTWFwKFxuICAgIHF1ZXJ5XG4gICAgICAucmVwbGFjZShcIj9cIiwgXCJcIilcbiAgICAgIC5zcGxpdChcIiZcIilcbiAgICAgIC5tYXAocyA9PiBzLnNwbGl0KFwiPVwiKSlcbiAgKTtcbi8vTWFwXG5jb25zdCBjYWxjU2NhbGUgPSAodmFsdWVzLCB1bml0cyA9IFwiXCIpID0+IHtcbiAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih2ID0+IHYgPiAwKTtcbiAgaWYgKHZhbHVlcy5sZW5ndGggPCAxKSByZXR1cm4geyBsb3c6IDEsIGhpZ2g6IDIsIG1heDogMyB9O1xuICByZXR1cm4ge1xuICAgIGxvdzogcGFyc2VJbnQocXVhbnRpbGUodmFsdWVzLCAwLjUpLCAxMCksXG4gICAgaGlnaDogcGFyc2VJbnQocXVhbnRpbGUodmFsdWVzLCAwLjc1KSwgMTApLFxuICAgIG1heDogcGFyc2VJbnQobWF4KHZhbHVlcyksIDEwKSxcbiAgICB1bml0c1xuICB9O1xufTtcbmNvbnN0IGNob29zZUljb24gPSAoYmFzZW5hbWUsIHsgbG93LCBoaWdoIH0sIHZhbHVlKSA9PiB7XG4gIGxldCBpY29uID0gYCR7YmFzZW5hbWV9LWVycmA7XG4gIGlmICghdmFsdWUgfHwgIWxvdyB8fCAhaGlnaCkgcmV0dXJuIGljb247XG4gIHZhbHVlIDw9IGxvd1xuICAgID8gKGljb24gPSBgJHtiYXNlbmFtZX0tbG93YClcbiAgICA6IHZhbHVlIDw9IGhpZ2ggPyAoaWNvbiA9IGAke2Jhc2VuYW1lfS1tZWRgKSA6IChpY29uID0gYCR7YmFzZW5hbWV9LWhpZ2hgKTtcbiAgcmV0dXJuIGljb247XG59O1xuLy9DaGFydGluZyBGdW5jdGlvbnNcbmNvbnN0IHRpbWVzZXJpZXNUb1hZID0gKGRhdGEsIHNjYWxlID0gMSkgPT5cbiAgZGF0YS5tYXAodiA9PiAoe1xuICAgIHg6IG5ldyBEYXRlKHZbMF0pLFxuICAgIHk6IHZbMV0gLyBzY2FsZVxuICB9KSk7XG4vLyBHZW5lcmFsIEZ1bmN0aW9ucyAmIEFkanVzdG1lbnRzXG5jb25zdCBjYWxjUHJvZ3Jlc3MgPSAodmFsdWUsIGJhc2VsaW5lKSA9PiAodmFsdWUgLSBiYXNlbGluZSkgLyBiYXNlbGluZTtcbmNvbnN0IG5vcm1hbGl6ZSA9ICh4LCBtaW4sIG1heCkgPT4gKHggLSBtaW4pIC8gKG1heCAtIG1pbik7XG5jb25zdCBub3JtYWxpemVCYWNrID0gKHgsIG1pbiwgbWF4KSA9PiB4ICogKG1heCAtIG1pbikgKyBtaW47XG5jb25zdCBldWlUaW1lU2NhbGVyID0gKHN0YXJ0RGF0ZSwgZW5kRGF0ZSkgPT4ge1xuICBpZiAoaXNOYU4oc3RhcnREYXRlKSkge1xuICAgIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHN0YXJ0RGF0ZSkudmFsdWVPZigpO1xuICB9XG4gIGlmIChpc05hTihlbmREYXRlKSkge1xuICAgIGVuZERhdGUgPSBuZXcgRGF0ZShlbmREYXRlKS52YWx1ZU9mKCk7XG4gIH1cbiAgbGV0IG1zeWVhciA9IDMxNTU3NjAwMDAwOyAvLyAzNjUuMjUgZGF5c1xuICByZXR1cm4gbXN5ZWFyIC8gKGVuZERhdGUgLSBzdGFydERhdGUpO1xufTtcbmNvbnN0IHZhbGlkRW1haWwgPSBzdHJpbmcgPT4ge1xuICBsZXQgbnIgPSBuZXcgUmVnRXhwKFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvXG4gICk7XG4gIHJldHVybiBCb29sZWFuKHN0cmluZy5tYXRjaChucikpO1xufTtcbi8vIFN0YXRpc3RpY3NcbmNvbnN0IGNhbGNDVlJNU0UgPSAoYWN0dWFsLCBzaW11bGF0ZWQpID0+IHtcbiAgdmFyIGRpZmZBcnJheSA9IFtdLFxuICAgIGFjdHVhbFZhbHVlcyA9IFtdO1xuICBmb3IgKHZhciBpIGluIGFjdHVhbCkge1xuICAgIGRpZmZBcnJheS5wdXNoKE1hdGgucG93KGFjdHVhbFtpXSAtIHNpbXVsYXRlZFtpXSwgMikpO1xuICAgIGFjdHVhbFZhbHVlcy5wdXNoKGFjdHVhbFtpXSk7XG4gIH1cbiAgdmFyIG4gPSBkaWZmQXJyYXkubGVuZ3RoLFxuICAgIHAgPSAxLjA7XG4gIHZhciB5YmFyID0gc3VtKGFjdHVhbFZhbHVlcykgLyBhY3R1YWxWYWx1ZXMubGVuZ3RoO1xuICB2YXIgY3ZybXNlID0gTWF0aC5zcXJ0KHN1bShkaWZmQXJyYXkpIC8gKG4gLSBwKSkgLyB5YmFyO1xuICByZXR1cm4gY3ZybXNlICogMTAwO1xufTtcbmNvbnN0IGNhbGNOTUJFID0gKGFjdHVhbCwgc2ltdWxhdGVkKSA9PiB7XG4gIHZhciBkaWZmQXJyYXkgPSBbXSxcbiAgICBhY3R1YWxWYWx1ZXMgPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBhY3R1YWwpIHtcbiAgICBkaWZmQXJyYXkucHVzaChhY3R1YWxbaV0gLSBzaW11bGF0ZWRbaV0pO1xuICAgIGFjdHVhbFZhbHVlcy5wdXNoKGFjdHVhbFtpXSk7XG4gIH1cbiAgdmFyIG4gPSBkaWZmQXJyYXkubGVuZ3RoLFxuICAgIHAgPSAxLjA7XG4gIHZhciB5YmFyID0gc3VtKGFjdHVhbFZhbHVlcykgLyBhY3R1YWxWYWx1ZXMubGVuZ3RoO1xuICB2YXIgbm1iZSA9IHN1bShkaWZmQXJyYXkpIC8gKChuIC0gcCkgKiB5YmFyKTtcbiAgcmV0dXJuIG5tYmUgKiAxMDA7XG59O1xuY29uc3QgZGF0YVN0YXRpc3RpY3MgPSAodmFsdWVzLCBmaWx0ZXJaZXJvID0gZmFsc2UpID0+IHtcbiAgaWYgKGZpbHRlclplcm8pIHtcbiAgICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHYgPT4gdiA+IDApO1xuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoIDwgMikge1xuICAgIC8vIHRocm93IG5ldyBFcnJvcignTm90IEVub3VnaCBWYWx1ZXMnKVxuICAgIHJldHVybiB7fTtcbiAgfVxuICB2YWx1ZXMgPSB2YWx1ZXMuc29ydCgpO1xuICBsZXQgaXEgPSBpbnRlcnF1YXJ0aWxlUmFuZ2UodmFsdWVzKSxcbiAgICBxMSA9IHF1YW50aWxlKHZhbHVlcywgMC4yNSksXG4gICAgcTMgPSBxdWFudGlsZSh2YWx1ZXMsIDAuNzUpLFxuICAgIGxvd2VySW5uZXJGZW5jZSA9IHExIC0gMS41ICogaXEsXG4gICAgbG93ZXJPdXRlckZlbmNlID0gcTMgLSAzICogaXEsXG4gICAgdXBwZXJJbm5lckZlbmNlID0gcTEgKyAxLjUgKiBpcSxcbiAgICB1cHBlck91dGVyRmVuY2UgPSBxMyArIDMgKiBpcTtcbiAgcmV0dXJuIHtcbiAgICBpcSxcbiAgICBxMSxcbiAgICBxMyxcbiAgICBsb3dlcklubmVyRmVuY2UsXG4gICAgbG93ZXJPdXRlckZlbmNlLFxuICAgIHVwcGVySW5uZXJGZW5jZSxcbiAgICB1cHBlck91dGVyRmVuY2UsXG4gICAgbWluOiBtaW4odmFsdWVzKSxcbiAgICBtYXg6IG1heCh2YWx1ZXMpLFxuICAgIG1lYW46IG1lYW4odmFsdWVzKSxcbiAgICBtb2RlOiBtb2RlU29ydGVkKHZhbHVlcyksXG4gICAgbWVkaWFuOiBtZWRpYW5Tb3J0ZWQodmFsdWVzKSxcbiAgICBtZWRpYW5BYnNvbHV0ZURldmlhdGlvbjogbWVkaWFuQWJzb2x1dGVEZXZpYXRpb24odmFsdWVzKSxcbiAgICB1bmlxdWVDb3VudFNvcnRlZDogdW5pcXVlQ291bnRTb3J0ZWQodmFsdWVzKSxcbiAgICBzdGFuZGFyZERldmlhdGlvbjogc3RhbmRhcmREZXZpYXRpb24odmFsdWVzKSxcbiAgICB2YXJpYW5jZTogdmFyaWFuY2UodmFsdWVzKVxuICB9O1xufTtcbmNvbnN0IGJveFBsb3QgPSAodmFsdWVzLCBmaWx0ZXJaZXJvID0gZmFsc2UpID0+IHtcbiAgaWYgKGZpbHRlclplcm8pIHtcbiAgICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHYgPT4gdiA+IDApO1xuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBlbm91Z2ggdmFsdWVzXCIpO1xuICB9XG4gIGxldCBxMSA9IHF1YW50aWxlKHZhbHVlcywgMC4yNSksXG4gICAgcTMgPSBxdWFudGlsZSh2YWx1ZXMsIDAuNzUpLFxuICAgIG1pblZhbCA9IG1pbih2YWx1ZXMpLFxuICAgIG1heFZhbCA9IG1heCh2YWx1ZXMpO1xuICByZXR1cm4ge1xuICAgIHExLFxuICAgIHEzLFxuICAgIG1pbjogbWluVmFsLFxuICAgIG1heDogbWF4VmFsXG4gIH07XG59O1xuXG4vLyBEYXRlc1xuY29uc3QgaW50ZXJ2YWxTdGFydCA9IChkYXRlLCBpbnRlcnZhbCkgPT4ge1xuICAvL1N1cHBvcnRlZCBJbnRlcnZhbHM6IGRheSwgbW9udGgsIHllYXJcbiAgbGV0IHQ7XG4gIHN3aXRjaCAoaW50ZXJ2YWwpIHtcbiAgICBjYXNlIFwiZGF5XCI6XG4gICAgICB0ID0gc3RhcnRPZkRheShkYXRlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtb250aFwiOlxuICAgICAgdCA9IHN0YXJ0T2ZNb250aChkYXRlKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0ID0gc3RhcnRPZlllYXIoZGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHQudmFsdWVPZigpO1xufTtcbmNvbnN0IGRhdGVSYW5nZSA9IChzdGFydERhdGUsIGVuZERhdGUsIGludGVydmFsLCBzdGVwID0gMSkgPT4ge1xuICAvLyBTdXBwb3J0ZWQgSW5lcnZhbHM6IG1pbnV0ZXMsaG91cixkYXksIG1vbnRoLCB5ZWFyXG4gIHN0YXJ0RGF0ZSA9IHBhcnNlKHN0YXJ0RGF0ZSk7XG4gIGVuZERhdGUgPSBwYXJzZShlbmREYXRlKTtcbiAgbGV0IHJhbmdlID0gW3N0YXJ0RGF0ZV07XG4gIGlmIChzdGFydERhdGUgPj0gZW5kRGF0ZSkgcmV0dXJuIFtdO1xuICB3aGlsZSAocmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV0udmFsdWVPZigpIDwgZW5kRGF0ZS52YWx1ZU9mKCkpIHtcbiAgICBsZXQgZDtcbiAgICBzd2l0Y2ggKGludGVydmFsKSB7XG4gICAgICBjYXNlIFwibWludXRlXCI6XG4gICAgICAgIGQgPSBhZGRNaW51dGVzKHJhbmdlW3JhbmdlLmxlbmd0aCAtIDFdLCBzdGVwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91clwiOlxuICAgICAgICBkID0gYWRkSG91cnMocmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV0sIHN0ZXApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkYXlcIjpcbiAgICAgICAgZCA9IGFkZERheXMocmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV0sIHN0ZXApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aFwiOlxuICAgICAgICBkID0gYWRkTW9udGhzKHJhbmdlW3JhbmdlLmxlbmd0aCAtIDFdLCBzdGVwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkID0gYWRkWWVhcnMocmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV0sIHN0ZXApO1xuICAgIH1cbiAgICByYW5nZS5wdXNoKGQpO1xuICB9XG4gIHJldHVybiByYW5nZTtcbn07XG5cbi8vIFRpbWVzZXJpZXMgW1tkYXRlVGltZSwgdmFsdWUsIG9yaWdpb25hbFZhbHVlXSwgLi4uXVxuLy8gU3RhdHNcbmNvbnN0IG1pblRpbWVzZXJpZXMgPSB0cyA9PiBtaW4odHMubWFwKHYgPT4gdlsxXSkpO1xuY29uc3QgbWF4VGltZXNlcmllcyA9IHRzID0+IG1heCh0cy5tYXAodiA9PiB2WzFdKSk7XG5jb25zdCBtYXhUaW1lc2VyaWVzV2l0aERhdGUgPSB0cyA9PiB0cy5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSlbMF07XG5jb25zdCBjYXJkaW5hbGl0eVRpbWVzZXJpZXMgPSB0cyA9PiBuZXcgU2V0KHRzLm1hcCh2ID0+IHZbMV0pKS5zaXplO1xuY29uc3QgZ2V0Rmlyc3RUaW1lc3RhbXAgPSB0cyA9PiBuZXcgRGF0ZShtaW4odHMubWFwKHYgPT4gdlswXSkpKTtcbmNvbnN0IGdldExhc3RUaW1lc3RhbXAgPSB0cyA9PiBuZXcgRGF0ZShtYXgodHMubWFwKHYgPT4gdlswXSkpKTtcbi8vIFJlZHVjZVxuY29uc3QgcmVkdWNlVGltZXNlcmllcyA9ICguLi5hcnJheXMpID0+XG4gIFtcbiAgICAuLi5hcnJheXMubWFwKGEgPT4gbmV3IE1hcChhKSkucmVkdWNlKChhLCBiKSA9PiB7XG4gICAgICBmb3IgKHZhciBkYXRlIG9mIGIua2V5cygpKSB7XG4gICAgICAgIGEuaGFzKGRhdGUpXG4gICAgICAgICAgPyBhLnNldChkYXRlLCBiLmdldChkYXRlKSArIGEuZ2V0KGRhdGUpKVxuICAgICAgICAgIDogYS5zZXQoZGF0ZSwgYi5nZXQoZGF0ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfSwgbmV3IE1hcCgpKVxuICBdLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbi8vIENsZWFuaW5nXG5jb25zdCBjbGVhblRpbWVzZXJpZXMgPSAoZGF0YSwgcmVwbGFjZW1lbnQsIG1pbiwgbWF4KSA9PiB7XG4gIGRhdGEgPSBkYXRhLm1hcChcbiAgICB2ID0+ICh2WzFdID4gbWF4IHx8IHZbMV0gPCBtaW4gPyBbdlswXSwgcmVwbGFjZW1lbnQsIHZbMV1dIDogdilcbiAgKTtcbiAgcmV0dXJuIGRhdGE7XG59O1xuY29uc3QgdW5jbGVhblRpbWVzZXJpZXMgPSBkYXRhID0+IGRhdGEubWFwKHIgPT4gKHJbMl0gPyBbclswXSwgclsyXV0gOiByKSk7XG5jb25zdCBpbnRlcnBvbGF0ZVRpbWVzZXJpZXMgPSAoYXJyYXksIGluZGV4KSA9PiB7XG4gIGxldCBwcmV2SW5kZXggPSBpbmRleCAtIDEgPCAwID8gMCA6IGluZGV4IC0gMTtcbiAgbGV0IHByZXYgPSBhcnJheVxuICAgIC5zbGljZSgwLCBwcmV2SW5kZXgpXG4gICAgLmZpbHRlcih2ID0+IHZbMV0pXG4gICAgLnJldmVyc2UoKVswXTtcbiAgbGV0IG5leHQgPSBhcnJheS5zbGljZShpbmRleCArIDEpLmZpbHRlcih2ID0+IHZbMV0pWzBdO1xuICByZXR1cm4gKChwcmV2ID8gcHJldlsxXSA6IDApICsgKG5leHQgPyBuZXh0WzFdIDogMCkpIC8gMjtcbn07XG5jb25zdCBjbGVhblRpbWVzZXJpZXNJbnRlcnBvbGF0ZSA9IChkYXRhLCBtaW4sIG1heCkgPT4ge1xuICBkYXRhID0gZGF0YVxuICAgIC5tYXAodiA9PiAoaXNOYU4odlsxXSkgPyBbdlswXSwgMCwgdlsxXV0gOiB2KSlcbiAgICAubWFwKHYgPT4gKHZbMV0gPCBtaW4gPyBbdlswXSwgbnVsbCwgdlsxXV0gOiB2KSkgLy9taW5cbiAgICAubWFwKHYgPT4gKHZbMV0gPiBtYXggPyBbdlswXSwgbnVsbCwgdlsxXV0gOiB2KSkgLy9tYXhcbiAgICAubWFwKCh2LCBpLCBhcnJheSkgPT4ge1xuICAgICAgaWYgKCF2WzFdKSB7XG4gICAgICAgIGxldCBhdmcgPSBpbnRlcnBvbGF0ZVRpbWVzZXJpZXMoYXJyYXksIGkpO1xuICAgICAgICByZXR1cm4gW3ZbMF0sIGF2ZywgdlsyXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICB9KTsgLy9pbnRlcnBvbGF0ZVxuICByZXR1cm4gZGF0YTtcbn07XG4vLyBGaWx0ZXJpbmdcbmNvbnN0IGZpbHRlclRpbWVzZXJpZXMgPSAoZGF0YSwgc3RhcnREYXRlLCBlbmREYXRlKSA9PlxuICBkYXRhLmZpbHRlcih0ID0+IHRbMF0gPj0gc3RhcnREYXRlICYmIHRbMF0gPD0gZW5kRGF0ZSk7XG4vLyBNYXBwaW5nXG5jb25zdCB2YWx1ZXNUaW1lc2VyaWVzID0gZGF0YSA9PiBkYXRhLm1hcCh2ID0+IHZbMV0pO1xuLy8gUHJlIEFsbG9jYXRlXG5jb25zdCBwcmVBbGxvY2F0ZVRpbWVzZXJpZXNNaW51dGVzID0gKCkgPT4ge1xuICBsZXQgbyA9IHt9O1xuICBmb3IgKHZhciBoID0gMDsgaCA8IDI0OyBoKyspIHtcbiAgICBvW2hdID0ge307XG4gICAgZm9yICh2YXIgbSA9IDA7IG0gPCA2MDsgbSsrKSB7XG4gICAgICBvW2hdW21dID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG87XG59O1xuLy8gY29uc3QgcHJlQWxsb2NhdGVUaW1lc2VyaWVzU2Vjb25kcyA9ICgpID0+IHtcbi8vICAgbGV0IG8gPSB7fTtcbi8vICAgZm9yICh2YXIgaCA9IDA7IGggPCAyNDsgaCsrKSB7XG4vLyAgICAgb1toXSA9IHt9O1xuLy8gICAgIGZvciAodmFyIG0gPSAwOyBtIDwgNjA7IG0rKykge1xuLy8gICAgICAgb1toXVttXSA9IHt9O1xuLy8gICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCA2MDsgcysrKSB7XG4vLyAgICAgICAgIG9baF1bbV1bc10gPSBudWxsO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuLy8gICByZXR1cm4gbztcbi8vIH07XG4vLyBUcmFuc2Zvcm1cbmNvbnN0IFRpbWVzZXJpZXNBcnJheVRvT2JqZWN0ID0gZGF0YSA9PiB7XG4gIGxldCBkYXlzID0gZ3JvdXBUaW1lc2VyaWVzKGRhdGEsIFwiZGF5XCIpLm1hcCgoW2RheSwgdHNdKSA9PiB7XG4gICAgbGV0IG9iaiA9IHByZUFsbG9jYXRlVGltZXNlcmllc01pbnV0ZXMoKTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgaHIgPSBnZXRIb3Vycyh0c1t4XVswXSksXG4gICAgICAgIG0gPSBnZXRNaW51dGVzKHRzW3hdWzBdKTtcbiAgICAgIG9ialtocl1bbV0gPSB0c1t4XVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIFtkYXksIG9ial07XG4gIH0pO1xuICByZXR1cm4gZGF5cztcbn07XG5jb25zdCBUaW1lc2VyaWVzT2JqZWN0VG9BcnJheSA9IChkYXRhLCB0aW1lc3RhbXApID0+IHtcbiAgbGV0IGFycmF5ID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICAubWFwKGggPT5cbiAgICAgIE9iamVjdC5rZXlzKGRhdGFbaF0pLm1hcChtID0+XG4gICAgICAgIE9iamVjdC5rZXlzKFxuICAgICAgICAgIGRhdGFbaF1bbV0ubWFwKHMgPT4gW1xuICAgICAgICAgICAgc2V0SG91cnMoc2V0TWludXRlcyhzZXRTZWNvbmRzKHRpbWVzdGFtcCwgcyksIG0pLCBoKSxcbiAgICAgICAgICAgIGRhdGFbaF1bbV1cbiAgICAgICAgICBdKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhWzBdLnZhbHVlT2YoKSAtIGJbMF0udmFsdWVPZigpKTtcbiAgcmV0dXJuIGFycmF5O1xufTtcbi8vIEdyb3VwaW5nXG5jb25zdCBncm91cFRpbWVzZXJpZXNEYXkgPSB0cyA9PlxuICBPYmplY3QuZW50cmllcyhncm91cEJ5KHRzLCB2ID0+IHN0YXJ0T2ZEYXkodlswXSkudmFsdWVPZigpKSkubWFwKFxuICAgIChbZGF5LCB0aW1lc2VyaWVzXSkgPT4gW051bWJlcihkYXkpLCB0aW1lc2VyaWVzXVxuICApO1xuY29uc3QgZ3JvdXBUaW1lc2VyaWVzID0gKGRhdGEsIGludGVydmFsKSA9PiB7XG4gIC8vU3VwcG9ydGVkIEludGVydmFsczogZGF5LCBtb250aCwgeWVhclxuICBsZXQgZ3JvdXAgPSBkYXRhLm1hcCh2ID0+IFtwYXJzZSh2WzBdKS52YWx1ZU9mKCksIHZbMV1dKS5yZWR1Y2UoKGEsIGIpID0+IHtcbiAgICBsZXQgdCA9IGludGVydmFsU3RhcnQoYlswXSwgaW50ZXJ2YWwpO1xuICAgIGlmIChhLmhhcyh0KSkge1xuICAgICAgYS5zZXQodCwgWy4uLmEuZ2V0KHQpLCBiXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGEuc2V0KHQsIFtiXSk7XG4gICAgfVxuICAgIHJldHVybiBhO1xuICB9LCBuZXcgTWFwKCkpO1xuICByZXR1cm4gWy4uLmdyb3VwXTtcbn07XG4vLyBBZ2dyZWdhdGlvblxuY29uc3QgYWdncmVnYXRlVGltZVNlcmllcyA9IChkYXRhLCBpbnRlcnZhbCkgPT4ge1xuICAvL1N1cHBvcnRlZCBJbnRlcnZhbHM6IGRheSwgbW9udGgsIHllYXJcbiAgbGV0IHJlZCA9IGRhdGEubWFwKHYgPT4gW3BhcnNlKHZbMF0pLCB2WzFdXSkucmVkdWNlKChhLCBiKSA9PiB7XG4gICAgbGV0IHRzID0gaW50ZXJ2YWxTdGFydChiWzBdLCBpbnRlcnZhbCk7XG4gICAgaWYgKCFhLmhhcyh0cykpIHtcbiAgICAgIGEuc2V0KHRzLCBiWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYS5zZXQodHMsIGEuZ2V0KHRzKSArIGJbMV0pO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfSwgbmV3IE1hcCgpKTtcbiAgZGF0YSA9IFsuLi5yZWRdLm1hcCh2ID0+IFtuZXcgRGF0ZSh2WzBdKS52YWx1ZU9mKCksIHZbMV1dKTtcbiAgcmV0dXJuIGRhdGE7XG59O1xuY29uc3QgdG90YWxUaW1lc2VyaWVzID0gZGF0YSA9PiBkYXRhLm1hcChhID0+IGFbMV0pLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuY29uc3QgYXZlcmFnZVRpbWVzZXJpZXMgPSBkYXRhID0+IG1lYW4oZGF0YS5tYXAodiA9PiB2WzFdKSk7XG5jb25zdCBtb250aGx5VmFsdWVXaXRoVHJlbmQgPSAoZGF0YSwgdW5pdHMsIG1vbnRoLCBiYXNlbGluZSkgPT4ge1xuICBsZXQgZG0gPSBuZXcgTWFwKGRhdGEpO1xuICBpZiAoIWRtLmhhcyhtb250aC52YWx1ZU9mKCkpKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IDAsIHRyZW5kOiB7IHZhbHVlOiBudWxsLCB0ZXh0OiBcIlwiIH0gfTtcbiAgfVxuICBsZXQgdmFsdWUgPSBkbS5nZXQobW9udGgudmFsdWVPZigpKSxcbiAgICBiYXNlbGluZVZhbHVlID0gZG0uZ2V0KGJhc2VsaW5lLnZhbHVlT2YoKSkgfHwgMDtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZSxcbiAgICB1bml0cyxcbiAgICB0cmVuZDoge1xuICAgICAgdmFsdWU6IGNhbGNQcm9ncmVzcyh2YWx1ZSwgYmFzZWxpbmVWYWx1ZSkgKiAxMDAsXG4gICAgICB0ZXh0OiBgJHtmb3JtYXQoYmFzZWxpbmUsIFwiTU1NIFlZWVlcIil9YFxuICAgIH1cbiAgfTtcbn07XG4vLyBFVENcbmNvbnN0IGlzVGltZXNlcmllc1VuaWZvcm0gPSBkYXRhID0+IGNhcmRpbmFsaXR5VGltZXNlcmllcyhkYXRhKSA8IDM7XG5jb25zdCBtYWtlRGFpbHlUaW1lc2VyaWVzID0gKGRhdGUsIHZhbHVlLCBpbnRlcnZhbCwgc3RlcCkgPT4ge1xuICBsZXQgcmFuZ2UgPSBkYXRlUmFuZ2UoZGF0ZSwgZW5kT2ZEYXkoZGF0ZSksIGludGVydmFsKTtcbiAgbGV0IGRhdGEgPSByYW5nZS5tYXAoKGQsIGksIGFycikgPT4gW2QudmFsdWVPZigpLCB2YWx1ZSAvIGFyci5sZW5ndGhdKTtcbiAgcmV0dXJuIGRhdGE7XG59O1xuY29uc3QgZmluZE1pc3NpbmdEYXlzID0gKGRhdGEsIHsgc3RhcnREYXRlLCBlbmREYXRlIH0gPSB7fSkgPT4ge1xuICAvLyBTb3J0IERhdGFcbiAgZGF0YSA9IGRhdGEuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAvLyBTZXQgRGVmYXVsdCBTdGFydCBEYXRlc1xuICBpZiAoIXN0YXJ0RGF0ZSkge1xuICAgIHN0YXJ0RGF0ZSA9IGRhdGFbMF1bMF07XG4gIH1cbiAgaWYgKCFlbmREYXRlKSB7XG4gICAgZW5kRGF0ZSA9IGRhdGFbZGF0YS5sZW5ndGggLSAxXVswXTtcbiAgfVxuICBsZXQgcmFuZ2UgPSBkYXRlUmFuZ2Uoc3RhcnREYXRlLCBlbmREYXRlLCBcImRheVwiKTtcbiAgbGV0IGZ1bGxUcyA9IG5ldyBTZXQocmFuZ2UubWFwKGQgPT4gZC52YWx1ZU9mKCkpKTtcbiAgbGV0IGRhdGFEYXRlcyA9IG5ldyBTZXQoZGF0YS5tYXAoZCA9PiBkWzBdKSk7XG4gIGxldCBtaXNzaW5nID0gbmV3IFNldChbLi4uZnVsbFRzXS5maWx0ZXIoZCA9PiAhZGF0YURhdGVzLmhhcyhkKSkpO1xuICByZXR1cm4gWy4uLm1pc3NpbmddO1xufTtcblxuLy8gRW5lcmd5XG5jb25zdCBjYWxjTWV0ZXJUb3RhbCA9IChkYXRhLCB0eXBlLCBzdGFydERhdGUsIGVuZERhdGUsIGxpbWl0ID0gW10pID0+IHtcbiAgbGV0IHRvdGFsID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICAuZmlsdGVyKGsgPT4gbGltaXQuaW5kZXhPZihrKSA9PT0gLTEpXG4gICAgLmZpbHRlcihrID0+IGNvbnZlcnNpb25GYWN0b3JzLmhhc093blByb3BlcnR5KGspICYmIGRhdGFba10ubGVuZ3RoID4gMClcbiAgICAubWFwKChrLCBpKSA9PlxuICAgICAgZmlsdGVyVGltZXNlcmllcyhkYXRhW2tdLCBzdGFydERhdGUsIGVuZERhdGUpLm1hcCh2ID0+IFtcbiAgICAgICAgdlswXSxcbiAgICAgICAgY29udmVydCh2WzFdLCBrLCB0eXBlKVxuICAgICAgXSlcbiAgICApXG4gICAgLnJlZHVjZSgoYSwgYikgPT4gcmVkdWNlVGltZXNlcmllcyhhLCBiKSwgW10pO1xuICByZXR1cm4gdG90YWw7XG59O1xuY29uc3QgY2FsY0VVSSA9IChkYXRhLCBhcmVhLCBzdGFydERhdGUsIGVuZERhdGUsIGxpbWl0ID0gW10pID0+IHtcbiAgbGV0IHRvdGFsRW5lcmd5ID0gdG90YWxUaW1lc2VyaWVzKFxuICAgIGNhbGNNZXRlclRvdGFsKGRhdGEsIFwiZW5lcmd5XCIsIHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgbGltaXQpXG4gICk7XG4gIHJldHVybiB0b3RhbEVuZXJneSAvIGFyZWEgKiBldWlUaW1lU2NhbGVyKHN0YXJ0RGF0ZSwgZW5kRGF0ZSk7XG59O1xuY29uc3QgY2FsY0ludGVuc2l0eSA9IChcbiAgZGF0YSxcbiAgdHlwZSxcbiAgYXJlYSxcbiAgc3RhcnREYXRlLFxuICBlbmREYXRlLFxuICBsaW1pdCA9IFtdLFxuICBidHUgPSBmYWxzZVxuKSA9PiB7XG4gIGlmIChbXCJlbmVyZ3lcIiwgXCJlbWlzc2lvbnNcIiwgXCJjb3N0XCJdLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG4gICAgbGV0IHRvdGFsRW5lcmd5ID0gdG90YWxUaW1lc2VyaWVzKFxuICAgICAgY2FsY01ldGVyVG90YWwoZGF0YSwgdHlwZSwgc3RhcnREYXRlLCBlbmREYXRlLCBsaW1pdClcbiAgICApO1xuICAgIHJldHVybiB0b3RhbEVuZXJneSAvIGFyZWEgKiBldWlUaW1lU2NhbGVyKHN0YXJ0RGF0ZSwgZW5kRGF0ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gMDtcbiAgICBsZXQgdG90YWwgPSB0b3RhbFRpbWVzZXJpZXMoXG4gICAgICBmaWx0ZXJUaW1lc2VyaWVzKGRhdGFbdHlwZV0sIHN0YXJ0RGF0ZSwgZW5kRGF0ZSlcbiAgICApO1xuICAgIGxldCB2YWx1ZSA9IHRvdGFsIC8gYXJlYSAqIGV1aVRpbWVTY2FsZXIoc3RhcnREYXRlLCBlbmREYXRlKTtcbiAgICByZXR1cm4gYnR1ID8gY29udmVydCh2YWx1ZSwgdHlwZSwgXCJlbmVyZ3lcIikgOiB2YWx1ZTtcbiAgfVxufTtcblxuY29uc3QgRVVJQnlUeXBlID0gKGRhdGEsIGFyZWEsIHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgbGltaXQgPSBbXSkgPT4ge1xuICBsZXQgeWVhcnMgPSBuZXcgQXJyYXkoZGlmZmVyZW5jZUluWWVhcnMoZW5kRGF0ZSwgc3RhcnREYXRlKSArIDEpXG4gICAgLmZpbGwoMClcbiAgICAubWFwKCh2LCBpKSA9PiB7XG4gICAgICBsZXQgeSA9IG5ldyBEYXRlKHN0YXJ0RGF0ZS5nZXRGdWxsWWVhcigpICsgaSwgMCk7XG4gICAgICByZXR1cm4gW3ksIHN0YXJ0T2ZNb250aChlbmRPZlllYXIoeSkpXTtcbiAgICB9KTtcbiAgbGV0IGJ5VHlwZSA9IE9iamVjdC5rZXlzKGRhdGEpXG4gICAgLmZpbHRlcihcbiAgICAgIGsgPT5cbiAgICAgICAgY29udmVyc2lvbkZhY3RvcnMuaGFzT3duUHJvcGVydHkoaykgJiZcbiAgICAgICAgY29udmVyc2lvbkZhY3RvcnNba10uZW5lcmd5ID4gMCAmJlxuICAgICAgICBsaW1pdC5pbmRleE9mKGspID09PSAtMVxuICAgIClcbiAgICAubWFwKChrLCBpKSA9PlxuICAgICAgeWVhcnMubWFwKHllYXIgPT4ge1xuICAgICAgICBsZXQgc2QgPSB5ZWFyWzBdLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGVkID0geWVhclsxXS52YWx1ZU9mKCk7XG4gICAgICAgIGlmIChlZCA+IGVuZERhdGUudmFsdWVPZigpKSB7XG4gICAgICAgICAgZWQgPSBlbmREYXRlLnZhbHVlT2YoKTtcbiAgICAgICAgICBzZCA9IHN0YXJ0T2ZNb250aChzdWJNb250aHMoZWQsIDExKSkudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0aW1lU2NhbGVyID0gZXVpVGltZVNjYWxlcihzZCwgZWQpO1xuICAgICAgICBsZXQgdmFsdWUgPSBjb252ZXJ0KFxuICAgICAgICAgIHRvdGFsVGltZXNlcmllcyhmaWx0ZXJUaW1lc2VyaWVzKGRhdGFba10sIHNkLCBlZCkpICpcbiAgICAgICAgICAgIHRpbWVTY2FsZXIgL1xuICAgICAgICAgICAgYXJlYSxcbiAgICAgICAgICBrLFxuICAgICAgICAgIFwiZW5lcmd5XCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiBrLFxuICAgICAgICAgIHllYXI6IG5ldyBEYXRlKGdldFllYXIoZWQpLCAwKS52YWx1ZU9mKCksXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgKTtcbiAgcmV0dXJuIGJ5VHlwZTtcbn07XG5jb25zdCBFVUlCeVllYXIgPSAoXG4gIGRhdGEsXG4gIGFyZWEsXG4gIHN0YXJ0RGF0ZSxcbiAgZW5kRGF0ZSxcbiAgbGltaXQgPSBbXSxcbiAgYmFzZWxpbmVZZWFyXG4pID0+IHtcbiAgbGV0IHllYXJzID0gbmV3IEFycmF5KGRpZmZlcmVuY2VJblllYXJzKGVuZERhdGUsIHN0YXJ0RGF0ZSkgKyAxKVxuICAgIC5maWxsKDApXG4gICAgLm1hcCgodiwgaSkgPT4ge1xuICAgICAgbGV0IHkgPSBuZXcgRGF0ZShzdGFydERhdGUuZ2V0RnVsbFllYXIoKSArIGksIDApO1xuICAgICAgcmV0dXJuIFt5LCBzdGFydE9mTW9udGgoZW5kT2ZZZWFyKHkpKV07XG4gICAgfSk7XG4gIGxldCB0eXBlcyA9IE9iamVjdC5rZXlzKGRhdGEpLmZpbHRlcihcbiAgICBrID0+XG4gICAgICBjb252ZXJzaW9uRmFjdG9ycy5oYXNPd25Qcm9wZXJ0eShrKSAmJlxuICAgICAgY29udmVyc2lvbkZhY3RvcnNba10uZW5lcmd5ID4gMCAmJlxuICAgICAgbGltaXQuaW5kZXhPZihrKSA9PT0gLTFcbiAgKTtcbiAgbGV0IGJhc2VsaW5lID0gbmV3IE1hcChcbiAgICB0eXBlcy5tYXAodCA9PiBbXG4gICAgICB0LFxuICAgICAgY2FsY0ludGVuc2l0eShcbiAgICAgICAgZGF0YSxcbiAgICAgICAgdCxcbiAgICAgICAgYXJlYSxcbiAgICAgICAgYmFzZWxpbmVZZWFyLnZhbHVlT2YoKSxcbiAgICAgICAgc3RhcnRPZk1vbnRoKGVuZE9mWWVhcihiYXNlbGluZVllYXIpKS52YWx1ZU9mKCksXG4gICAgICAgIGxpbWl0LFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgXSlcbiAgKTtcbiAgeWVhcnMgPSB5ZWFycy5tYXAoKFtzdGFydCwgZW5kXSkgPT4gW1xuICAgIHN0YXJ0LnZhbHVlT2YoKSxcbiAgICB0eXBlcy5tYXAodCA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSBjYWxjSW50ZW5zaXR5KFxuICAgICAgICBkYXRhLFxuICAgICAgICB0LFxuICAgICAgICBhcmVhLFxuICAgICAgICBzdGFydC52YWx1ZU9mKCksXG4gICAgICAgIGVuZC52YWx1ZU9mKCksXG4gICAgICAgIGxpbWl0LFxuICAgICAgICB0cnVlXG4gICAgICApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogdCxcbiAgICAgICAgcHJvZ3Jlc3M6IGNhbGNQcm9ncmVzcyh2YWx1ZSwgYmFzZWxpbmUuZ2V0KHQpKSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH07XG4gICAgfSlcbiAgXSk7XG4gIHJldHVybiB5ZWFycztcbn07XG5jb25zdCBjYWxjQnVpbGRpbmdFVUkgPSAoZGF0YSwgYXJlYSkgPT4ge1xuICBsZXQgZXVpO1xuICBpZiAoIWRhdGEgfHwgIWFyZWEpIHtcbiAgICBldWkgPSB7XG4gICAgICB5ZWFyOiAwLFxuICAgICAgbW9udGg6IDBcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGxldCB5ZWFyU3RhcnQgPSBzdGFydE9mWWVhcihzdWJZZWFycyhuZXcgRGF0ZSgpLCAxKSksXG4gICAgICB5ZWFyRW5kID0gZW5kT2ZZZWFyKHllYXJTdGFydCksXG4gICAgICBtb250aFN0YXJ0ID0gc3RhcnRPZk1vbnRoKHN1Yk1vbnRocyhuZXcgRGF0ZSgpLCAyKSksXG4gICAgICBtb250aEVuZCA9IGVuZE9mTW9udGgobW9udGhTdGFydCk7XG4gICAgZXVpID0ge1xuICAgICAgeWVhcjogY2FsY0VVSShkYXRhLCBhcmVhLCB5ZWFyU3RhcnQsIHllYXJFbmQpIHx8IDAsXG4gICAgICBtb250aDogY2FsY0VVSShkYXRhLCBhcmVhLCBtb250aFN0YXJ0LCBtb250aEVuZCkgfHwgMFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGV1aTtcbn07XG5cbmV4cG9ydCB7XG4gIGNhbGNTY2FsZSxcbiAgY2hvb3NlSWNvbixcbiAgdmFsaWRFbWFpbCxcbiAgdG9VUkxRdWVyeSxcbiAgcGFyc2VRdWVyeVBhcmFtcyxcbiAgY29udmVyc2lvbkZhY3RvcnMsXG4gIHVuaXRzLFxuICBjb252ZXJ0LFxuICBjYXBGaXJzdCxcbiAgcmVwbGFjZUFsbCxcbiAgc3RyaW5naWZ5SUQsXG4gIGZvcm1hdE51bWJlcixcbiAgZm9ybWF0RmxvYXQsXG4gIGZvcm1hdFBlcmNlbnQsXG4gIGNhbGNQcm9ncmVzcyxcbiAgbm9ybWFsaXplLFxuICBub3JtYWxpemVCYWNrLFxuICBldWlUaW1lU2NhbGVyLFxuICBjYWxjQ1ZSTVNFLFxuICBjYWxjTk1CRSxcbiAgYm94UGxvdCxcbiAgbWluVGltZXNlcmllcyxcbiAgbWF4VGltZXNlcmllcyxcbiAgcmVkdWNlVGltZXNlcmllcyxcbiAgZmlsdGVyVGltZXNlcmllcyxcbiAgZ3JvdXBUaW1lc2VyaWVzLFxuICBncm91cFRpbWVzZXJpZXNEYXksXG4gIGFnZ3JlZ2F0ZVRpbWVTZXJpZXMsXG4gIHRvdGFsVGltZXNlcmllcyxcbiAgYXZlcmFnZVRpbWVzZXJpZXMsXG4gIG1ha2VEYWlseVRpbWVzZXJpZXMsXG4gIGZpbmRNaXNzaW5nRGF5cyxcbiAgY2FsY0VVSSxcbiAgY2FsY0J1aWxkaW5nRVVJLFxuICBjYWxjSW50ZW5zaXR5LFxuICBFVUlCeVR5cGUsXG4gIEVVSUJ5WWVhcixcbiAgY2FsY01ldGVyVG90YWwsXG4gIGNsZWFuVGltZXNlcmllc0ludGVycG9sYXRlLFxuICBkYXRhU3RhdGlzdGljcyxcbiAgdW5jbGVhblRpbWVzZXJpZXMsXG4gIGludGVycG9sYXRlVGltZXNlcmllcyxcbiAgbWF4VGltZXNlcmllc1dpdGhEYXRlLFxuICB2YWx1ZXNUaW1lc2VyaWVzLFxuICB0aW1lc2VyaWVzVG9YWSxcbiAgY2xlYW5UaW1lc2VyaWVzLFxuICBpc1RpbWVzZXJpZXNVbmlmb3JtLFxuICBtb250aGx5VmFsdWVXaXRoVHJlbmQsXG4gIGdldExhc3RUaW1lc3RhbXAsXG4gIGdldEZpcnN0VGltZXN0YW1wLFxuICBwcmVBbGxvY2F0ZVRpbWVzZXJpZXNNaW51dGVzLFxuICBUaW1lc2VyaWVzQXJyYXlUb09iamVjdCxcbiAgVGltZXNlcmllc09iamVjdFRvQXJyYXlcbn07XG4iLCJpbXBvcnQge1xuICAgIGJsdWVHcmV5LFxuICAgIGluZGlnbyxcbiAgICBncmVlbixcbiAgICBkZWVwT3JhbmdlLFxuICAgIGJyb3duLFxuICAgIGFtYmVyLFxuICAgIG9yYW5nZSxcbiAgICBibHVlLFxuICAgIGxpZ2h0R3JlZW5cbn0gZnJvbSBcIkBtYXRlcmlhbC11aS9jb3JlL2NvbG9yc1wiO1xuXG5jb25zdCBNZXRlcnMgPSB7XG4gICAgZXVpOiB7XG4gICAgICAgIHR5cGU6IFwiZXVpXCIsXG4gICAgICAgIG5hbWU6IFwiRVVJXCIsXG4gICAgICAgIGljb246IFwiYWNjb3VudF9iYWxhbmNlXCIsXG4gICAgICAgIGNvbG9yOiBibHVlR3JleSxcbiAgICAgICAgdW5pdHM6IFwia0J0dS9mdMKyXCIsXG4gICAgICAgIGludGVuc2l0eVVuaXRzOiBcImtCdHUvZnTCslwiLFxuICAgICAgICBsYXJnZVVuaXRzOiBcImtCdHUvZnTCslwiLFxuICAgICAgICBkZW1hbmRVbml0czogXCJrQnR1L2Z0wrIvaHJcIixcbiAgICAgICAgbGFyZ2VEZW1hbmRVbml0czogXCJrQnR1L2Z0wrIvaHJcIlxuICAgIH0sXG4gICAgZW5lcmd5OiB7XG4gICAgICAgIHR5cGU6IFwiZW5lcmd5XCIsXG4gICAgICAgIG5hbWU6IFwiVG90YWwgRW5lcmd5XCIsXG4gICAgICAgIGljb246IFwiYWNjb3VudF9iYWxhbmNlXCIsXG4gICAgICAgIGNvbG9yOiBibHVlR3JleSxcbiAgICAgICAgdW5pdHM6IFwia0J0dVwiLFxuICAgICAgICBpbnRlbnNpdHlVbml0czogXCJrQnR1L2Z0wrJcIixcbiAgICAgICAgbGFyZ2VVbml0czogXCJNQnR1XCIsXG4gICAgICAgIGRlbWFuZFVuaXRzOiBcImtCdHUvaHJcIixcbiAgICAgICAgbGFyZ2VEZW1hbmRVbml0czogXCJNQnR1L2hyXCJcbiAgICB9LFxuICAgIGVsZWN0cmljaXR5OiB7XG4gICAgICAgIHR5cGU6IFwiZWxlY3RyaWNpdHlcIixcbiAgICAgICAgbmFtZTogXCJFbGVjdHJpY2l0eVwiLFxuICAgICAgICBpY29uOiBcInBvd2VyXCIsXG4gICAgICAgIGNvbG9yOiBncmVlbixcbiAgICAgICAgdW5pdHM6IFwia1doXCIsXG4gICAgICAgIGludGVuc2l0eVVuaXRzOiBcImtXaC9mdMKyXCIsXG4gICAgICAgIGxhcmdlVW5pdHM6IFwiTVdoXCIsXG4gICAgICAgIGRlbWFuZFVuaXRzOiBcImtXXCIsXG4gICAgICAgIGxhcmdlRGVtYW5kVW5pdHM6IFwiTVdcIlxuICAgIH0sXG4gICAgc3RlYW06IHtcbiAgICAgICAgdHlwZTogXCJzdGVhbVwiLFxuICAgICAgICBuYW1lOiBcIlN0ZWFtXCIsXG4gICAgICAgIGljb246IFwid2hhdHNob3RcIixcbiAgICAgICAgY29sb3I6IGRlZXBPcmFuZ2UsXG4gICAgICAgIHVuaXRzOiBcImxic1wiLFxuICAgICAgICBpbnRlbnNpdHlVbml0czogXCJsYnMvZnTCslwiLFxuICAgICAgICBsYXJnZVVuaXRzOiBcIjEsMDAwIGxic1wiLFxuICAgICAgICBkZW1hbmRVbml0czogXCJsYnMvaHJcIixcbiAgICAgICAgbGFyZ2VEZW1hbmRVbml0czogXCIxLDAwMCBsYnMvaHJcIlxuICAgIH0sXG4gICAgbmc6IHtcbiAgICAgICAgdHlwZTogXCJuZ1wiLFxuICAgICAgICBuYW1lOiBcIk5hdHVyYWwgR2FzXCIsXG4gICAgICAgIGljb246IFwiZ3JhaW5cIixcbiAgICAgICAgY29sb3I6IG9yYW5nZSxcbiAgICAgICAgdW5pdHM6IFwiVGhlcm1zXCIsXG4gICAgICAgIGludGVuc2l0eVVuaXRzOiBcIlRoZXJtcy9mdMKyXCIsXG4gICAgICAgIGxhcmdlVW5pdHM6IFwiMSwwMDAgVGhlcm1zXCIsXG4gICAgICAgIGRlbWFuZFVuaXRzOiBcIlRoZXJtcy9oclwiLFxuICAgICAgICBsYXJnZURlbWFuZFVuaXRzOiBcIjEsMDAwIFRoZXJtcy9oclwiXG4gICAgfSxcbiAgICBjaHc6IHtcbiAgICAgICAgdHlwZTogXCJjaHdcIixcbiAgICAgICAgbmFtZTogXCJDaGlsbGVkIFdhdGVyXCIsXG4gICAgICAgIGljb246IFwiYWNfdW5pdFwiLFxuICAgICAgICBjb2xvcjogaW5kaWdvLFxuICAgICAgICB1bml0czogXCJUb25IcnNcIixcbiAgICAgICAgaW50ZW5zaXR5VW5pdHM6IFwiVG9uSHJzL2Z0wrJcIixcbiAgICAgICAgbGFyZ2VVbml0czogXCIxLDAwMCBUb25IcnNcIixcbiAgICAgICAgZGVtYW5kVW5pdHM6IFwiVG9uc1wiLFxuICAgICAgICBsYXJnZURlbWFuZFVuaXRzOiBcIjEsMDAwIFRvbnNcIlxuICAgIH0sXG4gICAgaHc6IHtcbiAgICAgICAgdHlwZTogXCJod1wiLFxuICAgICAgICBuYW1lOiBcIkhvdCBXYXRlclwiLFxuICAgICAgICBpY29uOiBcImludmVydF9jb2xvcnNcIixcbiAgICAgICAgY29sb3I6IGFtYmVyLFxuICAgICAgICB1bml0czogXCJrQnR1XCIsXG4gICAgICAgIGludGVuc2l0eVVuaXRzOiBcImtCdHUvZnTCslwiLFxuICAgICAgICBsYXJnZVVuaXRzOiBcIk1idHVcIixcbiAgICAgICAgZGVtYW5kVW5pdHM6IFwiS0J0dS9oclwiLFxuICAgICAgICBsYXJnZURlbWFuZFVuaXRzOiBcIk1CdHUvaHJcIlxuICAgIH0sXG4gICAgd2F0ZXI6IHtcbiAgICAgICAgdHlwZTogXCJ3YXRlclwiLFxuICAgICAgICBuYW1lOiBcIldhdGVyXCIsXG4gICAgICAgIGljb246IFwib3BhY2l0eVwiLFxuICAgICAgICBjb2xvcjogYmx1ZSxcbiAgICAgICAgdW5pdHM6IFwiZ2Fsc1wiLFxuICAgICAgICBpbnRlbnNpdHlVbml0czogXCJnYWxzL2Z0wrJcIixcbiAgICAgICAgbGFyZ2VVbml0czogXCIxLDAwMCBnYWxzXCIsXG4gICAgICAgIGRlbWFuZFVuaXRzOiBcImdhbHMvaHJcIixcbiAgICAgICAgbGFyZ2VEZW1hbmRVbml0czogXCIxLDAwMCBnYWxzL2hyXCJcbiAgICB9LFxuICAgIGNvc3Q6IHtcbiAgICAgICAgdHlwZTogXCJjb3N0XCIsXG4gICAgICAgIG5hbWU6IFwiQ29zdFwiLFxuICAgICAgICBpY29uOiBcImF0dGFjaF9tb25leVwiLFxuICAgICAgICBjb2xvcjogbGlnaHRHcmVlbixcbiAgICAgICAgdW5pdHM6IFwiJFwiLFxuICAgICAgICBpbnRlbnNpdHlVbml0czogXCIkL2Z0wrJcIixcbiAgICAgICAgbGFyZ2VVbml0czogXCIkMSwwMDBcIixcbiAgICAgICAgZGVtYW5kVW5pdHM6IFwiJC9oclwiLFxuICAgICAgICBsYXJnZURlbWFuZFVuaXRzOiBcIjEsMDAwICQvaHJcIlxuICAgIH0sXG4gICAgZW1pc3Npb25zOiB7XG4gICAgICAgIHR5cGU6IFwiZW1pc3Npb25zXCIsXG4gICAgICAgIG5hbWU6IFwiQ08yZSBFbWlzc2lvbnNcIixcbiAgICAgICAgaWNvbjogXCJjbG91ZFwiLFxuICAgICAgICBjb2xvcjogYnJvd24sXG4gICAgICAgIHVuaXRzOiBcImxicyBDTzJlXCIsXG4gICAgICAgIGludGVuc2l0eVVuaXRzOiBcImxicyBDTzJlL2Z0wrJcIixcbiAgICAgICAgbGFyZ2VVbml0czogXCIxLDAwMCBsYnMgQ08yZVwiLFxuICAgICAgICBkZW1hbmRVbml0czogXCJDTzJlL2hyXCIsXG4gICAgICAgIGxhcmdlRGVtYW5kVW5pdHM6IFwiMSwwMDAgQ08yZS9oclwiXG4gICAgfVxufTtcblxuY29uc3QgbWV0ZXJPcmRlciA9IFtcbiAgICBcImV1aVwiLFxuICAgIFwiZW5lcmd5XCIsXG4gICAgXCJlbWlzc2lvbnNcIixcbiAgICBcImNvc3RcIixcbiAgICBcImVsZWN0cmljaXR5XCIsXG4gICAgXCJzdGVhbVwiLFxuICAgIFwibmdcIixcbiAgICBcImNod1wiLFxuICAgIFwiaHdcIixcbiAgICBcIndhdGVyXCJcbl07XG5jb25zdCBzaW1wbGVNZXRlciA9IG0gPT4gKHtcbiAgICBfaWQ6IG0uX2lkLFxuICAgIHR5cGU6IG0udHlwZSxcbiAgICBpc1N1Yk1ldGVyOiBtLmlzU3ViTWV0ZXIsXG4gICAgaXNWaXJ0dWFsTWV0ZXI6IG0uaXNWaXJ0dWFsTWV0ZXIsXG4gICAgbmFtZTogbS5uYW1lLFxuICAgIHVuaXRzOiBtLnVuaXRzXG59KTtcbmNvbnN0IHNvcnRNZXRlcnMgPSAoYSwgYikgPT5cbiAgICBtZXRlck9yZGVyLmluZGV4T2YoYSkgPCBtZXRlck9yZGVyLmluZGV4T2YoYikgPyAtMSA6IDE7XG5jb25zdCBnZXRBdmFpbGFibGVNZXRlcnMgPSAoYnVpbGRpbmdzID0gW10sIHRvdGFsLCBlbWlzc2lvbnMsIGNvc3QpID0+IHtcbiAgICBsZXQgbWV0ZXJzID0gW1xuICAgICAgICAuLi5uZXcgU2V0KFxuICAgICAgICAgICAgYnVpbGRpbmdzXG4gICAgICAgICAgICAgICAgLm1hcChiID0+IE9iamVjdC5rZXlzKChiLmRhdGEgfHwge30pLmFjdHVhbCB8fCB7fSkpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKVxuICAgICAgICApXG4gICAgXS5zb3J0KHNvcnRNZXRlcnMpO1xuICAgIGlmIChlbWlzc2lvbnMpIG1ldGVycy51bnNoaWZ0KFwiZW1pc3Npb25zXCIpO1xuICAgIGlmIChjb3N0KSBtZXRlcnMudW5zaGlmdChcImNvc3RcIik7XG4gICAgaWYgKHRvdGFsKSBtZXRlcnMudW5zaGlmdChcImVuZXJneVwiKTtcbiAgICByZXR1cm4gbWV0ZXJzO1xufTtcblxuZXhwb3J0IHsgTWV0ZXJzLCBtZXRlck9yZGVyLCBzb3J0TWV0ZXJzLCBnZXRBdmFpbGFibGVNZXRlcnMsIHNpbXBsZU1ldGVyIH07XG4iLCJpbXBvcnQgKiBhcyB1dGlsaXRpZXMgZnJvbSBcIi4vdXRpbGl0aWVzLmpzXCI7XG5pbXBvcnQgKiBhcyBtZXRlcnMgZnJvbSBcIi4vbWV0ZXJzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IE9iamVjdC5hc3NpZ24oe30sIHV0aWxpdGllcywgbWV0ZXJzKTtcbiJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZ3JvdXBCeSIsImNvbnZlcnNpb25GYWN0b3JzIiwiZWxlY3RyaWNpdHkiLCJlbmVyZ3kiLCJjb3N0IiwiZW1pc3Npb25zIiwic3RlYW0iLCJodyIsIndhdGVyIiwiY2h3IiwibmciLCJjb252ZXJ0IiwidmFsdWUiLCJtZXRlclR5cGUiLCJ0byIsInVuaXRzIiwib2lsIiwiY2FwRmlyc3QiLCJzdHJpbmciLCJyZXBsYWNlIiwidHh0IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VBbGwiLCJzZWFyY2giLCJyZXBsYWNlbWVudCIsIlJlZ0V4cCIsInN0cmluZ2lmeUlEIiwiaWQiLCJTdHJpbmciLCJmb3JtYXROdW1iZXIiLCJpc05hTiIsIm51bWJlciIsInBhcnNlSW50IiwiTWF0aCIsInJvdW5kIiwidG9Mb2NhbGVTdHJpbmciLCJmb3JtYXRGbG9hdCIsInBhcnNlRmxvYXQiLCJmb3JtYXRQZXJjZW50IiwidG9VUkxRdWVyeSIsImNvbmNhdCIsIk9iamVjdCIsImtleXMiLCJvYmoiLCJtYXAiLCJrIiwiam9pbiIsInBhcnNlUXVlcnlQYXJhbXMiLCJNYXAiLCJxdWVyeSIsInNwbGl0IiwicyIsImNhbGNTY2FsZSIsInZhbHVlcyIsImZpbHRlciIsInYiLCJsZW5ndGgiLCJsb3ciLCJoaWdoIiwibWF4IiwicXVhbnRpbGUiLCJjaG9vc2VJY29uIiwiYmFzZW5hbWUiLCJpY29uIiwidGltZXNlcmllc1RvWFkiLCJkYXRhIiwic2NhbGUiLCJ4IiwiRGF0ZSIsInkiLCJjYWxjUHJvZ3Jlc3MiLCJiYXNlbGluZSIsIm5vcm1hbGl6ZSIsIm1pbiIsIm5vcm1hbGl6ZUJhY2siLCJldWlUaW1lU2NhbGVyIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsInZhbHVlT2YiLCJtc3llYXIiLCJ2YWxpZEVtYWlsIiwibnIiLCJCb29sZWFuIiwibWF0Y2giLCJjYWxjQ1ZSTVNFIiwiYWN0dWFsIiwic2ltdWxhdGVkIiwiZGlmZkFycmF5IiwiYWN0dWFsVmFsdWVzIiwiaSIsInB1c2giLCJwb3ciLCJuIiwicCIsInliYXIiLCJzdW0iLCJjdnJtc2UiLCJzcXJ0IiwiY2FsY05NQkUiLCJubWJlIiwiZGF0YVN0YXRpc3RpY3MiLCJmaWx0ZXJaZXJvIiwic29ydCIsImlxIiwiaW50ZXJxdWFydGlsZVJhbmdlIiwicTEiLCJxMyIsImxvd2VySW5uZXJGZW5jZSIsImxvd2VyT3V0ZXJGZW5jZSIsInVwcGVySW5uZXJGZW5jZSIsInVwcGVyT3V0ZXJGZW5jZSIsIm1lYW4iLCJtb2RlIiwibW9kZVNvcnRlZCIsIm1lZGlhbiIsIm1lZGlhblNvcnRlZCIsIm1lZGlhbkFic29sdXRlRGV2aWF0aW9uIiwidW5pcXVlQ291bnRTb3J0ZWQiLCJzdGFuZGFyZERldmlhdGlvbiIsInZhcmlhbmNlIiwiYm94UGxvdCIsIkVycm9yIiwibWluVmFsIiwibWF4VmFsIiwiaW50ZXJ2YWxTdGFydCIsImRhdGUiLCJpbnRlcnZhbCIsInQiLCJzdGFydE9mRGF5Iiwic3RhcnRPZk1vbnRoIiwic3RhcnRPZlllYXIiLCJkYXRlUmFuZ2UiLCJzdGVwIiwicGFyc2UiLCJyYW5nZSIsImQiLCJhZGRNaW51dGVzIiwiYWRkSG91cnMiLCJhZGREYXlzIiwiYWRkTW9udGhzIiwiYWRkWWVhcnMiLCJtaW5UaW1lc2VyaWVzIiwidHMiLCJtYXhUaW1lc2VyaWVzIiwibWF4VGltZXNlcmllc1dpdGhEYXRlIiwiYSIsImIiLCJjYXJkaW5hbGl0eVRpbWVzZXJpZXMiLCJTZXQiLCJzaXplIiwiZ2V0Rmlyc3RUaW1lc3RhbXAiLCJnZXRMYXN0VGltZXN0YW1wIiwicmVkdWNlVGltZXNlcmllcyIsImFycmF5cyIsInJlZHVjZSIsImhhcyIsInNldCIsImdldCIsImNsZWFuVGltZXNlcmllcyIsInVuY2xlYW5UaW1lc2VyaWVzIiwiciIsImludGVycG9sYXRlVGltZXNlcmllcyIsImFycmF5IiwiaW5kZXgiLCJwcmV2SW5kZXgiLCJwcmV2Iiwic2xpY2UiLCJyZXZlcnNlIiwibmV4dCIsImNsZWFuVGltZXNlcmllc0ludGVycG9sYXRlIiwiYXZnIiwiZmlsdGVyVGltZXNlcmllcyIsInZhbHVlc1RpbWVzZXJpZXMiLCJwcmVBbGxvY2F0ZVRpbWVzZXJpZXNNaW51dGVzIiwibyIsImgiLCJtIiwiVGltZXNlcmllc0FycmF5VG9PYmplY3QiLCJkYXlzIiwiZ3JvdXBUaW1lc2VyaWVzIiwiZGF5IiwiaHIiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJUaW1lc2VyaWVzT2JqZWN0VG9BcnJheSIsInRpbWVzdGFtcCIsInNldEhvdXJzIiwic2V0TWludXRlcyIsInNldFNlY29uZHMiLCJncm91cFRpbWVzZXJpZXNEYXkiLCJlbnRyaWVzIiwidGltZXNlcmllcyIsIk51bWJlciIsImdyb3VwIiwiYWdncmVnYXRlVGltZVNlcmllcyIsInJlZCIsInRvdGFsVGltZXNlcmllcyIsImF2ZXJhZ2VUaW1lc2VyaWVzIiwibW9udGhseVZhbHVlV2l0aFRyZW5kIiwibW9udGgiLCJkbSIsInRyZW5kIiwidGV4dCIsImJhc2VsaW5lVmFsdWUiLCJmb3JtYXQiLCJpc1RpbWVzZXJpZXNVbmlmb3JtIiwibWFrZURhaWx5VGltZXNlcmllcyIsImVuZE9mRGF5IiwiYXJyIiwiZmluZE1pc3NpbmdEYXlzIiwiZnVsbFRzIiwiZGF0YURhdGVzIiwibWlzc2luZyIsImNhbGNNZXRlclRvdGFsIiwidHlwZSIsImxpbWl0IiwidG90YWwiLCJpbmRleE9mIiwiaGFzT3duUHJvcGVydHkiLCJjYWxjRVVJIiwiYXJlYSIsInRvdGFsRW5lcmd5IiwiY2FsY0ludGVuc2l0eSIsImJ0dSIsIkVVSUJ5VHlwZSIsInllYXJzIiwiQXJyYXkiLCJkaWZmZXJlbmNlSW5ZZWFycyIsImZpbGwiLCJnZXRGdWxsWWVhciIsImVuZE9mWWVhciIsImJ5VHlwZSIsInNkIiwieWVhciIsImVkIiwic3ViTW9udGhzIiwidGltZVNjYWxlciIsImdldFllYXIiLCJFVUlCeVllYXIiLCJiYXNlbGluZVllYXIiLCJ0eXBlcyIsInN0YXJ0IiwiZW5kIiwicHJvZ3Jlc3MiLCJjYWxjQnVpbGRpbmdFVUkiLCJldWkiLCJ5ZWFyU3RhcnQiLCJzdWJZZWFycyIsInllYXJFbmQiLCJtb250aFN0YXJ0IiwibW9udGhFbmQiLCJlbmRPZk1vbnRoIiwiTWV0ZXJzIiwibmFtZSIsImNvbG9yIiwiYmx1ZUdyZXkiLCJpbnRlbnNpdHlVbml0cyIsImxhcmdlVW5pdHMiLCJkZW1hbmRVbml0cyIsImxhcmdlRGVtYW5kVW5pdHMiLCJncmVlbiIsImRlZXBPcmFuZ2UiLCJvcmFuZ2UiLCJpbmRpZ28iLCJhbWJlciIsImJsdWUiLCJsaWdodEdyZWVuIiwiYnJvd24iLCJtZXRlck9yZGVyIiwic2ltcGxlTWV0ZXIiLCJfaWQiLCJpc1N1Yk1ldGVyIiwiaXNWaXJ0dWFsTWV0ZXIiLCJzb3J0TWV0ZXJzIiwiZ2V0QXZhaWxhYmxlTWV0ZXJzIiwiYnVpbGRpbmdzIiwibWV0ZXJzIiwidW5zaGlmdCIsImFzc2lnbiIsInV0aWxpdGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQXNDb0JBLFFBQVEsUUFBUjtNQUFaQyxtQkFBQUE7RUFDUjs7O0VBQ0EsSUFBTUMsb0JBQW9CO0VBQ3hCQyxlQUFhO0VBQ1hDLFlBQVEsWUFERztFQUVYQyxVQUFNLEtBRks7RUFHWEMsZUFBVyxJQUhBO0VBQUEsR0FEVztFQU14QkMsU0FBTztFQUNMSCxZQUFRLElBREg7RUFFTEMsVUFBTSxNQUZEO0VBR0xDLGVBQVcsTUFITjtFQUFBLEdBTmlCO0VBV3hCRSxNQUFJO0VBQ0ZKLFlBQVEsQ0FETjtFQUVGQyxVQUFNLENBRko7RUFHRkMsZUFBVyxDQUhUO0VBQUEsR0FYb0I7RUFnQnhCRyxTQUFPO0VBQ0xMLFlBQVEsQ0FESDtFQUVMQyxVQUFNLEtBRkQ7RUFHTEMsZUFBVyxDQUhOO0VBQUEsR0FoQmlCO0VBcUJ4QkksT0FBSztFQUNITixZQUFRLEVBREw7RUFFSEMsVUFBTSxLQUZIO0VBR0hDLGVBQVcsQ0FIUjtFQUFBLEdBckJtQjtFQTBCeEJLLE1BQUk7RUFDRlAsWUFBUSxPQUROO0VBRUZDLFVBQU0sQ0FGSjtFQUdGQyxlQUFXLElBSFQ7RUFBQTtFQTFCb0IsQ0FBMUI7RUFnQ0EsSUFBTU0sVUFBVSxTQUFWQSxPQUFVLENBQUNDLEtBQUQsRUFBUUMsU0FBUixFQUFtQkMsRUFBbkIsRUFBMEI7RUFDeEMsU0FBT0YsUUFBUVgsa0JBQWtCWSxTQUFsQixFQUE2QkMsRUFBN0IsQ0FBZjtFQUNELENBRkQ7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
