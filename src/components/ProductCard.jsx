function ProductCard({ image, title, category, price }) {
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

      <h3>{title}</h3>

      <p style={{ color: "#666" }}>{category}</p>

      <h2 style={{ color: "#1976d2" }}>₹{price}</h2>

      <button
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

export default ProductCard;