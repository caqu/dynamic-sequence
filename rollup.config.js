import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import component_list from './src/component_list';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

let next_live_reload_port = 35729;

// Each Activity (Svelte file) will be transpiled into its own JS file.
let output_list = Object.keys(component_list).map(name => {
  const file_name = component_list[name];
  return {
    input: 'src/activities/' + file_name + '.svelte',
    output: {
      format: 'es',
      name: file_name,
      file: 'public/bundles/' + file_name + '.js'
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,

        // You can restrict which files are compiled
        // using `include` and `exclude`
        // include: 'src/components/**/*.svelte',

        // load this as a Web Component, like <my-input />
        // customElement: true

        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: function(css) {
          css.write('public/bundles/' + file_name + '.css');
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
          importee === 'svelte' || importee.startsWith('svelte/')
      }),
      // commonjs(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      // if (!production) {
      //   livereload({
      //     watch: 'public',
      //     port: next_live_reload_port++
      //   }), }

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  };
});

// Config for Main Application that loads first and then controls the flow of Activities
output_list.push({
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundles/main.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/bundle.css');
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
        importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production &&
      livereload({
        watch: 'public',
        port: next_live_reload_port
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
