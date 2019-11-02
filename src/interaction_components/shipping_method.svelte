<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;
  
  export let props;
  export let callback;
  
  const handler = event => {
    console.log(event);
    callback(true);
  }
</script>

<Interaction>
  <label>
    How fast do you need this?
  </label>
  <input value="Next day +$15" />
  <input value="Standard 5-7 days +$0" />
</Interaction>
