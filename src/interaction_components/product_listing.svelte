<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let callback = () => console.log("please define me parent");

  // TODO This will be updated to use a commerce backend API
  const handleClick = function(event) {
    if (event.target.dataset.sku) {
      addToCart(event.target.dataset.sku);
    } else if (event.target.dataset.productid) {
      selectProduct(event.target.dataset.productid);
    }
    // Simulated API network delay
    setTimeout(function() {
      callback(true);
    }, 600);
  };
  const addToCart = function(sku) {
    props.update(function(p) {
      return {
        ...$props,
        commerceItems: [
          {
            sku,
            quantity: 1
          }
        ]
      };
    });
  };
  const selectProduct = function(product_id) {
    props.update(function(p) {
      return {
        ...$props,
        selected_product: product_id
      };
    });
  };
</script>

<Interaction>
  <Prompt>
    <p style="max-width:30rem">What would you like to do next?</p>
  </Prompt>
  <Inputs>
    <!-- Donations, no shipping necessary -->
    <button on:click={handleClick} data-sku="donate5">Donate $5</button>
    <!-- No variants, PDP can be skipped -->
    <button on:click={handleClick} data-sku="mug67">Buy Mug</button>
    <!-- Many variants, go to PDP -->
    <button on:click={handleClick} data-productid="tshirt">Buy T-shirt</button>
  </Inputs>
</Interaction>
