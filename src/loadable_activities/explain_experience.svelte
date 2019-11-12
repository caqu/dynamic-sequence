<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let callback;
  export let props;

  function handleClick() {
    callback(true);
  }
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
    <!-- This system tries to optimize for continous partial attention.  -->
    This shopping workflow uses a dynamic control flow program to step through a
    series of interactions. Before each interaction, it runs the customer's
    inputs through a set of rules in order to update the upcoming sequence of
    prompts. The goal is to maximize the customer's focus, minimize unnecessary
    interactions and increase the speed needed to complete a given task.
    <!--
    On the bottom left you can see the application state, in essence, the
    results of previous interactions between brand and customer. On the bottom
    left you can preview what's coming up in the sequence. The sequence will
    mutate depending on the state. For example, a donation does not require a
    shipping address, and a t-shirt requires an extra step to select color and
    size.
    -->
  </p>
  <button on:click={handleClick}>Continue</button>
</div>
