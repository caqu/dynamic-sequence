<script>
  import { writable } from "svelte/store";
  const load_then_mount = function({ component_name }) {
    import(`/bundles/${component_name}.js`).then(mount);
  };
  const mount = function(module) {
    component.set(module.default);
  };

  let component = writable();
  load_then_mount({ component_name: "brand_intro" });
  setTimeout(function(params) {
    load_then_mount({ component_name: "explain_experience" });
  }, 3000);
</script>

<svelte:component this={$component} />
