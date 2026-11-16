import { ReactElement, useState } from 'react';
import { createSafeContext } from '../context';
import type { Product } from '../types';

type State = Map<number, Product>;

const [ProductDataContext, useProductData] = createSafeContext<{
  productData: State;
  setProductData: React.Dispatch<React.SetStateAction<State>>;
}>('ProductData');

export function ProductDataProvider({ children }: { children: ReactElement }) {
  const [productData, setProductData] = useState<State>(new Map());

  return (
    <ProductDataContext.Provider value={{ productData, setProductData }}>
      {children}
    </ProductDataContext.Provider>
  );
}

export { useProductData };
