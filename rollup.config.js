import { uglify } from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

const input = "src/index.js";
const sourcemap = true;

export default {
    entry: "src/index.js",
    dest: "dist/index.js",
    format: "iife",
    sourceMap: "inline",
    name: "utilities",
    plugins: [
        babel({
            exclude: "node_modules/**"
        })
    ]
};
// export default [
//     {
//         input,
//         output: {
//             file: "dist/index.mjs",
//             format: "esm",
//             sourcemap
//         }
//     },
//     {
//         input,
//         output: {
//             file: "dist/index.js",
//             format: "iife",
//             name: "utilities",
//             sourcemap
//         }
//     }
// ];
