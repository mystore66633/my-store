// ==========================================
// IMPORTS
// ==========================================

import { createContext, useEffect, useState } from "react";

// ==========================================
// CREATE CONTEXT
// ==========================================

export const WishlistContext = createContext();

// ==========================================
// WISHLIST PROVIDER
// ==========================================

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlist]);

  // ==========================================
  // ADD OR REMOVE FROM WISHLIST
  // ==========================================

  const toggleWishlistItem = (product) => {
    const exists = wishlist.some((item) => item.title === product.title);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.title !== product.title));
      return "removed";
    }

    setWishlist([...wishlist, product]);
    return "added";
  };

  // ==========================================
  // REMOVE ITEM FROM WISHLIST
  // ==========================================

  const removeWishlistItem = (title) => {
    setWishlist(wishlist.filter((item) => item.title !== title));
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlistItem,
        removeWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
