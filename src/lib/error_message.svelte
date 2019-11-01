<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { interaction } from "../stores/contexts.js";
  
  export let code;
</script>

<style>
  .error {
    color: red;
  }
</style>

{#if code}
  <div class="error" in:fade out:fade>
    <slot />
  </div>
{/if}