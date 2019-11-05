<script>
  export let rule_set;
</script>

<style>
  .rules_visualizer {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.5);
    border-radius: 1rem 1rem 0 0;
    padding: 0.25rem;
    font-size: 10px;
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
    {#each $rule_set as { condition, action }}
      <li>
        <b>if</b>
        {condition}
        <b>then</b>
        {action} --
        <a href="#editing_rule" on:click={() => alert('Work in progress')}>
          edit
        </a>
      </li>
    {/each}
    <li>
      <a href="#adding_rule" on:click={() => alert('Work in progress\
Merchants will be able to add a rule delivered at runtime via websockets\
like "if cart has jeans, offer instant savings widget".\
      ')}>
        Add rule
      </a>
    </li>

  </ol>
</div>
