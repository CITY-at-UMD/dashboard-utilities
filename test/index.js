const _ = require("lodash");
const sumts = ts => Object.values(ts).reduce((a, b) => a + b);
var ts_1 = new Array(96)
	.fill(0)
	.map((v, i) => [
		new Date(2018, 4, 4, 0, i * 15),
		Math.random() * 1000 + 500
	])
	.reduce((a, b) => Object.assign(a, { [b[0].valueOf()]: b[1] }), {});
var ts_2 = new Array(96)
	.fill(0)
	.map((v, i) => [
		new Date(2018, 4, 4, 0, i * 15),
		Math.random() * 1000 + 500
	])
	.reduce((a, b) => Object.assign(a, { [b[0].valueOf()]: b[1] }), {});
var ts_3 = Object.assign({}, ts_1);

console.log(sumts(ts_1));
let pts_deleted = [15, 16, 17, 64];
pts_deleted.forEach((pt, i) => {
	let v = ts_1[Object.keys(ts_1)[i]];
	delete ts_1[Object.keys(ts_1)[15]];
	pts_deleted[i] = v;
});
let pts_deletedTotal = pts_deleted.reduce((a, b) => a + b);
console.log("1", sumts(ts_1));
console.log("3", sumts(ts_3));
console.log("1_removed", pts_deletedTotal);
let m = _.merge(ts_1, ts_3);
let total = sumts(m);
console.log("merge", total);
