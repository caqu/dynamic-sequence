<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback;

  const handler = event => {
    console.log(event);
    callback(true);
  };
</script>

<Interaction {handler}>
  username
  <input type="email" value="" />
  <br>
  password
  <input type="password" value="" />
  <br>
  <input type="submit" value="Sign In" />
  <br>
  or
  <br>
  <input type="button" value="Continue" />
</Interaction>
