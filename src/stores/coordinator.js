//
// Abandon ship... use parseq!
//

import { writable } from "svelte/store";

const name = "coordinator"; // TODO avoid name collisions on sites with multiple Coordinators
let initial_values;
try {
  initial_values = JSON.parse(sessionStorage.getItem(name));
  if (!Array.isArray(initial_values)) {
    throw new Error("sessionStorage", name, "not an array");
  }
} catch (error) {
  console.warn(error);
  // * Initial values could be retrieved from a server or a global variable
  initial_values = ["opening_interaction", "first_name", "last_name"];
  sessionStorage.setItem(name, JSON.stringify(initial_values));
}

// export const planned_interactions = writable(initial_values);
export const error_messages = writable([]);

function restorePlace() {
  // let initialize_form;
  // // initialize_form = document.querySelector("form");
  // initialize_form = document.getElementById("opening_interaction");
  // initialize_form.classList.add("active");
  // initialize_form.focus();
  // console.log("App store progress", $user_inputs.progress);
  // sessionStorage.setItem("progress", nextFormId);
}

/**
 *
 */
export function handleInteractionCompleted() {
  // Remove the first planned interaction because it's completed.
  planned_interactions.update(I => I.slice(1));
}

// export const RoadMap = {
//   sequence: planned_interactions.map(i => ({
//     name: i,
//     status: pending
//   })),
//   // get length() {
//   //   return this.sequence.length;
//   // },
//   mark_as_completed: interaction_id => {
//     // WARNING lots o' mutation around here!
//     this.sequence.filter(i => interaction_id == i).status = completed;
//   },
//   // set next(str) {
//   //   this.addNext(str);
//   // },
//   get next() {
//     const next = this.sequence[1];
//     return next.name;
//   }
//   // add_next(str) {
//   // TODO validate that str is something that exists.
//   //   this.sequence.unshift({ name: str, status: pending });
//   // },
//   // add_last(str) {
//   //   debugger;
//   // }
// };

function getEvents() {
  return sessionStorage.getItem("events") || "";
}

//  Decide what's our Next destination
// - Set in sessionStorage        - OK
// - Post to API server           - TODO
// - Feedback                     -
// - Connect (Automatic Forward)
// - Forward button
// - Re-do button.
// - Catch(es) (
//   Re-Prompt,
//   Show error,
//   Show alternative path
// )
function decide_next_destination(key, value) {
  // RoadMap, Rules Engine
  debugger;

  // Sync internal memory
  // what? give me an example...
  store.update(store => {
    debugger;
    const key_value = {};
    key_value[key] = value;
    return Object.assign({ ...store }, key_value);
  });

  // Sync with persistant sources
  const data = JSON.parse(sessionStorage.getItem(store_name));
  data[key] = value;
  sessionStorage.setItem(store_name, JSON.stringify(data));
}
export const is_showing_feedback = writable(false);

export function clearFeedback() {
  is_showing_feedback.set(false);
  error_messages.set([]);
}
