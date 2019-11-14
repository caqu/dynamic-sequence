<script>
  import ResultsVisualizer from "./lib/results_visualizer.svelte";
  import RulesVisualizer from "./lib/rules_visualizer.svelte";
  import ProgramVisualizer from "./lib/program_visualizer.svelte";
  export let props;
  let { debugging, state, rule_set, main_sequence, go_to } = props;
</script>

{#if debugging}
  <ResultsVisualizer {state} />
  <RulesVisualizer {rule_set} />
  <ProgramVisualizer {main_sequence} {go_to} />
{/if}
