<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback;

  const handler = event => {
    console.log(event.target);
    setTimeout(() => {
      last_name_reducer(event.target.elements.last_name.value);
      callback(true);
    }, 3000);
  };
  function last_name_reducer(last_name) {
    props.update(p => ({ ...$props, last_name: last_name }));
  }
</script>

<Interaction id="last_name" {handler}>
  <Prompt>What's your last name?</Prompt>
  <Inputs>
    <input
      name="last_name"
      placeholder=""
      value={$props.last_name || ''} />
  </Inputs>
  <!-- <Feedback>
    <p>
      So... {$props.first_name} {$props.last_name}. Let's get
      started!
    </p>
  </Feedback> -->
</Interaction>
