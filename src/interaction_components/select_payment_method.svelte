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

<Interaction {handler}>
  <label>How would you like to pay?</label>
  <input type="submit" value="PayPal" path="paypal" />
  <input type="submit" value="Visa" />
</Interaction>
