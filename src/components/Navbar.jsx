import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        background: "#1976d2",
        color: "#fff",
      }}
    >
      <h2>My Store</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        <Link to="/products" style={{ color: "white" }}>Products</Link>
        <Link to="/cart" style={{ color: "white" }}>Cart</Link>
        <Link to="/orders" style={{ color: "white" }}>Orders</Link>
        <Link to="/profile" style={{ color: "white" }}>Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;