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

<Interaction {handler}>
  <label>
    What
    <i>email</i>
    can we use to send you the receipt?
  </label>
  <input not-type="email" type="text" />
</Interaction>
