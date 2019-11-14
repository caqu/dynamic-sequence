<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let decision;

  const handler = function(event) {
    console.log(event.target);
    setTimeout(function() {
      last_name_reducer(event.target.elements.last_name.value);
      decision(true);
    }, 3000);
  };
  function last_name_reducer(last_name) {
    props.update(function(p) {
      return { ...$props, last_name: last_name };
      // return Object.freeze({method, other});
    });
  }
</script>

<Interaction id="last_name" {handler}>
  <Prompt>What's your last name?</Prompt>
  <Inputs>
    <input name="last_name" placeholder="" value={$props.last_name || ''} />
  </Inputs>
  <!-- <Feedback>
    <p>
      So... {$props.first_name} {$props.last_name}. Let's get
      started!
    </p>
  </Feedback> -->
</Interaction>
