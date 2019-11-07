<script>
  import { onMount, setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import parseq from "./lib/parseq.js";
  import I from "./interaction_components";
  import MenuButton from "./lib/menu_button.svelte";
  import ResultsVisualizer from "./lib/results_visualizer.svelte";
  import RulesVisualizer from "./lib/rules_visualizer.svelte";
  import ProgramVisualizer from "./lib/program_visualizer.svelte";
  const { fallback, sequence } = parseq;
  const either = arr => fallback(arr.map(s => WidgetFactory(s)));
  const step_thru = arr => sequence(arr.map(s => WidgetFactory(s)));
  // AST: JSON to functions Editing a program in the browser.
  const initial_sequence = [
    // "Menu",
    "Brand intro",
    "Explain experience",
    "Product listing",
    // "Product variant selector",
    "Explain experience part 2",
    "Review cart",
    "Apply promo code",
    "Select account mode",
    // "Select shipping address",
    // "Select shipping method",
    "Select payment method",
    "Verify order"
  ];
  const interactions = {
    "Select account mode": either([
      "Sign in or create account",
      "Proceed as guest" // + retry sign-in button (?)
    ]),
    "Sign in or create account": step_thru([
      "Enter username", // checks if the username exists in the DB
      "Submit password" // sign in or create an account // reply we sent you email confirmation
    ]),
    // Select from saved
    "Select shipping address": step_thru([
      "Enter first and last name",
      "Enter shipping address",
      "Enter phone number",
      "Enter email address",
      "Sign up for newsletter", // submits form to backend
      either(["Verify shipping", "Select shipping address"])
    ]),
    "Select shipping method": false, // submits form to backend
    "Select payment method": either([
      "Pay with PayPal",
      "Pay with a credit card"
    ]),
    "Pay with a credit card": step_thru([
      "Enter name on card",
      "Enter credit card number",
      "Enter expiration MM/YY",
      "Enter security code CVV",
      either([
        "Use shipping address as billing address",
        "Enter billing address"
      ])
    ]),
    "Verify order": false, // e.g.: click "Edit shipping method" adds an 'Select shipping method' before this one.
    "Order confirmation": false
  };
  const rule_set = writable([
    {
      condition: "customer has not seen explanation",
      action: "add Explain experience next"
    },
    {
      condition: "any cart.item is shippable",
      action: "add shipping address before Select payment method"
    },
    {
      condition:
        "any cart.item is rated mature and age verification is missing",
      action: "add age verification next"
    }
  ]);
  const main_sequence = writable(initial_sequence);
  const widget_sequence = derived(main_sequence, $main_sequence =>
    $main_sequence.map(s => WidgetFactory(s))
  );
  const state = writable({
    // adjective: "beautiful",
    // main_sequence
  });
  widget_sequence.subscribe(ws => {
    sequence(ws)(show_end_of_sequence, state);
    // Program
    // sequence(initial_sequence)("Order confirmation");
  });
  const ComponentRef = writable();

  let callback;
  function WidgetFactory(name) {
    return function component_requestor(cb, output_from_caller) {
      // console.log("component_requestor", name, I);
      I[name];
      ComponentRef.set(I[name]);
      callback = cb;
    };
  }
  function show_end_of_sequence(value, reason) {
    // Our program may never "ends",
    // rather it loop onto itself from Order Confirmation 
    // to Continue Shopping.
  }
  function go_to(event) {
    const component_name = this.innerText;
    console.log(component_name);
    ComponentRef.set(I[component_name]);
  }

  function x(s) {
    console.log("get x", s, interactions);
    if (typeof interactions[s] === "function") return interactions[s];
    // if (components[s]) return components[s];
    throw new Error(`Please create interaction "${s}"`);
  }
</script>

<style>
  /* TODO these globals need to be scoped */
  /* :global(form) {
    position: absolute;
    left: auto;
    right: auto;
    padding: 1rem;
    max-width: 40rem;
    display: none;
    transform: translateY(100vh);
  }
  :global(form.active) {
    display: block;
    animation: scroll-in ease-out 0.6s;
    transform: translateY(0vh);
  } */
  /* :global(form.complete) {
    display: block;
    animation: scroll-out ease-out 0.6s;
    transform: translateY(-100vh);
  } */
  /* @keyframes scroll-in {
    0% {
      transform: translateY(100vh);
    }
    1% {
      display: block;
    }
    100% {
      display: block;
      transform: translateY(0);
    }
  }
  @keyframes scroll-out {
    0% {
      display: block;
      transform: translateY(0);
    }
    99% {
      display: block;
    }
    100% {
      transform: translateY(-100vh);
      /* rotateX(90deg) translateY(-100%) * /
      display: none;
    }
  } */
</style>

<MenuButton callback={()=>alert('TODO show menu')} />

{#if $ComponentRef}
  <!-- TODO https://www.brianstorti.com/the-actor-model/
this explore if this needs to be an iframe  so that we can 
let it crash, and have this app refresh the contents 
to stable state.
Or an import(file.js)?
 -->
  <svelte:component this={$ComponentRef} {callback} props={state} />
{:else}
  <div style="color:red;padding:1rem;background:white">
    Please configure component "{$main_sequence[0]}"
  </div>
{/if}

<!-- if debugging -->
<ResultsVisualizer {state} />
<RulesVisualizer {rule_set} />
<ProgramVisualizer {main_sequence} {go_to} />
<!-- fi debugging -->
