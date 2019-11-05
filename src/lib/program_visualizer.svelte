<script>
  import { slide } from "svelte/transition";
  export let main_sequence;
  export let go_to;
</script>

<style>
  .program_visualizer {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 1rem 0 0 0;
    padding: 0.25rem 0 0 0.25rem;
    font-size: 10px;
  }
  .program_visualizer div {
    padding: 0 0.25rem;
  }
  .program_visualizer ol {
    padding: 0 0.25rem 0 1rem;
  }
</style>

<div class="program_visualizer">
  <div>Sequence</div>
  <ol style="margin:0">
    {#each $main_sequence as w}
      <li out:slide>
        <u on:click={go_to}>{w}</u>
      </li>
    {/each}
  </ol>
</div>
