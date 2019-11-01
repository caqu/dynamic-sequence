<script>
  /**
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
  import ContextualizedComponent from "./lib/contexttualized_component.svelte";
  import * as I from "./interactions"; // These are the Components
  import { planned_interactions } from "./stores/coordinator.js";
  import { user_inputs } from "./stores/user_inputs.js";

  const component_queue = derived(
    planned_interactions,
    $planned_interactions => {
      // From Array of Strings to Array of Component References
      // From ['first_name'] to [I.firstName]
      const a = $planned_interactions.map(
        name =>
          I[
            name
              .replace(/^[A-z]/, a => a.toUpperCase())
              .replace(/_([A-z])/, (_, a) => a.toUpperCase())
          ]
      );
      return a;
    }
  );

  onMount(() => {
    // Get the first form and show it
    // restorePlace();
  });

</script>

<style>
  /* TODO these globals need to be scoped */
  :global(*) {
    /* TODO can I automagically determine the biggest possible font-size before user would need to scroll?
  font: 20vh/1.5 sans-serif;  */
    /*   font: 16px/1.5 sans-serif;  */
    font-size: 20px;
    line-height: 1.5;
    font-family: monospace;
  }
  :global(body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 0;
    margin: 0;
    /* overflow: hidden; // hm... risky... but needed to prevent scrollbar bouncing */
  }
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

<!-- 
  To load a component directly we can call it like:
    <FirstName />
  But here we want to load any component that's listed in the queue.
  So we use the planned_interactions to derived store of component_queue references
  These component references point those imported Svelte components 
  from the /interactions/index.js  -->
{#each $component_queue as ComponentRef, index (ComponentRef)}
  {#if index == 1}
    <ContextualizedComponent
      {index}
      {ComponentRef}
      name={$planned_interactions[index]} />
  {/if}
{/each}

<!-- <ol class="queue" style="position:absolute;bottom:0">
  {#each $planned_interactions as I}
    <li>{I}</li>
  {/each}
</ol> -->
