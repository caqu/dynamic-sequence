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

<div>
  <p style="max-width:30rem">
    <!-- Human attention is precious. -->
    <!-- and systems have to optimize for continous
        partial attention.  -->
    <!-- TODO move this to its own opening slide -->
    This shopping workflow uses a dynamic sequencing program to control the flow
    of interactions. It runs customer inputs through a set of rules in order to
    reduce the number of future prompts to the minimum necessary. The goal is to
    maximize the customer's focus and speed to complete the task. On the bottom
    left you can see the application state, in essence, the results of previous
    interactions between brand and customer. On the bottom left you can preview
    what's coming up in the sequence. The sequence will mutate depending on the
    state.
    <!-- TODO Click anywhere to continue.  -->
    For example, a donation does not require a shipping address, and a t-shirt
    requires an extra step to select color and size.
  </p>
  <button on:click={() => callback(true)}>Continue</button>
</div>
