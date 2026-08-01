import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ id, image, title, category, price }) {
  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlistItem } = useContext(WishlistContext);

  const isWishlisted = wishlist.some((item) => item.title === title);

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item.title === title);
    const quantity = (existingProduct?.quantity || 0) + 1;
    const toastId = `cart-${id ?? title}`;
    const message = `${title} added to cart${quantity > 1 ? ` (${quantity})` : ""}`;

    addToCart({
      image,
      title,
      category,
      price,
    });

    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
      });
    } else {
      toast.success(message, {
        toastId,
      });
    }
  };

  const handleWishlistToggle = () => {
    const result = toggleWishlistItem({ image, title, category, price });

    if (result === "added") {
      toast.success("Added to wishlist");
    } else {
      toast.info("Removed from wishlist");
    }
  };

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
      <Link 
        to={`/product/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />

        <h3 style={{ cursor: "pointer" }}>{title}</h3>
      </Link>

      <p style={{ color: "#666" }}>{category}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h2 style={{ color: "#1976d2", margin: 0 }}>₹{price}</h2>

        <button
          onClick={handleWishlistToggle}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "22px",
            padding: "4px",
          }}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <button
        onClick={handleAddToCart}
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