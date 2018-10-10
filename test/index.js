const fs = require("fs");
const toObject = (a, b) => {
	a[b[0]] = b[1];
	return a;
};

let arr = new Array(128)
	.fill("dOcxXzFS0WqNucT0")
	.map((v, i) => [String(v + i), (i + 1) * 1438493 * Math.random()])
	.reduce(toObject, {});
console.log(arr);
fs.writeFileSync("test.json", JSON.stringify(arr));
