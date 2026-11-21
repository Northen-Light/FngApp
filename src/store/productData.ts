import { create } from 'zustand';
import type { Product } from '../types';

type State = {
  productData: Map<number, Product>;
  setProductData: (productList: Product[]) => void;
};

export const useProductData = create<State>()(set => ({
  productData: new Map(),
  setProductData: productList =>
    set(() => {
      const next = { productData: new Map() };
      productList.forEach(product => next.productData.set(product.id, product));
      return next;
    }),
}));
