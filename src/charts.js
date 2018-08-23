const timeseriesToXY = (data, scale = 1) =>
	data.map(v => ({
		x: new Date(v[0]),
		y: v[1] / scale
	}));
module.exports = {timeseriesToXY}
