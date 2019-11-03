export const initial_sequence = [
  "opening_interaction",
  "beauty",
  "username",
  "sign_in_or_guest",
  "password",
  "create_account",
  "verify_email",
  "first_name",
  "last_name",
  "shipping_address",
  "shipping_method",
  "select_payment_method",
  "confirm_order_inputs",
  "order_confirmation",
  "end_interaction"
];
/*
# Linguistic setup
const { fallback as either, sequence } = parseq;

# Program
sequence([
  x('Review cart'),
  x('Apply promo code'),
  x('Select account mode'),
  x('Select shipping address'),
  x('Select shipping method'),
  x('Select payment method'),
  x('Verify order'),
])(x('Order confirmation'));

const interactions = {
  'Select account mode': either([
    x('Sign in or create account'),
    x('Proceed as guest') // + retry sign-in button (?)
  ]),
  'Sign in or create account': sequence([
    x('Enter username'), // checks if the username exists in the DB
    x('Submit password') // sign in or create an account // reply we sent you email confirmation
  ]),
  'Select shipping address': sequence([
    x('Enter first and last name'),
    x('Enter shipping address'),
    x('Enter phone number'),
    x('Enter email address'),
    x('Sign up for newsletter'), // submits form to backend
    either([
      x('Verify shipping'),
      x('Select shipping address')
    ])
  ]),
  'Select shipping method',  // submits form to backend
  'Select payment method': either([
    x('Pay with PayPal'),
    x('Pay with a credit card')
  ]),
  'Pay with a credit card': sequence([
    x('Enter name on card'),
    x('Enter credit card number'),
    x('Enter expiration MM/YY'),
    x('Enter security code (CVV)'),
    either([
      x('Use shipping address as billing address')
      x('Enter billing address')
    ])
  ]),
  'Verify order', // e.g.: click "Edit shipping method" adds an x('Select shipping method') before this one.
  'Order confirmation'
};
function x (s) {
  if (typeof interactions[s] === 'function') return interactions[s]
  if (components[s]) return components[s]
  throw new Error(`Please create interaction "${s}"`)
}*/
