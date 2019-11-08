<script>
  export let props;
</script>

<div>Bye, bye {$props.first_name || ''} {$props.last_name || ''}</div>
<button
  style="padding:0 1rem"
  on:click={function() {
    window.location.reload();
  }}>
  Reload &#x21bb;
</button>
