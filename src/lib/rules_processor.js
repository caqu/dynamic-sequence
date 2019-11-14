import fn from "./functional_utilities";

//
export default function rules_processor(spec) {
  const { control_flow = [] } = spec;
  const rules = [];
  const process = function process() {
    fn.limit(action, 1);
  };
  when(predicate, limit(transform(control_flow), 1));

  //
  // Security warning: avoid `rules.method()` form!
  //
  const when = function when(predicate, mutate_control_flow) {};
  return Object.freeze({
    addRule,
    process
  });
}
