import { ReactElement, useReducer } from 'react';
import { createSafeContext } from '../context';

type State = Record<string, { quantity: number }>;
type Action = {
  type: 'INCREMENT' | 'DECREMENT';
  payload: {
    id: number;
  };
};

const [CartContext, useCart] = createSafeContext<{
  cartState: State;
  dispatch: (action: Action) => void;
}>('Cart');

const defaultState = {};

const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT': {
      const next = { ...state };
      if (action.payload.id in next) {
        next[action.payload.id].quantity++;
      } else {
        next[action.payload.id] = {
          quantity: 1,
        };
      }
      return next;
    }

    case 'DECREMENT': {
      const next = { ...state };
      if (next[action.payload.id].quantity > 0) {
        next[action.payload.id].quantity--;
        if (next[action.payload.id].quantity === 0) {
          delete next[action.payload.id];
        }
      }
      return next;
    }
  }
};

export const CartProvider = ({ children }: { children: ReactElement }) => {
  const [cartState, dispatch] = useReducer(cartReducer, defaultState);

  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { useCart };
