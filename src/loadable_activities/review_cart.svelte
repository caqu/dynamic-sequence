<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { config } from "../program.js";

  export let props;
  export let decision;

  function handler() {
    decision(true);
  }

  let product_data;
  onMount(function() {
    if ($props.commerceItems) {
      product_data = $props.commerceItems;
    }
  });
</script>

<style>
  .activity {
    padding: 0.5rem;
    background: whitesmoke;
    border: 1rem inset indigo;
    border-radius: 2px;
  }
  img {
    display: block;
    margin: 0 auto;
    height: 96px;
  }
  p {
    margin-top: 0;
  }
  .checkout_button {
    background: #033;
    border: 0;
    font-weight: bold;
    color: #ffe;
    margin: 1rem auto;
    display: block;
    padding: 0.5em 1em;
    border-radius: 3px;
  }
</style>

<div class="activity" {handler}>
  {#if product_data}
    <p>Here's what we've got so far.</p>
    <p>
      {#each product_data as ci}
        <div style="height:96px">
          <img transition:fade src={config.images_path + ci.src} alt=" " />
        </div>
      {/each}
    </p>
    <div>
      You picked up a
      {#each product_data as ci}
        {ci.price} {ci.name}
        {#if ci.size}on size {ci.size}.{/if}
        <u
          on:click={event => {
            event.preventDefault();
            alert('work in progress');
            window.location.reload();
          }}>
          Edit
        </u>
      {/each}
    </div>
  {:else if product_data === undefined}
    <b class="loading" />
  {:else}
    <p>Looks like your bag is empty.</p>
  {/if}

  {#if $props.commerceItems}
    <div>
      <button
        class="checkout_button"
        on:click={() => {
          alert('work in progress'), window.location.reload();
        }}>
        Checkout
      </button>
    </div>
  {:else}...{/if}

  <hr />
  <input type="text" placeholder="Find more products" />
</div>
