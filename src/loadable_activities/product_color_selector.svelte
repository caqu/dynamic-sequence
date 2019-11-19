<script>
  import { onMount } from "svelte";
  import { config } from "../program.js";

  export let props; // a writable store
  export let decision = function(callback) {
    console.log("please define decision in parent");
  };

  let colors = [];
  let color_selected;
  const select_color = function(event) {
    const selected_color = event.target.dataset.color;
    const selected_src = event.target.dataset.src;
    props.update(function(props) {
      return {
        ...props,
        selected_product: {
          ...props.selected_product,
          src: selected_src,
          color: selected_color
        }
      };
    });
    decision(selected_color);
  };

  onMount(function handleMount(params) {
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
    colors = data.colors;
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
    background: rgba(179, 189, 208, 0.23);
    transform: rotateZ(1deg);
    padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.5) 2px 2px 8px;
    border-radius: 3px;
  }
</style>

<div class="interaction">
  <div>Which color?</div>
    {#if colors.length > 0}
      <div>
        {#each colors as color}
          <img
            on:click={select_color}
            data-color={color.name}
            data-src={color.src}
            src={config.images_path + color.src}
            alt={color.name}
            width="80" />
        {/each}
      </div>
    {/if}
</div>
