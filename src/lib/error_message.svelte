<script>
  import { fade } from "svelte/transition";
  
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