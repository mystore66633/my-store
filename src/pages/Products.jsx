import ktchn from "../assets/images/kitcn 1.webp";

function Products() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🛍️ Our Products</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "30px",
        }}
      >
        {/* Product 1 */}
        <div
          style={{
            width: "220px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <img
  src={ktchn}
  alt="Kitchen Blender"
  style={{
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "8px",
}}
/>
          <h3>Kitchen Blender</h3>
          <p>₹2,499</p>

          <button
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Product 2 */}
        <div
          style={{
            width: "220px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/200"
            alt="Home Lamp"
            style={{ width: "100%" }}
          />
          <h3>Home Lamp</h3>
          <p>₹1,299</p>

          <button
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Product 3 */}
        <div
          style={{
            width: "220px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/200"
            alt="Wireless Headphones"
            style={{ width: "100%" }}
          />
          <h3>Wireless Headphones</h3>
          <p>₹3,999</p>

          <button
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Product 4 */}
        <div
          style={{
            width: "220px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/200"
            alt="Men's T-Shirt"
            style={{ width: "100%" }}
          />
          <h3>Men's T-Shirt</h3>
          <p>₹799</p>

          <button
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;