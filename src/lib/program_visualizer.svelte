<script>
  import { slide } from "svelte/transition";
  import { derived } from "svelte/store";

  export let main_sequence;
  export let index;
  export let go_to;

  // const sequence = derived([$main_sequence, $index], function(
  //   $main_sequence,
  //   $index
  // ) {
  //   if ($main_sequence === undefined) {
  //     return undefined;
  //   }
  //   return $main_sequence.map(function(item, _index) {
  //     return item;
  //     // { active: _index === $index, name: item };
  //   });
  // });
</script>

<style>
  .program_visualizer {
    min-width: 25vw;
    max-width: 50vw;
    padding: 0.25rem 0 0 0.25rem;
    font-size: 10px;
    overflow: auto;
  }
  .program_visualizer div {
    padding: 0 0.25rem;
  }
  .program_visualizer ol {
    padding: 0 0.25rem 0 1rem;
  }
  .active {
    font-weight: bold;
  }
</style>

<div class="program_visualizer">
  <div>Control flow</div>
  <ol style="margin:0" start="0">
    {#each $main_sequence as activity, i}
      <li in:slide class={i == $index ? 'active' : ''}>
        <!-- <u on:click={go_to}>{activity}</u> -->
        <span>{activity}</span>
      </li>
    {/each}
  </ol>
</div>
