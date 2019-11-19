<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, InputAddress, Feedback } = I;
  import {set_shipping_address} from '../stores/shipping_address';
</script>

<div class="activity"
  id="shipping_address"
  happy="select_payment_method"
  sad="shipping_address">
  <div>Where would you like this to be delivered?</div>
  <InputAddress
    placeholder="123 Main Street"
    fillInAddress={set_shipping_address} />
</div>

<!--
<div class="activity"
  id="shipping_address_filled"
  happy="select_payment_method"
  sad="shipping_address">
  <p>
    Your purchase will be delivered to:
    <br />
    {$shipping_address.oneline}
  </p>
  <p>Is this still alright?</p>
  <input type="submit" value="Yes" path="happy" />
  <input type="submit" value="No, edit shipping address" path="sad" />
</div>
-->
