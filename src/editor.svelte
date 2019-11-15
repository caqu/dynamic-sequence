<script>
  import { writable, readable } from "svelte/store";

  import ResultsVisualizer from "./lib/results_visualizer.svelte";
  import RulesVisualizer from "./lib/rules_visualizer.svelte";
  import ProgramVisualizer from "./lib/program_visualizer.svelte";
  export let readables;
  export let writables;
  let { debugging, rule_set } = writables;
  let { state, main_sequence, go_to, activity_index } = readables;
</script>

<style>
  .container {
    display: flex;
    position: relative;
  }
</style>

{#if $debugging}
  <div class="container">
    <ResultsVisualizer {state} />
    <RulesVisualizer {rule_set} />
    <ProgramVisualizer {main_sequence} {go_to} index={activity_index} />
  </div>
{/if}
