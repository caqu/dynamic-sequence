<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let decision;
  export let props;

  // mode is developer or customer
  function cont(mode) {
    props.update(function(props) {
      return {
        ...props,
        explainer_mode: mode
      };
    });
    if (mode == 'developer') {
      const new_rule = {
        predicate: function(state) {
          return state.explainer_mode === mode;
        },
        consequence: function(main_sequence) {
          const activity = "Explain rule set";
          main_sequence.update(function(ms) {
            if (ms.includes(activity)) {
              return ms;
            } else {
              return [...ms, activity];
            }
          });
        }
      };
      decision([new_rule]);
    } else if (mode == 'customer'){
      decision(true);
    }
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
    Human attention is precious.
    <!--  -->
    This experimental shopping workflow guides you through a series of simple
    activities that arrange themselves based on your prior inputs.
    <!--  -->
    Each
    <b>activity</b>
    requires that you do a minimum unit of work. An activity takes your input/s,
    modifies the state of the application, then hands a decision back to the
    main application.
    <!--  -->
    After each activity is completed, the application takes the activity's
    <b>decision</b>
    and runs it through a set of rules in order to update the upcoming sequence
    of activities.
    <!--  -->
    <!-- The goal is to maximize the customer's focus, minimize
    unnecessary activities and increase the speed needed to complete a given
    task. -->
    <!-- This system tries to optimize for continous partial attention.  -->
    <!-- the minimum set of uses a dynamic control flow program to step through a
    series of activities. -->
    <!--
    On the bottom left you can see the application state, in essence, the
    results of previous activities between brand and customer. On the bottom
    left you can preview what's coming up in the sequence. The sequence will
    mutate depending on the state. For example, a donation does not require a
    shipping address, and a t-shirt requires an extra step to select color and
    size.
    -->
  </p>
  <button on:click={() => cont('customer')}>Continue as a customer</button>
  <button on:click={() => cont('developer')}>Continue as a developer</button>
</div>
