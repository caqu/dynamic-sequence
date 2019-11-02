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
  <label>Make up a new password</label>
  <input type="password" placeholder="8-10 characters" />
</Interaction>
