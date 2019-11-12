<script>
  import { onMount, setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import parseq from "./lib/parseq.js";
  import Activities from "./activities";
  import MenuButton from "./lib/menu_button.svelte";
  import activity_list from "./activity_list";

  import Editor from "./editor.svelte";

  const { fallback, sequence } = parseq;
  const string_to_widget = function(str) {
    return WidgetFactory(str);
  };
  const string_array_to_widget_array = function(arr) {
    return arr.map(string_to_widget);
  };
  const either = function(arr) {
    return fallback(string_array_to_widget_array(arr));
  };
  const step_thru = function(arr) {
    return sequence(string_array_to_widget_array(arr));
  };

  // AST: JSON to functions Editing a program in the browser.
  const initial_sequence = [
    // "Menu",
    "Brand intro"
    // "Explain experience",
    // "Product listing",
    // "Product variant selector",
    // "Explain experience part 2",
    // "Review cart",
    // "Apply promo code",
    // "Select account mode",
    // "Select shipping address",
    // "Select shipping method",
    // "Select payment method",
    // "Verify order"
  ];
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
  const loaded_widgets = writable({});
  // TODO get rid of widget_sequence concept, one activity at a time.
  // const widget_sequence = derived([main_sequence, loaded_widgets], function({
  //   0: main_sequence,
  //   1: loaded_widgets
  // }) {
  //   return main_sequence.map(function(widget_name) {
  //     if ($loaded_widgets[widget_name]) {
  //       return WidgetFactory(widget_name);
  //     } else {
  //       WidgetLoader(widget_name);

  //       return function(callback, value) {
  //         console.log("Placeholder requestor function");
  //       };
  //     }
  //   });
  // });

  // Put widget instances into Parseq
  // widget_sequence.subscribe(function(ws) {
  //   sequence(ws)(show_end_of_sequence, {});
  // });
  const ComponentRef = writable();

  let callback;

  function WidgetLoader(bundle_name) {
    const file_name = activity_list[bundle_name];
    // For example /bundles/brand_intro.js
    return import(`/bundles/${file_name}.js`)
      .then(function(loaded_component) {
        // debugger;
        if (loaded_component) {
          loaded_widgets.update(function(obj) {
            const newObj = {};
            newObj[bundle_name] = loaded_component;
            return Object.assign({}, obj, newObj);
          });
        }
      })
      .catch(function(message) {
        console.log("Failed to fetch activity", message);
      });
  }

  function WidgetFactory(bundle_name) {
    console.log("WidgetFactory calls component_requestor", bundle_name);
    return function component_requestor(cb, output_from_caller) {
      // ComponentRef.set(Activities[name]);
      // TODO These "globals" are a bit of a problem...

      ComponentRef.set($loaded_widgets[bundle_name]);
      callback = cb;
    };
  }
  function show_end_of_sequence(value, reason) {
    // Our program may never "ends",
    // rather it loop onto itself from Order Confirmation
    // to Continue Shopping.
    // TODO if the main mechanism is the fallback,
    // maybe "ending" is main "error" screen that let's us start over.
  }
  const state = writable({
    // initial_key: "initial_value"
  });

  onMount(function() {
    // State: what's happening?
    // Rules: loop thru predicates, invoke transformations
    // Control flow: what's next?
    // Render: 1 child component
  });
  const editor_props = { debugging, state, rule_set, main_sequence, go_to };
</script>

<style>

</style>

<!--
import SvelteComponent from "svelte_component";
<SvelteComponent />
 -->

<!--
<MenuButton callback={function(){alert('TODO show menu')}} />
 -->

{#if $ComponentRef}
  Did you load yet?
  <svelte:component this={$ComponentRef} />
  <!-- <svelte:component this={$ComponentRef} {callback} props={state} /> -->
{:else}
  <div style="color:red;padding:1rem;background:white">
    Please configure component "{$main_sequence[0]}"
  </div>
{/if}

<Editor props={editor_props} />
