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

module.exports = {
	capFirst,
	replaceAll,
	stringifyID,
	formatNumber,
	formatFloat,
	formatPercent,
	toURLQuery,
	parseQueryParams
};
