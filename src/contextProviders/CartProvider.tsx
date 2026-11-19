import { ReactElement, useReducer } from 'react';
import { createSafeContext } from '../context';

type State = {
  items: Record<string, { quantity: number; amount: number }>;
  totalQuantity: number;
  totalAmount: number;
};
export type Action = {
  type: 'INCREMENT' | 'DECREMENT';
  payload: {
    id: number;
    price: number;
  };
};

const [CartContext, useCart] = createSafeContext<{
  cartState: State;
  dispatch: (action: Action) => void;
}>('Cart');

const defaultState: State = {
  items: {},
  totalQuantity: 0,
  totalAmount: 0,
};

const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT': {
      const next = {
        ...state,
        items: {
          ...state.items,
        },
      };

      if (action.payload.id in next.items) {
        next.items[action.payload.id] = {
          ...next.items[action.payload.id],
        };

        next.items[action.payload.id].quantity++;
        next.items[action.payload.id].amount += action.payload.price;
      } else {
        next.items[action.payload.id] = {
          quantity: 1,
          amount: action.payload.price,
        };
      }
      next.totalQuantity++;
      next.totalAmount += action.payload.price;
      return next;
    }

    case 'DECREMENT': {
      const next = {
        ...state,
        items: {
          ...state.items,
        },
      };

      if (next.items[action.payload.id].quantity > 0) {
        next.items[action.payload.id] = {
          ...next.items[action.payload.id],
        };

        next.items[action.payload.id].quantity--;
        next.items[action.payload.id].amount -= action.payload.price;
        next.totalQuantity--;
        next.totalAmount -= action.payload.price;

        if (next.items[action.payload.id].quantity === 0) {
          delete next.items[action.payload.id];
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
