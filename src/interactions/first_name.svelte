<script>
  import { slide } from "svelte/transition";

  export let props;
  export let callback = () => console.log("please define me parent");

  let falsy_name_error = false;

  function handle_submit(event) {
    event.preventDefault();
    this.elements.first_name.value;
    if (this.elements.first_name.value) {
      first_name_reducer(this.elements.first_name.value);
      callback(true);
    } else {
      falsy_name_error = true;
    }
  }
  function first_name_reducer(first_name) {
    props.update(p => ({ ...$props, first_name: first_name }));
  }
</script>

<form on:submit={handle_submit}>
  {#if falsy_name_error}
    <div in:slide>Your name can't be falsy.</div>
  {/if}
  <div>What is your first name?</div>
  <input name="first_name" value="" />
</form>
