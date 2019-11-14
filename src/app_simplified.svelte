<script>
  // Sample of loading and mounting an externally loaded module
  const load_then_mount = function({ component_name }) {
    import(`/bundles/${component_name}.js`).then(mount);
  };
  const mount = function(module) {
    component = module.default;
  };

  let component;
  load_then_mount({ component_name: "brand_intro" });
</script>

<svelte:component this={component} />
