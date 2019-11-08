<script>
  import { onMount, setContext } from "svelte";
  import { fly, scale } from "svelte/transition";
  import { quintOut, expoOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { default as LoadingAnimation } from "./loading_animation.svelte";

  // handler is a Function that returns a Promise,
  // if you don't provide one, this default handler resolves immediately.
  export let handler = function() {
    return new Promise(function(resolve, reject) {
      resolve();
    });
  };

  let pending = false;
  let move_to_next_question_interval_id;

  function superHandler(event) {
    event.preventDefault();
    pending = true;
    if (typeof handler === "function") {
      handler(event);
    } else {
      throw new Error("Please send in a handler function");
    }
  }
  // OLD
  // function handleSubmission(event) {
  //   // Store the Input given by the user to the Prompt.
  //   use r_inputs.update(function(I) {
  //     const n = {};
  //     n[event.target.id] = document.activeElement.value;
  //     return { ...I, ...n };
  //   });
  //   //
  //   // TODO what if i need to roll back?
  //   //
  //   if (typeof handler === "function") {
  //     const h = handler(event);
  //     if (h instanceof Promise) {
  //       h.then().catch();
  //     }
  //   }
  // }
  // let _store = JSON.stringify($use r_inputs);

  let component;
  onMount(function(o) {
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

<!-- on:submit={handleSubmission} -->
<form
  bind:this={component}
  {...$$props}
  on:submit={superHandler}
  in:fly={{ y: 50, duration: 1600, easing: quintOut }}
  out:scale={{ duration: 1600, opacity: 0.9, start: 0, easing: expoOut }}>
  <slot />
  {#if pending}
    <LoadingAnimation />
  {/if}
</form>
