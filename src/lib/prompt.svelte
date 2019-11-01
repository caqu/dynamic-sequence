<script>
  import { getContext } from "svelte";
  import { interaction } from "../stores/contexts.js";
  import { user_inputs } from "../stores/user_inputs.js";
  let { id, is_showing_feedback } = getContext(interaction);
</script>

<style>
  label {
    display: block;
    font-family: monospace;
  }
</style>

<label>
  <slot />
</label>
