/**
 * return function which will call "func" only once in delay
 * @param func
 * @param delay in milliseconds
 */
export function throttle(func: Function, delay: number) {
  let lastArgs: Array<any>;
  let timeout: any;
  return (...args: Array<any>) => {
    lastArgs = args;
    if (!timeout) {
      timeout = setTimeout(() => {
        func(...lastArgs);
        clearTimeout(timeout);
        timeout = null;
      }, delay + 1);
      return;
    }
    // if (now.getTime() - lastCall.getTime() < delay) {
    //   console.log("--------------------------------------------------------- EXEC");
    //   func(lastArgs);
    //   lastCall = new Date();
    // }
  }
}
