import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";
let dependencies = Object.keys(require("./package.json").dependencies);
export default {
	entry: "src/index.js",
	dest: "dist/main.min.js",
	format: "iife",
	name: "utilities",
	sourceMap: "inline",
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs(),
		babel({
			exclude: "node_modules/**"
		}),
		uglify()
	],
	external: dependencies
};
