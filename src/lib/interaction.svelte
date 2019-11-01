<script>
  import { onMount, setContext, getContext } from "svelte";
  import { fly, scale } from "svelte/transition";
  import { quintOut, expoOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { user_inputs } from "../stores/user_inputs.js";
  import { interaction } from "../stores/contexts.js";
  import {
    is_showing_feedback,
    error_messages,
    handleInteractionCompleted
  } from "../stores/coordinator.js";

  export let id;

  // handler is a Function that returns a Promise, this default resolves immediately.
  export let handler = () =>
    new Promise((resolve, reject) => {
      resolve();
    });

  let count_down = writable(0);
  let move_to_next_question_interval_id;

  setContext(interaction, {
    id,
    is_showing_feedback,
    count_down
  });

  // function forwardPath(path) {
  //   // Tell the Coordinator that we're all done with this Interaction
  //   handleInteractionCompleted();
  // }
  // function returnPath(value) {
  // console.warn("returnPath", new Date().getTime(), value);
  // Show feedback
  //   is_showing_feedback.set(true);
  //   return value;
  // }

  function handleSubmission(event) {
    event.preventDefault();

    // Store the Input given by the user to the Prompt.
    user_inputs.update(I => {
      const n = {};
      n[event.target.id] = document.activeElement.value;
      return { ...I, ...n };
    });
    //
    // TODO what if i need to roll back?
    //
    if (typeof handler === "function") {
      const h = handler(event);
      if (h instanceof Promise) {
        h.then().catch();
      }
    }
  }
  let _store = JSON.stringify($user_inputs);

  let component;
  onMount(o => {
    let i = component.querySelector("input");
    if (i && i.nodeName === "INPUT") {
      i.focus();
    }
    // todo <select>, <button>, <a>, any focusable ...
  });
</script>

<style>
  form {
    padding: 0.6em 1em;
    box-shadow: 0px 0px 4px 0px white;
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    border-radius: 0.25em;
  }
</style>

<form
  bind:this={component}
  {id}
  {...$$props}
  on:submit={handleSubmission}
  in:fly={{ y: 50, duration: 1600, easing: quintOut }}
  out:scale={{ duration: 1600, opacity: 0.9, start: 0, easing: expoOut }}>
  <slot {id} />
</form>
