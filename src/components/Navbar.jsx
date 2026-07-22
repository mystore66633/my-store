import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "15px 20px",
        background: "#1976d2",
        color: "#fff",
        gap: "15px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "28px",
        }}
      >
        Nishan
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
          Products
        </Link>

        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
          Cart
        </Link>

        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          Orders
        </Link>

        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
