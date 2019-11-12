<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let decision;

  const handler = function(event) {
    console.log(event);
    decision(true);
  };
</script>

<Interaction id="password" happy="shipping_address" sad="create_account">
  <label>Password?</label>
  <input type="password" placeholder="8-10 characters" />
</Interaction>
