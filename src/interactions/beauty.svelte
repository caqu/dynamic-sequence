<script>
  export let props; // a writable store
  export let callback = () => console.log("please define me parent");

  const yes = () => {
    props.update(p => {
      p.main_sequence.update(ms => {
        return ms.filter(a => a != "LastName" && a != "Beauty");
      });
      return {
        ...$props,
        beauty: "yes"
        // Sample remove FirstName from seq
      };
    });
    callback(true);
  };
  const no = () => {
    props.update(p => ({ ...$props, beauty: "no" }));
    callback(true);
  };
  const ignore = () => {
    callback(true);
  };
</script>

<div>
  <div>Isn't this a {$props.adjective || 'gorgeous'} sunset?</div>
  <button on:click={yes}>Yes</button>
  <button on:click={no}>No</button>
  <button on:click={ignore}>Ignore</button>
</div>
