// import { writable } from "svelte/store";

// const name = "user_inputs"; // TODO avoid name collisions on sites with multiple Apps (on any page)

// let initial_values;
// try {
//   initial_values = JSON.parse(sessionStorage.getItem(name));
//   if (initial_values == undefined) {
//     throw new Error("initial value of " + name + " is undefined");
//   }
// } catch (error) {
//   console.warn(error);
//   // * Initial values could be retrieved from a server or a global variable
//   initial_values = {
//     sample: "dragons"
//   };
//   sessionStorage.setItem(name, JSON.stringify(initial_values));
// }

// export const user_inputs = writable(initial_values);
