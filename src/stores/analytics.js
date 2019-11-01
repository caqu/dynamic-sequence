import { user_inputs } from "./user_inputs.js";
user_inputs.subscribe(value => {
  debugger;
  // Report to analytics
  sessionStorage.setItem("events", getEvents() + `${key}: ${value}; `);
});
