<script>
  export let decision;

  const handler = function(event) {
    debugger;
    decision(true);
  };
</script>

<style>
  button {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

<button on:click={handler}>Menu</button>
