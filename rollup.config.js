import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import component_list from "./src/component_list";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

let next_live_reload_port = 35729;
let output_list = Object.keys(component_list).map(name => {
  const file_name = component_list[name];
  // input_path: "src/interaction_components/" + file_name + ".svelte"
  // input_path: "src/interaction_components/" + file_name + ".js"
  return {
    // input: "src/main.js",
    input: "src/interaction_components/" + file_name + ".svelte",
    output: {
      // sourcemap: true,
      file: pkg.module,
      format: "es",
      name: file_name,
      file: "public/bundles/" + file_name + ".js"
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
      // commonjs(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production &&
        livereload({
          watch: "public",
          port: next_live_reload_port++
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  };
});

// Main App
output_list.push({
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundles/app.js"
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
    !production &&
      livereload({
        watch: "public",
        port: next_live_reload_port++
      }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
});

export default output_list;
