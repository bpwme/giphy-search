export const useDebouncedValue = <T>(
  value: Ref<T>, 
  delay: number = 500
) => {
  const debouncedValue = ref<T>(value.value);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  watch(value, (newValue) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return { debouncedValue };
}