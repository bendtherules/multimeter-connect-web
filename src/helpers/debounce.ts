export function debounceReadingFunc(
  callbackFn: (input: string | number) => void,
  debounceMillis = 1000,
) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastReturnedValue: number | string | undefined = undefined;
  let lastNewValue: number | string | undefined = undefined;

  return function debouncedReading(newValue: string | number | undefined) {
    if (newValue !== undefined && newValue !== lastNewValue) {
      if (timerId !== undefined) {
        clearTimeout(timerId);
        timerId = undefined;
      }

      if (newValue !== lastReturnedValue) {
        timerId = setTimeout(() => {
          lastReturnedValue = newValue;
          timerId = undefined;

          callbackFn(newValue);
        }, debounceMillis);
      }
    }
    lastNewValue = newValue;
  };
}
