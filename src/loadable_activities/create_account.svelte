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

<Interaction>
  <label>Make up a new password</label>
  <input type="password" placeholder="8-10 characters" />
</Interaction>
