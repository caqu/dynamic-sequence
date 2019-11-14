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
          return [...ms, "Explain experience 2"];
        });
        // TODO could return true / false if it was successful at editing the main_sequence
        return undefined;
      }
    };
    decision([new_rule]);
  }
</script>

<div>
  <h1>Bundled activities and loaded on-demand</h1>
  <p style="max-width:30rem">
    In order to bundle an activity with the main JS package, add it to the
    directory: ./src/bundled_activities/ and export it on:
    ./src/bundled_activities/index.js This activity will be available
    immediately when the application starts running. Put only activities that
    are necessary for the first paint of the application.
  </p>
  <p>
    In order to bundle an activity by itself and load it later, add it to
    ./src/loadable_activities/ so that it's built into
    ./public/bundles/my_activity.js and can be retrieved from a web address like
    https://example.com/bundles/my_activity.js
  </p>
  <button on:click={handleClick}>Continue</button>
</div>
