const { getAvailalbeMeters, Meters } = require("../src/meter.js");

// console.log(Meters);

console.log(getAvailalbeMeters("steam"));
console.log(getAvailalbeMeters(["electricity", "steam"]));
console.log(
	getAvailalbeMeters([
		["electricity", "steam"],
		["electricity", "steam", "chw"],
		["ng"]
	])
);
