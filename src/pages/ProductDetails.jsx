// ==========================================
// IMPORTS
// ==========================================

import ktchn from "../assets/images/kitcn 1.webp";


// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

function ProductDetails() {
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >

      {/* ==========================================
          PAGE TITLE
      ========================================== */}

      <h1>Kitchen Blender</h1>

      {/* ==========================================
          PRODUCT IMAGE
      ========================================== */}

      <img
        src={ktchn}
        alt="Kitchen Blender"
        style={{
          width: "350px",
          borderRadius: "10px",
        }}
      />

      {/* ==========================================
          PRODUCT PRICE
      ========================================== */}

      <h2 style={{ color: "#1976d2" }}>
        ₹2,499
      </h2>

      {/* ==========================================
          PRODUCT DESCRIPTION
      ========================================== */}

      <p>
        Powerful kitchen blender with multiple speed settings.
        Perfect for juices, smoothies and cooking.
      </p>

      {/* ==========================================
          BUTTONS
      ========================================== */}

      <button>
        Add to Cart
      </button>

      <button
        style={{
          marginLeft: "10px",
        }}
      >
        Buy Now
      </button>

    </div>
  );
}


// ==========================================
// EXPORT
// ==========================================

export default ProductDetails;