<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let decision;

  const handler = function(event) {
    console.log(event);
    decision(true);
  };
  const handleClick = function() {
    decision(false, "Continue as a guest");
  };
</script>

<div class="activity" {handler}>
  username
  <input type="email" value="" />
  <br />
  password
  <input type="password" value="" />
  <br />
  <input type="submit" value="Sign In" />
  <br />
  or
  <br />
  <input type="button" value="Continue as a guest" on:click={handleClick} />
</div>
