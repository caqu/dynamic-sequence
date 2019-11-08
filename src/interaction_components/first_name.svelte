<script>
  import { slide } from "svelte/transition";
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback = function() {
    console.log("please define me parent");
  };

  let falsy_name_error = false;

  function handler(event) {
    setTimeout(function() {
      last_name_reducer(event.target.elements.last_name.value);
      callback(true);
    }, 300);
    // TODO Can we re-write it with `this`?
    this.elements.first_name.value;
    if (this.elements.first_name.value) {
      first_name_reducer(this.elements.first_name.value);
      callback(true);
    } else {
      falsy_name_error = true;
    }
  }
  function first_name_reducer(first_name) {
    props.update(function(p) {
      return { ...$props, first_name: first_name };
    });
  }
</script>

<Interaction {handler}>
  {#if falsy_name_error}
    <div in:slide>Your name can't be falsy.</div>
  {/if}
  <div>What is your first name?</div>
  <input name="first_name" value="" />
</Interaction>
