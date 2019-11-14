<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  console.log("Brand intro in the house!!");

  export let decision = function() {};
  export let props;

  let showing = false;
  onMount(function() {
    showing = true;
  });
  const clearer = setTimeout(function() {
    decision(true);
  }, 1000);
  onDestroy(function() {
    clearTimeout(clearer);
  });
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
