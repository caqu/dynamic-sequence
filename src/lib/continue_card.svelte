<script>
  export let handleClick = function handleClick() {
    decision(true);
  };
</script>

<style>
  div {
    background: white;
    padding: 0.75rem 1rem 0.5rem;
    border-radius: 0.5rem;
  }
</style>

<div>
  <slot />
  <button on:click={handleClick}>Continue</button>
</div>
