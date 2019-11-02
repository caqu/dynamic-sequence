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

<Interaction id="verify_email">
  <label>Enter the code you received in your email</label>
  <input type="number" placeholder="_ _ _ _ - _ _ _ _" />
</Interaction>
