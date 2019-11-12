<script>
  import { onMount, setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import parseq from "./lib/parseq.js";
  import Activities from "./bundled_activities"; // find them at index.js
  import activity_list from "./activity_list";
  import MenuButton from "./lib/menu_button.svelte";
  import program from "./program.js";

  import Editor from "./editor.svelte";

  const debugging = true;
  const { initial_state, initial_rule_set, initial_control_flow } = program;
  // TODO here reload from sessionStorage
  const state = writable(initial_state);
  const rule_set = writable(initial_rule_set);
  const main_sequence = writable(initial_control_flow);

  const string_to_widget = function(str) {
    return WidgetFactory(str);
  };
  const string_array_to_widget_array = function(arr) {
    return arr.map(string_to_widget);
  };
  const either = function(arr) {
    return parseq.fallback(string_array_to_widget_array(arr));
  };
  const step_thru = function(arr) {
    const widget_array = string_array_to_widget_array(arr);
    debugger;

    return parseq.sequence(widget_array)(end, {});
  };

  const loaded_widgets = writable({});
  const ComponentRef = writable();
  let decision;

  function WidgetLoader(callback, bundle_name) {
    const file_name = activity_list[bundle_name];
    return function(callback, bundle_name) {
      // For example /bundles/brand_intro.js
      import(`/bundles/${file_name}.js`)
        .then(function(m) {
          debugger;
          callback(m);
        })
        .catch(function(message) {
          console.log("Failed to fetch activity", message);
        });
    };
  }

  function WidgetFactory(bundle_name) {
    debugger;
    // if Activities has it, put it into loaded widgets and use it
    // else load it, then put it into loaded widgets and use it
    const component_name = activity_list[bundle_name];
    if (Activities[bundle_name] !== undefined) {
      loaded_widgets.update(function(ws) {
        debugger;
        const newObj = {};
        newObj[bundle_name] = Activities[bundle_name];
        const r = Object.assign({}, ws, newObj);
        return r;
      });
    }
    if ($loaded_widgets[bundle_name] !== undefined) {
      return component_requestor;
    } else {
      debugger;
      return parseq.sequence([
        WidgetLoader(component_requestor, bundle_name),
        component_requestor
      ])(function show() {
        debugger;
      });
    }
    function component_requestor(callback, value) {
      debugger;
      ComponentRef.set($loaded_widgets[bundle_name]); // eek, global
      decision = cb; // eek, global
    }
  }
  function end(value, reason) {
    // Our program should never formally end,
    // rather an activity should take the user to another.
    // Reaching the end of sequence means something went wrong.
    debugger;
    window.location.reload();
  }

  onMount(function() {
    console.log("On mount loading ", $main_sequence);
    step_thru($main_sequence);
  });

  function go_to() {
    debugger; // Loads the requested Activity. Used for development as it bypasses rules and control flow.
  }
  function show_activity(activity_name) {
    debugger;
    // TODO load activity if needed
    // Bypass rule_set!
    // Move onto begining of the control_flow
  }

  // For programmers
  const editor_props = { debugging, state, rule_set, main_sequence, go_to };
</script>

<MenuButton
  decision={function() {
    alert('TODO show menu');
  }} />

{#if $ComponentRef}
  Did you load yet? {Activities}
  <!-- <svelte:component this={$ComponentRef} {decision} props={state} /> -->
{:else}
  <div style="color:red;padding:1rem;background:white">
    Please configure component "{$main_sequence[0]}"
  </div>
{/if}

<Editor props={editor_props} />
