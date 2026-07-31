// ==========================================
// IMPORTS
// ==========================================

import { useParams } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import products from "../data/products";

// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

function ProductDetails() {
  // ==========================================
  // GET PRODUCT ID FROM URL PARAMETER
  // ==========================================
  // useParams() extracts the :id parameter from the URL
  // Example: /product/1 → { id: "1" }

  const { id } = useParams();

  // ==========================================
  // FIND MATCHING PRODUCT FROM DATA
  // ==========================================
  // Convert id from string to number and find product with matching id
  // parseInt() converts "1" → 1 for comparison

  const product = products.find((p) => p.id === parseInt(id));

  // ==========================================
  // GET ADD TO CART FUNCTION
  // ==========================================

  const { addToCart } = useContext(CartContext);

  // ==========================================
  // HANDLE ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        image: product.image,
        title: product.title,
        category: product.category,
        price: product.price,
      });
      toast.success(`${product.title} added to cart!`);
    }
  };

  // ==========================================
  // PRODUCT NOT FOUND FALLBACK
  // ==========================================

  if (!product) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1>❌ Product Not Found</h1>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  // ==========================================
  // RENDER PRODUCT DETAILS
  // ==========================================

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      {/* ==========================================
          PRODUCT LAYOUT - IMAGE & DETAILS SIDE BY SIDE
      ========================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* LEFT SIDE - PRODUCT IMAGE */}

        <div>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* RIGHT SIDE - PRODUCT INFO */}

        <div>
          {/* ==========================================
              PRODUCT TITLE
          ========================================== */}

          <h1 style={{ marginBottom: "10px" }}>{product.title}</h1>

          {/* ==========================================
              PRODUCT CATEGORY
          ========================================== */}

          <p
            style={{
              color: "#666",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            Category: <strong>{product.category}</strong>
          </p>

          {/* ==========================================
              PRODUCT PRICE
          ========================================== */}

          <h2 style={{ color: "#1976d2", marginBottom: "20px", fontSize: "36px" }}>
            ₹{product.price}
          </h2>

          {/* ==========================================
              PRODUCT DESCRIPTION
          ========================================== */}

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#555",
              marginBottom: "30px",
            }}
          >
            {product.description}
          </p>

          {/* ==========================================
              ACTION BUTTONS
          ========================================== */}

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={handleAddToCart}
              style={{
                padding: "15px 35px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                flex: 1,
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              style={{
                padding: "15px 35px",
                background: "#fff",
                color: "#1976d2",
                border: "2px solid #1976d2",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                flex: 1,
              }}
            >
              ❤️ Add to Wishlist
            </button>
          </div>

          {/* ==========================================
              PRODUCT INFO BOX
          ========================================== */}

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p>✅ In Stock</p>
            <p>🚚 Free shipping on orders above ₹500</p>
            <p>🔄 30-day return policy</p>
            <p>💳 Cash on Delivery available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXPORT
// ==========================================

export default ProductDetails;