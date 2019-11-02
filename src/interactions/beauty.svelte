<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let callback = () => console.log("please define me parent");

  const yes = () => {
    // This sequence updater should be moved to an external source.
    props.update(p => {
      // As an example, remove FirstName from sequence
      p.main_sequence.update(ms => {
        return ms.filter(a => a != "shipping_address" && a != "Beauty");
      });
      return {
        ...$props,
        beauty: "yes"
      };
    });
    callback(true);
  };
  const no = () => {
    props.update(p => ({ ...$props, beauty: "no" }));
    callback(true);
  };
  // const ignore = () => {
  //   callback(true);
  // };
</script>

<Interaction>
  <Prompt>
    Isn't this a {$props.adjective || 'gorgeous'} sunset?
    
  </Prompt>
  <Inputs>
    <button on:click={yes}>Donate $5</button>
    <button on:click={no}>Buy Mug</button>
    <!-- <button on:click={ignore}>Ignore</button> -->
  </Inputs>
</Interaction>
