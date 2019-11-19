<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;

    export let decision;

  function handler(event){
    decision(event.target.value);
  }
</script>
<style>

</style>

<div class="activity">
  <input list="option" autocomplete=off
    on:change={handler}
  />
</div>

<datalist id="option">
<option>Track my order</option>
<option>Invite friends, get $15</option>
<option>Ship to</option>
<option>Search</option>
<option>Search Women section</option>
<option>Search Men section</option>
<option>Search Kids section</option>
<option>Find inspiration</option>
<option>Browse on-sale items</option>
<option>Find multipacks</option>
<option>Customer service</option>
<option>Help</option>
<option>Returns</option>
<option>Shipping</option>
<option>Studentbeans</option>
<option>Contact us</option>
<option>Product recall</option>
<option>Our brand</option>
<option>About us</option>
<option>Meet the fabrics</option>
<option>Meet the models</option>
<option>Wholesale</option>
<option>Social compliance</option>
<option>Follow us on Facebook</option>
<option>Follow us on Twitter</option>
<option>Follow us on Instagram</option>
<option>Follow us on Tumblr</option>
<option>Follow us on Pinterest</option>
<option>Follow us on YouTube</option>
<option>Subscribe to newsletter and get 15% off</option>
</datalist>
