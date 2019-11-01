export function Join(...promises) {
  debugger;
  return Promise.all([...promises]).then(() => {
    // Next activity
    debugger;
  });
}
