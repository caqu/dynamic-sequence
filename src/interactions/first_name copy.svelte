<script>
  import I from "../lib/interaction.js";
  import { user_inputs } from "../stores/user_inputs.js";
  import { error_messages, clearFeedback } from "../stores/coordinator.js";
  const { Interaction, Prompt, Inputs, Feedback, ErrorMessage } = I;

  function handler(event) {
    return new Promise((resolve, reject) => {
      if ($user_inputs.first_name == "") {
        error_messages.update(m => [...m, "123abc"]);
      }
      if ($error_messages.length) {
        reject();
      } else {
        resolve();
      }
    });
  }
</script>

<Interaction id="first_name" {handler}>
  <Prompt>What is your first name?</Prompt>
  <Inputs>
    <input
      placeholder=""
      on:keydown={() => {
        clearFeedback();
      }}
      value={$user_inputs ? $user_inputs.first_name || '' : 'uh-uh'} />
    <!-- // TODO debounce clear Feedback -->
  </Inputs>
  <Feedback>
    <ErrorMessage code="123abc">
      I need your name so I can know to whom I should deliver your order.
    </ErrorMessage>
  </Feedback>
</Interaction>
