import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, action.product.stock) }
            : i
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter((i) => i.id !== action.id);
      return state.map((i) =>
        i.id === action.id
          ? { ...i, quantity: Math.min(action.qty, i.stock) }
          : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        return JSON.parse(localStorage.getItem('cart')) || [];
      } catch {
        return [];
      }
    }
  );

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart     = (product) => dispatch({ type: 'ADD', product });
  const removeFromCart = (id)     => dispatch({ type: 'REMOVE', id });
  const updateQty     = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart     = ()        => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
