<script>
  import { last_open_form_id } from "../stores/last_open_form_id.js";
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

  export let props;
  export let callback;
</script>

<Interaction>
  <Prompt>Welcome{#if $props.first_name} back, {$props.first_name}{/if}!</Prompt>
  <Inputs>
    <input type="submit" value="Continue" />
  </Inputs>
</Interaction>
<!--
<Interaction
  handler={() => {
    debugger;
    console.log('opening_interaction handler\
      here we shall answer: Done here? Analytics, etc.');
    let path = document.activeElement.getAttribute('path');
    return new Promise((resolve, reject) => {
      if (path === 'happy') {
        debugger;
        console.log('You clicked Checkout');
        resolve('happy');
      } else {
        debugger;
        console.log('Cannot do that yet.');
        reject('sad');
      }
    });
  }}>
  <Prompt>
    <p>
      <!-- TODO refactor this boilerplatey user into Railsy-way -\->
      <!-- {#if $user.first_name}Hi, {$user.first_name}.{/if} -\->
      Here's what we've got so far.
    </p>
    <p>
      <img
        src="dm3654w_black.jpg"
        style="float:right;margin-left:10px;width:96px"
        alt="Jean" />
      You picked up 1 Black
      <i>The Crop Carpenter Jean</i>
      on size 26.
    </p>
  </Prompt>
  <Inputs>
    <input type="submit" value="Checkout" path="happy" />
    <input type="submit" value="Edit Products" path="sad" />
  </Inputs>
  <Feedback>
    <!-- {#if $shipping_address.oneline}
      <p>We're shipping this to {$shipping_address.oneline}</p>
    {/if} -\->
    {#if $last_open_form_id}
      <p>We need a few more details.</p>
      <input type="submit" value={'Keep Going'} path="continue" />
      (to {$last_open_form_id})
    {:else}
      <input type="submit" value="Checkout" path="start" />
      <input type="submit" value="Edit Products" path="sad" />
    {/if}
  </Feedback>
</Interaction> -->
