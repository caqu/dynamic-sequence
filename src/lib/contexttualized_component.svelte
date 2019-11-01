<script>
  import { setContext } from "svelte";

  export let index;
  export let name;
  export let ComponentRef;
</script>

<!-- 
  This is a higher-order component to set context
  so the configured component don't need to know about their place in line.
 -->
{#if ComponentRef}
  <svelte:component this={ComponentRef} />
{/if}
