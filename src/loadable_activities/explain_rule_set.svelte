<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let decision;
  export let props;

  function handleClick() {
    props.update(function(props) {
      return {
        ...props,
        explain_experience: true
      };
    });
    const new_rule = {
      predicate: function(state) {
        return state.explain_experience === true;
      },
      consequence: function(main_sequence) {
        main_sequence.update(function(ms) {
          if (ms.includes("Explain experience 2")) {
            return ms;
          } else {
            return [...ms, "Explain experience 2"];
          }
        });
        // TODO could return true / false if it was successful at editing the main_sequence
        return undefined;
      }
    };
    decision([new_rule]);
  }
</script>

<style>
  div {
    background: white;
    padding: 0.75rem 1rem 0.5rem;
    border-radius: 0.5rem;
  }
  h1 {
    margin: 0;
  }
  p {
    margin-top: 0;
  }
</style>

<div>
  <h1>Rules processing</h1>
  <p style="max-width:30rem">
    An activity can modify the application state.
    <!--  -->
    An activity can add and remove rules.
    <!--  -->
    All the rules are processed when the activity ends.
    <!--  -->
    Each rule can modify the flow of upcoming activities.
  </p>
  <button on:click={handleClick}>Continue</button>
</div>
