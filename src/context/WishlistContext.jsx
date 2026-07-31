// ==========================================
// IMPORTS
// ==========================================

import { createContext, useState } from "react";

// ==========================================
// CREATE CONTEXT
// ==========================================

export const WishlistContext = createContext();

// ==========================================
// WISHLIST PROVIDER
// ==========================================

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

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
