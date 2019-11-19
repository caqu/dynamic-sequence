<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let decision = function() {
    console.log("please define me in parent");
  };

  const handleClick = function(event) {
    if (event.target.dataset.sku !== undefined) {
      add_to_cart({
        sku: event.target.dataset.sku,
        name: event.target.dataset.name,
        src: event.target.dataset.src,
        price: event.target.dataset.price
      });
    } else if (event.target.dataset.productid) {
      select_product({
        product_id: event.target.dataset.productid,
        name: event.target.dataset.name,
        price: event.target.dataset.price
      });
    }
  };
  // TODO This will be updated to use a commerce backend API
  const add_to_cart = function(item) {
    props.update(function(p) {
      return {
        ...$props,
        commerceItems: [
          {
            ...item,
            quantity: 1
          }
        ]
      };
    });
    // Simulated API network delay
    setTimeout(function() {
      decision(true);
    }, 600);
  };
  const select_product = function({ product_id, name, price }) {
    props.update(function(props) {
      return {
        ...props,
        selected_product: {
          product_id,
          name,
          price,
          requires_color: true,
          requires_size: true
        }
      };
    });
    decision(product_id);
  };
</script>

<style>
  .activity {
    background: white;
    padding: 0.5rem;
    max-width: 30rem;
  }
  .fake-carousel {
    display: flex;
  }
  button {
    margin: 0.25rem;
  }
</style>

<div class="activity">
  <div>What would you like to do next?</div>
  <div class="fake-carousel">
    <!-- Donations, no shipping necessary -->
    <button
      on:click={handleClick}
      data-sku="donate5"
      data-name="Donation"
      data-price="$5"
      data-src="donation.png">
      Donate $5
    </button>
    <!-- No variants, PDP can be skipped -->
    <button
      on:click={handleClick}
      data-sku="mug67"
      data-name="Mug"
      data-price="$15"
      data-src="mug.png">
      Buy Mug
    </button>
    <!-- Many variants, go to PDP -->
    <button
      on:click={handleClick}
      data-productid="tshirt"
      data-name="T-Shirt"
      data-price="$15">
      Buy T-shirt
    </button>
  </div>
</div>
