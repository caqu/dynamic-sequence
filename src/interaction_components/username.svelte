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
    What
    <i>email</i>
    can we use to send you the receipt?
  </label>
  <input not-type="email" type="text" />
</Interaction>
