import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Products({ searchTerm = "" }) {
  const [searchParams] = useSearchParams();
  const categories = ["All", "Kitchen", "Home", "Electronics", "Fashion"];
  const categoryFromRoute = searchParams.get("category");
  const initialCategory = categories.includes(categoryFromRoute)
    ? categoryFromRoute
    : "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("default");
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    const query = (searchTerm || localSearchTerm).trim().toLowerCase();

    const matchingProducts = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortOrder === "price-low") {
      return [...matchingProducts].sort(
        (first, second) => first.price - second.price
      );
    }

    if (sortOrder === "price-high") {
      return [...matchingProducts].sort(
        (first, second) => second.price - first.price
      );
    }

    if (sortOrder === "name") {
      return [...matchingProducts].sort((first, second) =>
        first.title.localeCompare(second.title)
      );
    }

    return matchingProducts;
  }, [localSearchTerm, searchTerm, selectedCategory, sortOrder]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>🛍️ Our Products</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "10px 16px",
              background:
                selectedCategory === category ? "#1976d2" : "#fff",
              color: selectedCategory === category ? "#fff" : "#1976d2",
              border: "1px solid #1976d2",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          type="search"
          value={localSearchTerm}
          onChange={(event) => setLocalSearchTerm(event.target.value)}
          placeholder="Search products"
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Sort products"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="default">Sort by</option>
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              category={product.category}
              price={product.price}
            />
          ))
        ) : (
          <p style={{ color: "#666", fontSize: "18px" }}>No products found</p>
        )}
      </div>
    </div>
  );
}

export default Products;
