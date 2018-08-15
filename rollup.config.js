import { uglify } from "rollup-plugin-uglify";

const input = "src/index.js";
const sourcemap = true;

export default [
    {
        input,
        output: {
            file: "dist/index.mjs",
            format: "esm",
            sourcemap
        }
    },
    {
        input,
        output: {
            file: "dist/index.js",
            format: "umd",
            name: "utilities",
            sourcemap
        }
    }
];
