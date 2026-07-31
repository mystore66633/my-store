// ==========================================
// IMPORTS
// ==========================================

import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

// ==========================================
// WISHLIST PAGE
// ==========================================

function Wishlist() {
  const { wishlist, removeWishlistItem } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  // ==========================================
  // ADD WISHLIST ITEM TO CART
  // ==========================================

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>💖 Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p style={{ color: "#666", marginTop: "20px" }}>
          Your wishlist is empty.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {wishlist.map((product) => (
            <div
              key={product.title}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                width: "280px",
                background: "#fff",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h3 style={{ marginTop: "10px" }}>{product.title}</h3>
              <p style={{ color: "#666" }}>{product.category}</p>
              <h3 style={{ color: "#1976d2" }}>₹{product.price}</h3>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    removeWishlistItem(product.title);
                    toast.info(`${product.title} removed from wishlist.`);
                  }}
                  style={{
                    padding: "10px",
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/products" style={{ color: "#1976d2" }}>
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Wishlist;
