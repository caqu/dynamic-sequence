export const config = {
  images_path: '/images/'
};

export default {
  initial_state: {
    beauty: 'is in the eye of the beholder'
  },
  initial_control_flow: [
    // "Menu",
    'Brand intro',
    'Explain experience', // This activity adds an activity
    'Product listing',
    // "Explain experience part 2",
    'Review cart'
    // "Apply promo code",
    // "Select account mode",
    // 'Roman phone number',
    // "Select shipping address",
    // "Select shipping method",
    // "Select payment method",
    // "Verify order"
  ],
  initial_rule_set: [
    {
      description: 'Cart has shippable item, add shipping address activity',
      // return state.cart.includes(/**/); // TODO
      predicate: function(state) {
        return false;
      },
      consequence: main_sequence =>
        main_sequence.update(function(ms) {
          const activity = 'Select shipping address';
          if (ms.includes(activity)) {
            return ms;
          } else {
            return [...ms, activity];
          }
        })
    },
    {
      description:
        'Cart has an item rated mature, add age verification activity',
      predicate: () => {},
      consequence: () => {}
    },
    {
      description: `if selected product has size variants
        and size is not selected,
        enqueue size selector component`,
      predicate: function(state) {
        return (
          state.selected_product !== undefined &&
          state.selected_product.requires_size &&
          state.selected_product.size === undefined
        );
      },
      consequence: function(flow, index) {
        flow.update(function(flow) {
          const activity = 'Product size selector';
          const current_position = flow.indexOf(activity); // eek!
          // debugger;
          // make a copy of the array
          let new_flow = [...flow];
          if (current_position > -1) {
            // TODO mode activity immediately after this one
            // remove
            new_flow = [
              ...new_flow.slice(0, current_position),
              ...new_flow.slice(current_position + 1)
            ];
          }
          new_flow = [
            ...new_flow.slice(0, index + 1),
            activity,
            ...new_flow.slice(index + 1)
          ];
          return new_flow;
        });
      }
    },
    {
      description: `if selected product has color variants
        and color is not selected,
        enqueue color selector component`,
      predicate: function(state) {
        return (
          state.selected_product !== undefined &&
          state.selected_product.requires_color &&
          state.selected_product.color === undefined
        );
      },
      consequence: function(flow, index) {
        flow.update(function(flow) {
          const activity = 'Product color selector';
          const current_position = flow.indexOf(activity); //eek!
          // make a copy of the array
          let new_flow = [...flow];
          if (current_position > -1) {
            // TODO mode activity immediately after this one
            // remove
            new_flow = [
              ...new_flow.slice(0, current_position),
              ...new_flow.slice(current_position + 1)
            ];
          }
          new_flow = [
            ...new_flow.slice(0, index + 1),
            activity,
            ...new_flow.slice(index + 1)
          ];
          return new_flow;
        });
      }
    }
  ]
};

// const interactions = {
//   "Select account mode": either([
//     "Sign in or create account",
//     "Proceed as guest" // + retry sign-in button (?)
//   ]),
//   "Sign in or create account": step_thru([
//     "Enter username", // checks if the username exists in the DB
//     "Submit password" // sign in or create an account // reply we sent you email confirmation
//   ]),
//   // Select from saved
//   "Select shipping address": step_thru([
//     "Enter first and last name",
//     "Enter shipping address",
//     "Enter phone number",
//     "Enter email address",
//     "Sign up for newsletter", // submits form to backend
//     either(["Verify shipping", "Select shipping address"])
//   ]),
//   "Select shipping method": false, // submits form to backend
//   "Select payment method": either([
//     "Pay with PayPal",
//     "Pay with a credit card"
//   ]),
//   "Pay with a credit card": step_thru([
//     "Enter name on card",
//     "Enter credit card number",
//     "Enter expiration MM/YY",
//     "Enter security code CVV",
//     either([
//       "Use shipping address as billing address",
//       "Enter billing address"
//     ])
//   ]),
//   "Verify order": false, // e.g.: click "Edit shipping method" adds an 'Select shipping method' before this one.
//   "Order confirmation": false
// };
