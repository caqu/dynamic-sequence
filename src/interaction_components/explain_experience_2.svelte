<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let callback;
  export let props;
</script>

<style>
  div {
    background: white;
    padding: 0.75rem 1rem 0.5rem;
    border-radius: 0.5rem;
  }
  p {
    margin-top: 0;
  }
</style>

<div on:click={() => callback(true)}>
  <p style="max-width:30rem">
    On the bottom left, you can see the results of previous interactions between
    brand and customer, in other words, the application state. On the bottom
    right you can preview what's coming up in the sequence. The sequence will
    be updated depending on the state and the rules. For example, adding a shippable
    item, like a mug, to your cart requires that we collect a shipping address,
    but a donation does not. Adding a t-shirt requires that we add an extra step
    to select color and size.
  </p>
  <button>Continue</button>
</div>
