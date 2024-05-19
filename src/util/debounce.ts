export function debounce(func: any) {
  //@ts-ignore
  let timerId;

  return function (...args: any) {
    //@ts-ignore
    const context = this;

    //@ts-ignore
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, 1000);
  };
}
