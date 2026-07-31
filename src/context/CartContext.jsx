// ==========================================
// IMPORTS
// ==========================================

import { createContext, useState, useEffect } from "react";

// ==========================================
// CREATE CONTEXT
// ==========================================

export const CartContext = createContext();

// ==========================================
// CART PROVIDER
// ==========================================

export function CartProvider({ children }) {
  // ==========================================
  // LOAD CART FROM LOCALSTORAGE
  // ==========================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // ==========================================
  // SAVE CART TO LOCALSTORAGE
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.title === product.title
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.title === product.title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
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