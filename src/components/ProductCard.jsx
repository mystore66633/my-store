// ==========================================
// IMPORTS
// ==========================================

import { useContext } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

// ==========================================
// PRODUCT CARD COMPONENT
// ==========================================

function ProductCard({ image, title, category, price }) {
  // Get addToCart function from CartContext
  const { addToCart } = useContext(CartContext);

  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  const handleAddToCart = () => {
    addToCart({
      image,
      title,
      category,
      price,
    });

    // Show notification
    toast.success(`${title} added to cart!`);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "320px",
        margin: "auto",
      }}
    >
      {/* ==========================================
          PRODUCT IMAGE
      ========================================== */}

      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      {/* ==========================================
          PRODUCT TITLE
      ========================================== */}

      <h3>{title}</h3>

      {/* ==========================================
          PRODUCT CATEGORY
      ========================================== */}

      <p style={{ color: "#666" }}>{category}</p>

      {/* ==========================================
          PRODUCT PRICE
      ========================================== */}

      <h2 style={{ color: "#1976d2" }}>₹{price}</h2>

      {/* ==========================================
          ADD TO CART BUTTON
      ========================================== */}

      <button
        onClick={handleAddToCart}
        style={{
          width: "100%",
          padding: "12px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

// ==========================================
// EXPORT
// ==========================================

export default ProductCard;