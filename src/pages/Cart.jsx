import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    } else {
      removeItem(index);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <h2>Your cart is empty.</h2>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h2>{item.title}</h2>

                <p style={{ color: "#666" }}>{item.category}</p>

                <h3 style={{ color: "#1976d2" }}>
                  ₹{item.price}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button onClick={() => decreaseQuantity(index)}>
                    −
                  </button>

                  <strong>{item.quantity}</strong>

                  <button onClick={() => increaseQuantity(index)}>
                    +
                  </button>
                </div>

                <h4 style={{ marginTop: "15px" }}>
                  Subtotal: ₹{item.price * item.quantity}
                </h4>

                <button
                  onClick={() => removeItem(index)}
                  style={{
                    marginTop: "15px",
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              borderTop: "2px solid #1976d2",
              textAlign: "right",
            }}
          >
            <h1>Total: ₹{total}</h1>

            <button
  onClick={() => navigate("/checkout")}
  style={{
    marginTop: "15px",
    padding: "15px 30px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  }}
>
  Proceed to Checkout
</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;