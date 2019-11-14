<script>
  import { writable, readable } from "svelte/store";

  import ResultsVisualizer from "./lib/results_visualizer.svelte";
  import RulesVisualizer from "./lib/rules_visualizer.svelte";
  import ProgramVisualizer from "./lib/program_visualizer.svelte";
  export let readables;
  export let writables;
  let { debugging, rule_set } = writables;
  let { state, main_sequence, go_to, activity_index } = readables;
  $: o = JSON.stringify(readables);
</script>

<input type="checkbox" bind:checked={$debugging}
  style="position:absolute;top:0;left:0"
/>

{#if $debugging}
  <ResultsVisualizer {state} />
  <RulesVisualizer {rule_set} />
  <ProgramVisualizer {main_sequence} {go_to} index={activity_index} />
{/if}
