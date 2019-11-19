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

<div class="activity" id="verify_email">
  <label>Enter the code you received in your email</label>
  <input type="number" placeholder="_ _ _ _ - _ _ _ _" />
</div>
