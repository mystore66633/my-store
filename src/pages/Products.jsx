// ==========================================
// IMPORTS
// ==========================================

import { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

// ==========================================
// PRODUCTS PAGE
// ==========================================

function Products() {
  // ==========================================
  // SEARCH STATE
  // ==========================================
  // Stores the user's search input
  // State updates in real-time as user types

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // CATEGORY FILTER STATE
  // ==========================================
  // Stores the selected category filter
  // "All" means no category filter applied
  // "Kitchen", "Electronics", etc. means filter by that category

  const [selectedCategory, setSelectedCategory] = useState("All");

  // ==========================================
  // SORT STATE
  // ==========================================
  // Stores the selected sort option
  // Options: "Default", "Price (Low to High)", "Price (High to Low)", "Name (A–Z)", "Name (Z–A)"
  // Starts with "Default" (no sorting applied)

  const [sortBy, setSortBy] = useState("Default");

  // ==========================================
  // SORT OPTIONS DROPDOWN DATA
  // ==========================================
  // Array of available sort options
  // Easy to maintain if we want to add more options later

  const sortOptions = [
    "Default",
    "Price (Low to High)",
    "Price (High to Low)",
    "Name (A–Z)",
    "Name (Z–A)",
  ];

  // ==========================================
  // GET UNIQUE CATEGORIES FROM PRODUCTS
  // ==========================================
  // useMemo ensures this only recalculates if products array changes
  // Extracts all unique categories from the products array
  // Adds "All" at the beginning

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    return ["All", ...uniqueCategories.sort()];
  }, []);

  // ==========================================
  // FILTER PRODUCTS BY SEARCH & CATEGORY
  // ==========================================
  // Filters based on BOTH search term AND category
  // Product must match both filters to be shown
  // If category is "All", all categories are shown

  const filteredProducts = products.filter((product) => {
    // Check search term match (case-insensitive)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    // Check category match
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // Product must match BOTH search AND category
    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // SORT FILTERED PRODUCTS
  // ==========================================
  // Sorts the filtered products based on selected sort option
  // Creates a copy of the array to avoid mutating original
  // Different sort logic based on sortBy value

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      // Price (Low to High) - sort by price ascending
      case "Price (Low to High)":
        return a.price - b.price;

      // Price (High to Low) - sort by price descending
      case "Price (High to Low)":
        return b.price - a.price;

      // Name (A–Z) - sort by title alphabetically ascending
      case "Name (A–Z)":
        return a.title.localeCompare(b.title);

      // Name (Z–A) - sort by title alphabetically descending
      case "Name (Z–A)":
        return b.title.localeCompare(a.title);

      // Default - no sorting (keep original order)
      default:
        return 0;
    }
  });

  return (
    <div style={{ padding: "30px" }}>

      {/* ==========================================
          PAGE TITLE
      ========================================== */}

      <h1>🛍️ Our Products</h1>

      {/* ==========================================
          SEARCH BAR
      ========================================== */}
      {/* Search input with real-time filtering */}

      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by product name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "12px 16px",
            fontSize: "16px",
            border: "2px solid #1976d2",
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0d47a1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
        />

        {/* Clear search button - only show if search has text */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              padding: "12px 20px",
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            ✕ Clear Search
          </button>
        )}
      </div>

      {/* ==========================================
          CATEGORY FILTER BUTTONS
      ========================================== */}
      {/* Horizontal scrollable filter buttons */}
      {/* Active button is highlighted in blue */}

      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <label style={{ fontWeight: "bold", color: "#333" }}>
          Filter by:
        </label>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 18px",
                border: "2px solid #1976d2",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: selectedCategory === category ? "bold" : "normal",
                background:
                  selectedCategory === category ? "#1976d2" : "#fff",
                color:
                  selectedCategory === category ? "#fff" : "#1976d2",
                transition: "all 0.3s ease",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Clear filters button - only show if category is not "All" */}
        {selectedCategory !== "All" && (
          <button
            onClick={() => setSelectedCategory("All")}
            style={{
              padding: "10px 15px",
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ==========================================
          SORT DROPDOWN
      ========================================== */}
      {/* Dropdown menu for sorting products */}

      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: "bold", color: "#333" }}>
          Sort by:
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px 16px",
            fontSize: "14px",
            border: "2px solid #1976d2",
            borderRadius: "6px",
            cursor: "pointer",
            outline: "none",
            backgroundColor: "#fff",
            color: "#333",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0d47a1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Show current sort if not Default */}
        {sortBy !== "Default" && (
          <span style={{ color: "#666", fontSize: "14px" }}>
            Current: <strong>{sortBy}</strong>
          </span>
        )}
      </div>

      {/* ==========================================
          SEARCH & FILTER RESULTS INFO
      ========================================== */}
      {/* Shows active filters and results count */}

      <div style={{ marginBottom: "20px", color: "#666" }}>
        {(searchTerm || selectedCategory !== "All") && (
          <p>
            {selectedCategory !== "All" && (
              <span>
                Category: <strong>{selectedCategory}</strong>
                {searchTerm && " • "}
              </span>
            )}
            {searchTerm && (
              <span>
                Search: <strong>"{searchTerm}"</strong>
              </span>
            )}
            <span style={{ marginLeft: "15px", color: "#999" }}>
              Found <strong>{sortedProducts.length}</strong> product
              {sortedProducts.length !== 1 ? "s" : ""}
            </span>
          </p>
        )}
      </div>

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
        {sortedProducts.length === 0 ? (
          // NO PRODUCTS FOUND MESSAGE
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "60px 20px",
              background: "#f5f5f5",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ color: "#999", marginBottom: "10px" }}>
              😕 No Products Found
            </h2>
            <p style={{ color: "#999", marginBottom: "20px" }}>
              {searchTerm && selectedCategory !== "All"
                ? `No products matching "${searchTerm}" in ${selectedCategory}`
                : searchTerm
                ? `We couldn't find any products matching "${searchTerm}"`
                : `No products available in ${selectedCategory}`}
            </p>

            {/* Show reset button if filters are applied */}
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          // RENDER SORTED & FILTERED PRODUCTS
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              category={product.category}
              price={product.price}
            />
          ))
        )}
      </div>
    </div>
  );
}


// ==========================================
// EXPORT
// ==========================================

export default Products;