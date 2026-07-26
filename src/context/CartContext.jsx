// ==========================================
// IMPORTS
// ==========================================

import { createContext, useState } from "react";

// ==========================================
// CREATE CONTEXT
// ==========================================

export const CartContext = createContext();

// ==========================================
// CART PROVIDER
// ==========================================

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.title === product.title
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.title === product.title
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}