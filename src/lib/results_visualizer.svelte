<script>
  import syntax_highlight_json from "./syntax_highlight_json";
  import { slide } from "svelte/transition";
  export let state;
</script>

<style>
  .results_visualizer {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 1rem 0 0 0;
    padding: 0.25rem 0.25rem 0;
    font-size: 10px;
    margin: 0;
  }
</style>

<pre class="results_visualizer">
  {@html syntax_highlight_json($state)}
</pre>
