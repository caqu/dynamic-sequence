<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let decision = function() {
    console.log("please define me in parent");
  };

  const selectColor = function(color) {
    decision(true);
    props.update(function(p) {
      return { ...$props, product: color };
    });
  };
  const addToCart = function(size) {
    decision(true);
    props.update(function(p) {
      return { ...$props, product: size };
    });
  };
</script>

<Interaction>
  <Prompt>
    <p>(Work in progress. All move forward)</p>
    <p>Select variant, color, size, etc.</p>
  </Prompt>
  <Inputs>
    <button
      style="background:#e33"
      on:click={function(event) {
        selectColor('red');
      }}>
      red
    </button>
    <button
      style="background:#eee"
      on:click={function(event) {
        addToCart('white');
      }}>
      white
    </button>
    <button
      style="background:#33e"
      on:click={function(event) {
        addToCart('blue');
      }}>
      blue
    </button>
    <br />
    <button
      on:click={function(event) {
        addToCart('S');
      }}>
      S
    </button>
    <button
      on:click={function(event) {
        addToCart('M');
      }}>
      M
    </button>
    <button
      on:click={function(event) {
        addToCart('L');
      }}>
      L
    </button>
  </Inputs>
</Interaction>
