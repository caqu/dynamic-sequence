import app from "./app.svelte";

export default new app({
  target: document.body, // * You could target a specific DOM element here
  props: {
    // assets_path: "/"
  }
});
