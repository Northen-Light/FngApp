import { produce } from 'immer';
import { create } from 'zustand';

type State = {
  items: Record<string, { quantity: number; amount: number }>;
  totalQuantity: number;
  totalAmount: number;
};

const defaultState: State = {
  items: {},
  totalQuantity: 0,
  totalAmount: 0,
};

export const useCartData = create<State>()(() => defaultState);

export const increment = (id: number, price: number) =>
  useCartData.setState(state =>
    produce(state, draft => {
      if (id in draft.items) {
        draft.items[id].quantity++;
        draft.items[id].amount += price;
      } else {
        draft.items[id] = {
          quantity: 1,
          amount: price,
        };
      }
      draft.totalQuantity++;
      draft.totalAmount += price;
    }),
  );

export const decrement = (id: number, price: number) =>
  useCartData.setState(state =>
    produce(state, draft => {
      if (draft.items[id].quantity > 0) {
        draft.items[id].quantity--;
        draft.items[id].amount -= price;
        draft.totalQuantity--;
        draft.totalAmount -= price;

        if (draft.items[id].quantity === 0) {
          delete draft.items[id];
        }
      }
    }),
  );

export const reset = () => useCartData.setState(defaultState);
