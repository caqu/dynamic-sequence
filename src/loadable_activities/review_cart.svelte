<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let decision;

  function handler() {
    decision(true);
  }

  let product_data;
  onMount(async function() {
    if ($props.commerceItems) {
      product_data = await getData($props.commerceItems);
    }
  });
  // Simulated DB data
  const skus = {
    donate5: {
      name: "Make a donation",
      price: "$5",
      src: "/demo/mtyp-name-your-own-price-donation-image.png"
    },
    mug67: {
      name: "Mug",
      price: "$15",
      src: "/demo/51graM2SdzL._SX466_.jpg"
    },
    tshirt16: {
      name: "Mug",
      price: "$15",
      src: "/demo/il_570xN.920729875_naed.jpg"
    }
  };
  // Simulated commerce API
  const getData = function(cis) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(
          cis.map(function(ci) {
            return {
              ...ci,
              ...skus[ci.sku]
              // price: skus[sku].price,
              // src: skus[sku].src
            };
          })
        );
      }, 600);
    });
  };
</script>

<style>
  img {
    display: block;
    margin: 0 auto;
    height: 96px;
  }
  p {
    margin-top: 0;
  }
</style>

<Interaction {handler}>
  {#if product_data}
    <p>Here's what we've got so far.</p>
    <p>
      {#each product_data as ci}
        <div style="height:96px">
          <img transition:fade src={ci.src} alt=" " />
        </div>
      {/each}
      You picked up a
      {#each product_data as ci}
        {ci.name}
        {#if ci.size}on size {ci.size}.{/if}
      {/each}
    </p>
  {:else}
    <p>Looks like your bag is empty.</p>
  {/if}
  <Inputs>
    {#if $props.commerceItems}
      <input type="submit" value="Checkout" />
      <input type="submit" value="Edit Products" />
    {:else}...{/if}
    <input type="text" placeholder="Find more products" />
  </Inputs>
</Interaction>
