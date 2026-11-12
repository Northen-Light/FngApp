import { useEffect, useRef, useState } from 'react';

export const useThrottle = <T>(value: T, threshold: number = 400) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const isThrottled = useRef(false);
  const lastInput = useRef<T | null>(null);

  useEffect(() => {
    if (!isThrottled.current) {
      setThrottledValue(value);
      isThrottled.current = true;

      setTimeout(() => {
        if (lastInput.current !== null) {
          setThrottledValue(lastInput.current);
          lastInput.current = null;
        }
        isThrottled.current = false;
      }, threshold);
    } else {
      lastInput.current = value;
    }
  }, [value, threshold]);

  return throttledValue;
};
