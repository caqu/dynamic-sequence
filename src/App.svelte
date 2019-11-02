<script>
  /**
   * TODO revise this description after parseq!!
   * This App is a Coordinator of Interactions.
   * An Interaction consists of a Prompt,
   * one of more input controls (Inputs for short),
   * and an interaction Handler.
   * The Coordinator's role is to keep track of which Interactions took place,
   * and which Interactions will be loaded next.
   * ? It also has configs for how to reach out to APIs
   *
   * Open Questions
   * How do we do input validation?
   * How do we know when we can sync with the server? Say I1 username, I2 password, now check with server. Handler?
   * Accessibility, use Tab kay to navigate? Arrow keys?
   */

  import { onMount, setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  // import { put_into_sequence } from "./lib/control_flow";
  import parseq from "./lib/parseq.js";
  import syntax_highlight_json from "./lib/syntax_highlight_json";
  import * as I from "./interactions"; // These are the Components
  import { initial_sequence } from "./config.js";

  // Initial config
  const main_sequence = writable(initial_sequence);
  const widget_sequence = derived(main_sequence, $main_sequence =>
    $main_sequence.map(s => WidgetFactory(s))
  );
  const state = writable({
    adjective: "beautiful",
    main_sequence
  });
  widget_sequence.subscribe(ws => {
    console.log("parseq happening...");
    parseq.sequence(ws)(show_end_of_sequence, state);
  });
  const ComponentRef = writable();
  let callback;
  function WidgetFactory(name) {
    return function component_requestor(cb, output_from_caller) {
      ComponentRef.set(I[name]);
      callback = cb;
    };
  }
  function show_end_of_sequence(value, reason) {
    ComponentRef.set(I["end_interaction"]);
    // if (value === undefined) {
    //   alert("Something went wrong because" + reason);
    // } else {
    //   alert("Success! You got " + value);
    // }
  }
  function go_to(event) {
    const component_name = this.innerText;
    console.log(component_name);
    ComponentRef.set(I[component_name]);
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

{#if $ComponentRef}
  <svelte:component this={$ComponentRef} {callback} props={state} />
{/if}

<div style="position:absolute;bottom:0;left:0">
  <div>Sequence</div>
  <ol style="margin:0">
    {#each $main_sequence as w}
      <li><u on:click={go_to}>{w}</u></li>
    {/each}
  </ol>
</div>
<pre class="state" style="position:absolute;bottom:0;right:0">
  {@html syntax_highlight_json($state)}
</pre>
