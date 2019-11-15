<script>
  export let decision;

  const handler = function(event) {
    debugger;
    decision(true);
  };
</script>

<style>
  button {
    all: unset;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0 0 0 1rem;
    line-height: 1;
  }
</style>

<button on:click={handler}>Menu</button>
