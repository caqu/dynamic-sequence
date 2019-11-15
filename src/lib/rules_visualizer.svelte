<script>
  export let rule_set;

  const handleClick = function() {
    alert("Work in progress");
  };
  const handleClickAddRule = function() {
    alert(
      'Work in progress\
Merchants will be able to add a rule delivered at runtime via websockets\
like "if cart has jeans, offer instant savings widget".\
      '
    );
  };
</script>

<style>
  .rules_visualizer {
    padding: 0.25rem;
    font-size: 10px;
    min-width: 25vw;
    max-width: 50vw;
    overflow: auto;
  }
  .rules_visualizer div {
    padding: 0 0.25rem;
  }
  .rules_visualizer ol {
    padding: 0 0.25rem 0 1rem;
  }
</style>

<div class="rules_visualizer">
  <div alt="All rules are run in order ">Rules</div>
  <ol style="margin:0">
    {#each $rule_set as { predicate, consequence }}
      <li>
        <b>if</b>
        {predicate}
        <b>then</b>
        {consequence} --
        <a href="#editing_rule" on:click={handleClick}>edit</a>
      </li>
    {/each}
    <li>
      <a href="#adding_rule" on:click={handleClickAddRule}>Add rule</a>
    </li>

  </ol>
</div>
