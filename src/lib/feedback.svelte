<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  // import { user_inputs } from "../stores/user_inputs.js";
  import { interaction } from "../stores/contexts.js";
  let { id, is_showing_feedback, count_down } = getContext(interaction);
</script>

<style>
  /* label.error {
    color: red;
    display: none;
  } */
</style>

<!-- Should feedback be shown? -->
{#if $is_showing_feedback}
  <div class="feedback" 
  in:fade out:fade>
    <slot />
  </div>
{/if}
<!-- <pre>
{id}
{$user_inputs[id]}
{$is_showing_feedback}
</pre> -->
