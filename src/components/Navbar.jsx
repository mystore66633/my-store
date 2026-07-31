// ==========================================
// IMPORTS
// ==========================================

import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// ==========================================
// NAVBAR
// ==========================================

function Navbar() {
  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav
      style={{
        background: "#1976d2",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {/* Logo */}
      <h2
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        🛍️ Nishan Store
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search (Coming Soon)"
        disabled
        style={{
          padding: "10px",
          width: "250px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          opacity: 0.7,
          cursor: "not-allowed",
        }}
      />

      {/* Menu */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          🏠 Home
        </Link>

        <Link
          to="/products"
          style={{ color: "white", textDecoration: "none" }}
        >
          🛍 Products
        </Link>

        <Link
          to="/categories"
          style={{ color: "white", textDecoration: "none" }}
        >
          📂 Categories
        </Link>

        <Link
          to="/cart"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🛒 Cart ({totalItems})
        </Link>

        <Link
          to="/profile"
          style={{ color: "white", textDecoration: "none" }}
        >
          👤 Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;