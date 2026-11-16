import { createContext, useContext } from 'react';

export const createSafeContext = <T>(name: string) => {
  const context = createContext<T | null>(null);
  context.displayName = name;

  const useSafeContext = (): T => {
    const value = useContext(context);
    if (value === null) {
      throw new Error(`use${name} must be within ${name}Provider`);
    }
    return value;
  };

  return [context, useSafeContext] as const;
};
