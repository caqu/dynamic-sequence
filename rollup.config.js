import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

let output_list = [];
let fs = require("fs");
fs.readdirSync("src/interaction_components", function(err, items) {
  for (var i = 0; i < items.length; i++) {
    //     if (items[i].endsWith(".svelte")) {
    //       generate_output_config(items[i]);
    console.log(items[i]);
    //       output_list.push(generate_output_config(items[i]));
    //     }
  }
});
output_list.push(generate_output_config("app"));

function generate_output_config(name) {
  return {
    // input: "src/interaction_components/" + name + ".svelte",
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name,
      // file: "public/bundles/" + name + ".js"
      file: "public/bundle.js"
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
          css.write("public/bundle.css");
        }
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:
      // https://github.com/rollup/rollup-plugin-commonjs
      resolve({
        browser: true,
        dedupe: importee =>
          importee === "svelte" || importee.startsWith("svelte/")
      }),
      commonjs(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload("public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  };
}

export default output_list;
