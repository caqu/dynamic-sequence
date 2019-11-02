<script>
  import { fade } from "svelte/transition";
  export let is_showing_feedback = false; // TODO
</script>

<style>
/*
label.error {
  color: red;
}
*/
</style>

{#if is_showing_feedback}
  <div class="feedback" in:fade out:fade>
    <slot />
  </div>
{/if}
