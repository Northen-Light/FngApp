import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number = 400) => {
  const [debouncedValue, setDebouncedvalue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedvalue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
