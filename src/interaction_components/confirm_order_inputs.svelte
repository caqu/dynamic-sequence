<script>
  import I from "../lib/interaction.js";
  const { Interaction, Prompt, Inputs, Feedback } = I;
  
  export let props;
  export let callback;
  
  const handler = event => {
    console.log(event);
    callback(true);
  }
</script>

<Interaction id="validate_order_inputs" happy="order_confirmation" sad="revise_order">
  <p>
    <img
      src="https://s7d9.scene7.com/is/image/AmericanApparel/dm3654w_black?wid=240"
      style="float:right;margin-left:10px;width:96px"
      alt="Jean" />
    You will be getting 1 Black
    <i>The Crop Carpenter Jean</i>
    <input type="submit" value="Edit My Order" path="sad" />
    on size 26 delivered to ...
    <!-- <u>{$shipping_address.oneline}</u> -->
    <input type="submit" value="Edit Shipping Address" />
    .
  </p>
  <p>It will get there around Monday.</p>
  <p>
    A total of $78.00 will be charged to your credit card when you place order.
  <input type="submit" value="Edit Payment" />
  </p>
  <input type="submit" value="Place Order" path="happy" />
</Interaction>
