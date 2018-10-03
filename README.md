# dashboard-utilities

functional utilities for dashboard

Rollup Help:

-   https://medium.com/@kelin2025/so-you-wanna-use-es6-modules-714f48b3a953
-   https://devhints.io/rollup
-   https://code.lengstorf.com/learn-rollup-js/

Energy and CO2e dat from

-   https://portfoliomanager.energystar.gov/pdf/reference/Thermal%20Conversions.pdf
-   https://www.eia.gov/environment/emissions/co2_vol_mass.php-

```javascript
let sortTS = (a, b) => {
	return a[0] - b[0];
};
const monthlyTimeseriesLabels = t => {
	if (getMonth(t) === 0) {
		return format(t, "MMM YYYY");
	}
	return getMonth(t) % 2 === 0 ? format(t, "MMMM") : "";
};
const hourlyTimeseriesLabels = t => {
	return format(t, "MM/DD hh:mm a");
};

// src https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

// function componentToHex(c) {
// 	var hex = c.toString(16);
// 	return hex.length ===1 ? "0" + hex : hex;
// }

// function rgbToHex(r, g, b) {
// 	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
// }

function hexToRgba(hex, opacity = 1) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? `rgba(${parseInt(result[1], 16)}, ${parseInt(
				result[2],
				16
		  )}, ${parseInt(result[3], 16)}, ${opacity})`
		: null;
}
```
