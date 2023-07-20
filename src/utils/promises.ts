export async function promiseTimeout(
  promise: Promise<any>,
  timeoutInMilliseconds: number,
) {
  return Promise.race([
    promise,
    new Promise(function (_resolve, reject) {
      setTimeout(function () {
        reject("timeout");
      }, timeoutInMilliseconds);
    }),
  ]);
}
