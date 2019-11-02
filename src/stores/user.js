// import { writable } from "svelte/store";

// let initial_user = JSON.parse(sessionStorage.getItem("user"));
// if (!initial_user) {
//   initial_user = {
//     first_name: "",
//     last_name: "",
//     email: ""
//   };
// }
// export const user = writable(initial_user);
// export const setUser = user => {
//   sessionStorage.setItem("user", JSON.stringify(user));
// };
// export const set_first_name = first_name => {
//   user.update(_user => ({ ..._user, first_name }));
// };
