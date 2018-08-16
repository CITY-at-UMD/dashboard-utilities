import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "iife"
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: "node_modules"
      }
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ],
  external: ["lodash", "simple-statistics", "date-fns"]
};
