import { writable } from "svelte/store";

const initial_form_id = sessionStorage.getItem("progress") || "";
export const last_open_form_id = writable(initial_form_id);
