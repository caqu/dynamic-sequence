<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let callback = () => console.log("please define me parent");

  // const yes = () => {
  //   // This sequence updater should be moved to an external source.
  //   props.update(p => {
  //     // As an example, remove FirstName from sequence
  //     p.main_sequence.update(ms => {
  //       return ms.filter(
  //         a =>
  //           a != "shipping_address" && a != "shipping_method" && a != "Beauty"
  //       );
  //     });
  //     return {
  //       ...$props,
  //       beauty: "yes"
  //     };
  //   });
  //   callback(true);
  // };
  const selectColor = color => {
    callback(true);
    // debugger; // TODO post SKU to backend, when done callback(true)
    props.update(p => ({ ...$props, product: size }));
  };
  const addToCart = size => {
    callback(true);
    // debugger; // TODO post SKU to backend, when done callback(true)
    props.update(p => ({ ...$props, product: size }));
  };
  // const ignore = () => {
  //   callback(true);
  // };
</script>

<Interaction>
  <Prompt>
    <p>(Work in progress. All move forward)</p>
    <p>Select variant, color, size, etc.</p>
  </Prompt>
  <Inputs>
    <button style="background:#e33" on:click={event => selectColor('red')}>red</button>
    <button style="background:#eee" on:click={event => addToCart('white')}>white</button>
    <button style="background:#33e" on:click={event => addToCart('blue')}>blue</button>
    <br>
    <button on:click={event => addToCart('S')}>S</button>
    <button on:click={event => addToCart('M')}>M</button>
    <button on:click={event => addToCart('L')}>L</button>
    <!-- <button on:click={ignore}>Ignore</button> -->
  </Inputs>
</Interaction>
