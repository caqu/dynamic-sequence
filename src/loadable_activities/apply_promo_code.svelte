<script>
import I from "../lib/interaction.js";
const { Interaction, Prompt, Inputs, Feedback } = I;

export let decision;
export let props;

function handler() {
  decision(true);
}
</script>

<style>
input {
  font-style: monospace;
}
</style>

<Interaction {handler}>
  Got a promo code?
  <input placeholder="000-000" />
  <button>Nope</button>
</Interaction>
