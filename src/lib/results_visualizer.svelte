<script>
  import syntax_highlight_json from "./syntax_highlight_json";
  import { slide } from "svelte/transition";
  export let state;
</script>

<style>
  .results_visualizer {
    min-width: 25vw;
    max-width: 50vw;
    padding: 0.25rem 0.25rem 0;
    font-size: 10px;
    margin: 0;
    overflow: auto;
  }
  .results_visualizer pre {
    margin: 0;
  }
</style>

<div class="results_visualizer">
  <div>App state</div>
  <pre>
    {@html syntax_highlight_json($state)}
  </pre>
</div>
