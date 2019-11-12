<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback;

  const handler = function(event) {
    console.log(event);
    callback(true);
  };
</script>

<Interaction>
  <p>
    Do you want to
    <i>sign in</i>
    or
    <i>create an account</i>
    with that email?
  </p>
  <input type="submit" value="Yes!" />
  <input type="submit" value="No, continue as a guest" />
</Interaction>
