// TODO This should be stored as dynamic data
// export const base_interaction_sequence = [
//   "opening_interaction",
//   "first_name",
//   "last_name"
// ];

// <!--
// import InputAddress from "./lib/input_address.svelte";
// import {
//   shipping_address,
//   setShippingAddress
// } from "./stores/shipping_address.js";

// <Interaction id="edit_products_in_cart" happy="opening_interaction" sad="TODO">
//   <p>TODO Edit screen. Dead end for now.</p>
//   <input type="submit" value="Back to Cart" path="happy" />
// </Interaction>

// <Interaction id="username" happy="sign_in_or_guest" sad="">
//   <label>
//     What
//     <i>email</i>
//     can we use to send you the receipt?
//   </label>
//   <input not-type="email" type="text" />
// </Interaction>

// <Interaction id="sign_in_or_guest" happy="password" sad="first_name">
//   <p>
//     Do you want to
//     <i>sign in</i>
//     or
//     <i>create an account</i>
//     with that email?
//   </p>
//   <input type="submit" value="Yes!" path="happy" />
//   <input type="submit" value="No, continue as a guest" path="sad" />
// </Interaction>

// <Interaction id="password" happy="shipping_address" sad="create_account">
//   <label>Password?</label>
//   <input type="password" placeholder="8-10 characters" />
// </Interaction>

// <Interaction id="create_account" happy="" sad="">
//   <label>Make up a new password</label>
//   <input type="password" placeholder="8-10 characters" />
// </Interaction>

// <Interaction id="verify_email" happy="shipping_address" sad="username">
//   <label>Enter the code you received in your email</label>
//   <input type="number" placeholder="_ _ _ _ - _ _ _ _" />
// </Interaction>
// -->

// <!--
// <Interaction
//   id="shipping_address"
//   happy="select_payment_method"
//   sad="shipping_address">
//   <label>Where would you like this to be delivered?</label>
//   <InputAddress
//     placeholder="123 Main Street"
//     fillInAddress={setShippingAddress} />
// </Interaction>

// <Interaction
//   id="shipping_address_filled"
//   happy="select_payment_method"
//   sad="shipping_address">
//   <p>
//     Your purchase will be delivered to:
//     <br />
//     {$shipping_address.oneline}
//   </p>
//   <p>Is this still alright?</p>
//   <input type="submit" value="Yes" path="happy" />
//   <input type="submit" value="No, edit shipping address" path="sad" />
// </Interaction>

// <Interaction id="select_payment_method" happy="validate_order_inputs" paypal="">
//   <label>How would you like to pay?</label>
//   <input type="submit" value="PayPal" path="paypal" />
//   <input type="submit" value="Visa" />
// </Interaction>

// <Interaction id="validate_order_inputs" happy="order_confirmation" sad="revise_order">
//   <p>
//     <img
//       src="https://s7d9.scene7.com/is/image/AmericanApparel/dm3654w_black?wid=240"
//       style="float:right;margin-left:10px;width:96px"
//       alt="Jean" />
//     You will be getting 1 Black
//     <i>The Crop Carpenter Jean</i>
//     on size 26 delivered to
//     <u>{$shipping_address.oneline}</u>
//     .
//   </p>
//   <p>It will get there around Monday.</p>
//   <p>
//     A total of $78.00 will be charged to your credit card when you place order.
//   </p>
//   <input type="submit" value="Place Order" path="happy" />
//   <input type="submit" value="Edit My Order" path="sad" />
// </Interaction>

// <Interaction id="revise_order" happy="opening_interaction" sad="">
//   <input type="submit" value="Edit Name" />
//   <input type="submit" value="Edit Shipping Address" />
//   <input type="submit" value="Edit Shipping Address" />
// </Interaction>

// <Interaction id="order_confirmation" happy="opening_interaction">
//   <h1>Woot!</h1>
//   <p>
//     You will be getting 1 Black
//     <i>The Crop Carpenter Jean</i>
//     on size 26 delivered to
//     <u>{$shipping_address.oneline}</u>
//     . It will get there approximately on Monday. A total of $78.00 was charged
//     to your credit card.
//   </p>
//   <input
//     type="submit"
//     value="Buy another one"
//     path="happy"
//     on:click={() => {
//       sessionStorage.clear();
//     }} />
// </Interaction>
// -->
