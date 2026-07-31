// ==========================================
// IMPORTS
// ==========================================

import { Link } from "react-router-dom";

import ktchn from "../assets/images/kitcn 1.webp";
import messi from "../assets/images/messi.jpg";

import ProductCard from "../components/ProductCard";
import products from "../data/products";
// ==========================================
// PRODUCTS PAGE
// ==========================================

function Products() {
  return (
    <div style={{ padding: "30px" }}>
      {/* ==========================================
          PAGE TITLE
      ========================================== */}

      <h1>🛍️ Our Products</h1>

      {/* ==========================================
          PRODUCTS CONTAINER
      ========================================== */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >

        {/* ==========================================
            PRODUCT 1 - KITCHEN BLENDER
        ========================================== */}
{/* Show all products from products.js */}

{products.map((product) => (
  <ProductCard
    key={product.id}
    image={product.image}
    title={product.title}
    category={product.category}
    price={product.price}
  />
))}

      </div>
    </div>
  );
}

// ==========================================
// EXPORT
// ==========================================

export default Products;