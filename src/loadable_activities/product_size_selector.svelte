<script>
  import { onMount } from "svelte";
  import I from "../lib/interaction.js";
  import { config } from "../program.js";

  const { Prompt, Inputs, Feedback } = I;

  export let props; // a writable store
  export let decision = function() {
    console.log("please define me in parent");
  };

  let sizes = [];
  let size_selected;

  const select_size = function(size) {
    const selected_size = event.target.dataset.size;
    const selected_sku = event.target.dataset.sku;
    props.update(function(p) {
      return {
        ...$props,
        selected_product: {
          ...$props.selected_product,
          size: selected_size
        }
      };
    });
    // Simulated API network delay
    setTimeout(function() {
      add_to_cart({
        sku: selected_sku,
        name: $props.selected_product.name,
        price: $props.selected_product.price
      });
    }, 600);
  };
  const add_to_cart = function({ sku, name, price }) {
    props.update(function(props) {
      return {
        ...$props,
        selected_product: undefined,
        commerceItems: [
          {
            sku,
            name,
            price,
            src: $props.selected_product.src,
            quantity: 1
          }
        ]
      };
    });
    decision(true);
  };

  onMount(function handleMount(params) {
    // TODO how do we share data from prior request so we can minimize fetches?
    fetch("/api/tshirt.json")
      .then(function(response) {
        response
          .json()
          .then(handleProductData)
          .catch(handleParsingError);
      })
      .catch(handleFetchingError);
    return function handleDismount() {
      console.log("Dismounting product color selector");
    };
  });
  function handleProductData(data) {
    // Apply any adapter logic here
    sizes = data.sizes;
  }
  // Errors give control back to the parent.
  function handleFetchingError(error) {
    console.error(error);
    decision(undefined, error);
  }
  function handleParsingError(error) {
    console.error(error);
    decision(undefined, error);
  }
</script>

<style>
  .interaction {
    background: white;
    padding: 0.5rem 1rem;
    box-shadow: rgba(0, 0, 0, 0.5) 2px 2px 8px;
    border-radius: 3px;
    max-width: 90vh;
  }
  thead td {
    border-bottom: 1px solid #ccc;
  }
  .size_chart_with_buttons {
    border-collapse: collapse;
    width: 192pt;
  }
  button {
    background: #eee;
    margin: 0.25em 0;
    text-align: center;
    border: 1px solid #ccc;
    border-color: #ccc #aaa #aaa #ccc;
    display: block;
    width: calc(100% - 0.5em);
  }
  td {
    border: 0;
    padding: 0 0.25em;
    font-size: 14px;
  }
  .howtomeasure {
    font-size: 14px;
  }
  h3 {
    font-size: 18px;
    margin: 0.5rem 0 0;
  }
  h4 {
    font-size: 16px;
    margin: 0;
  }
  .left,
  .right {
    float: left;
    width: 50%;
  }
  @media only screen and (max-width: 600px) {
    .left,
    .right {
      float: none;
      width: auto;
    }
  }
</style>

<div class="interaction">
  <div class="left">
    <h3>What size?</h3>
    {#if sizes.length > 0}
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="size_chart_with_buttons">
        <thead>
          <tr>
            <td>
              <strong>SIZE</strong>
            </td>
            <td>
              <strong>NECK</strong>
            </td>
            <td>
              <strong>CHEST</strong>
            </td>
            <td>
              <strong>ARM</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {#each sizes as size}
            <tr>
              <td>
                <button
                  on:click={select_size}
                  data-size={size.name}
                  data-sku={size.sku}>
                  {size.name}
                </button>
              </td>
              <td>{size.neck}</td>
              <td>{size.chest}</td>
              <td>{size.arm}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  <div class="right">
    <div class="howtomeasure">
      <h3>How to measure</h3>
      <h4>Neck</h4>
      <div>
        Measure around the middle of your neck (at the Adam's apple) keeping the
        tape a bit loose.
      </div>
      <h4>Chest</h4>
      <div>Measure under your arms around the fullest part of your chest.</div>
      <h4>Arm</h4>
      <div>
        Bend your elbow 90 degrees and place your hand on your hip. Hold the
        tape at the center of your neck. Measure across your shoulder to your
        elbow and down to your wrist. The total length is your sleeve length.
      </div>
    </div>
  </div>
</div>
