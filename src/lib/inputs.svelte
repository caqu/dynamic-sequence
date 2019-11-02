<script>

</script>

<style>
  :global(input:not([type])),
  input[type=""],
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    border: 0;
    border-bottom: 1px solid;
    padding: 0.25em 0.5em;
    font-family: sans-serif;
    /* border-radius: 0.125em; */
    width: 100%;
  }
  :global(input[path="happy"]) {
    background: black;
    border-color: black;
    color: white;
  }
  input[type="submit"] {
    font-family: sans-serif;
    margin-right: 1rem;
    padding: 0.25em 0.75em;
  }
  button,
  input[type="button"] {
    /* Warning! Use input type submit */
    font-family: serif;
    color: red;
    background: brown;
    border: blue;
    content: attr("This!!");
  }
  :global(input:not([type]):focus),
  input[type=""]:focus,
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="password"]:focus {
    outline: none;
    background: #fffbea;
  }
  input::placeholder {
    font-style: italic;
  }
</style>

<div class="inputs">
  <slot />
</div>
