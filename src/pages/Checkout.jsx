// ==========================================
// IMPORTS
// ==========================================

import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

// ==========================================
// CHECKOUT PAGE
// ==========================================

function Checkout() {
  const { cart, setCart } = useContext(CartContext);

  // Customer Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");

  // Total Price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Place Order
  const placeOrder = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    toast.success("🎉 Order placed successfully!");

    setCart([]);

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setPincode("");
    setPayment("Cash on Delivery");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "25px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🛒 Checkout</h1>

      {/* Customer Details */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2>Customer Details</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows="4"
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="PIN Code"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          style={inputStyle}
        />

        <h3>Payment Method</h3>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          style={inputStyle}
        >
          <option>Cash on Delivery</option>
          <option>UPI</option>
          <option>Credit / Debit Card</option>
        </select>
      </div>

      {/* Order Summary */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>📦 Order Summary</h2>

        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <span>
              {item.title} × {item.quantity}
            </span>

            <strong>₹{item.price * item.quantity}</strong>
          </div>
        ))}

        <h2
          style={{
            marginTop: "20px",
            color: "#1976d2",
          }}
        >
          Total: ₹{total}
        </h2>

        <button
          onClick={placeOrder}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

// ==========================================
// INPUT STYLE
// ==========================================

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export default Checkout;