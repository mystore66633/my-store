// ==========================================
// IMPORTS
// ==========================================

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

// ==========================================
// NAVBAR
// ==========================================

function Navbar() {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const getNavLinkStyle = (isBold = false) => ({ isActive }) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: isActive || isBold ? "bold" : "normal",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0",
  });

  const renderNavLink = (to, content, isBold = false) => (
    <NavLink to={to} end={to === "/"} style={getNavLinkStyle(isBold)}>
      {({ isActive }) => (
        <>
          <span>{content}</span>
          <span
            className={`navbar-indicator${isActive ? " active" : ""}`}
            aria-hidden="true"
          />
        </>
      )}
    </NavLink>
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
        onFocus={(event) => {
          event.currentTarget.style.outline = "2px solid #1976d2";
        }}
        onBlur={(event) => {
          event.currentTarget.style.outline = "none";
        }}
        style={{
          height: "44px",
          padding: "0 12px",
          width: "min(300px, 100%)",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "outline 0.2s ease, box-shadow 0.2s ease",
          boxSizing: "border-box",
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
        {renderNavLink("/", "🏠 Home")}
        {renderNavLink("/products", "🛍 Products")}
        {renderNavLink("/cart", `🛒 Cart (${totalItems})`, true)}
        {renderNavLink("/wishlist", `❤️ Wishlist (${wishlist.length})`, true)}
        {renderNavLink("/orders", "📦 My Orders", true)}
        {renderNavLink("/profile", "👤 Profile")}
      </div>
    </nav>
  );
}

export default Navbar;