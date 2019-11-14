function limit(action, allowed_times) {
  return function(...args) {
    if (allowed_times >= 1) {
      allowed_times -= 1;
      return action(args);
    }
    return undefined;
  };
}
export default Object.freeze({
  limit
});
