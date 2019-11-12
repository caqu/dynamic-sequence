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
  <h1>Woot!</h1>
  <p>
    You will be getting 1 Black
    <i>The Crop Carpenter Jean</i>
    on size 26 delivered to ...
    <!-- this will be a derived <u>{$shipping_address.oneline}</u> -->
    . It will get there approximately on Monday. A total of $78.00 was charged
    to your credit card.
  </p>
  <input
    type="submit"
    value="Buy another one"
    path="happy"
    on:click={function() {
      sessionStorage.clear();
    }} />
</Interaction>
