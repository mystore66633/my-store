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
  // LOAD CART FROM LOCALSTORAGE ON STARTUP
  // ==========================================
  // Initialize state with cart from localStorage if it exists,
  // otherwise use empty array. This runs once when component mounts.

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

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
  // SAVE CART TO LOCALSTORAGE WHENEVER IT CHANGES
  // ==========================================
  // This useEffect runs whenever the `cart` state changes.
  // It automatically saves the updated cart to localStorage as JSON.
  // This ensures data persists even if user closes/refreshes the browser.

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

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