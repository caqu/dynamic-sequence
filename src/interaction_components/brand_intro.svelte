<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let callback;
  export let props;

  let showing = false;
  onMount(() => (showing = true));
  setTimeout(() => {
    callback(true);
  }, 3000);
</script>

<style>
  h1 {
    font-size: 24vw;
    overflow: hidden;
    margin: 0;
    padding: 0;
    position: absolute;
    
  }
</style>

{#if showing}
  <h1 in:fade out:fade>BRAND</h1>
{/if}
