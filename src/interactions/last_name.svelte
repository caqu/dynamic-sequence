<script>
  import I from "../lib/interaction.js";
  import { user_inputs } from "../stores/user_inputs.js";
  import { error_messages } from "../stores/coordinator.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback;

  const handler = event => {
    console.log(event.target);
    
    new Promise(resolve => {
      setTimeout(()=> {
        last_name_reducer(event.target.elements.last_name.value);
        resolve("ln " + "this.elements.last_name.value");
        callback(true);
      }, 300)
    });
  }
  function last_name_reducer(last_name) {
    props.update(p => ({ ...$props, last_name: last_name }));
  }
</script>

<Interaction id="last_name" {handler}>
  <Prompt>What's your last name?</Prompt>
  <Inputs>
    <input name="last_name" placeholder="" value={$user_inputs.last_name || ''} />
  </Inputs>
  <Feedback>
    <p>
      So... {$user_inputs.first_name} {$user_inputs.last_name}. Let's get
      started!
    </p>
  </Feedback>
</Interaction>
