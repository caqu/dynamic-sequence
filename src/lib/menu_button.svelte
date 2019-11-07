<script>
  export let callback;

  const handler = event => {
    debugger;
    callback(true);
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
