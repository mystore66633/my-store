import { useContext, useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const DELIVERY_CHARGE = 50;

const formatAddress = (address) =>
  [
    address.houseFlat,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pinCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const deliveryCharge = cart.length > 0 ? DELIVERY_CHARGE : 0;
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
      setIsLoadingAddress(false);
      return;
    }

    const loadDefaultAddress = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "addresses")
        );
        const addresses = snapshot.docs.map((addressDocument) => ({
          id: addressDocument.id,
          ...addressDocument.data(),
        }));
        const selectedAddress =
          addresses.find((address) => address.isDefault) || addresses[0] || null;

        setDefaultAddress(selectedAddress);
      } catch (error) {
        console.error("Error loading default address:", error);
        toast.error("Unable to load your delivery address.");
      } finally {
        setIsLoadingAddress(false);
      }
    };

    loadDefaultAddress();
  }, [navigate, user]);

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!defaultAddress) {
      toast.error("Please add a delivery address before placing your order.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: defaultAddress.fullName,
        phoneNumber: defaultAddress.phoneNumber,
        address: formatAddress(defaultAddress),
        products: cart.map((item) => ({
          id: item.id || null,
          image: item.image,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        deliveryCharge,
        total,
        paymentMethod,
        orderStatus: "Pending",
        createdAt: serverTimestamp(),
      });

      setCart([]);
      toast.success("Order placed successfully!");
      navigate("/orders", { replace: true });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("We could not place your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Secure checkout</span>
          <h1 style={styles.title}>Checkout</h1>
          <p style={styles.subtitle}>
            Review your order and confirm delivery details.
          </p>
        </div>

        {isLoadingAddress ? (
          <p style={styles.message}>Loading your default address...</p>
        ) : (
          <form onSubmit={placeOrder} style={styles.layout}>
            <div style={styles.mainColumn}>
              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Delivery address</h2>
                  <Link to="/addresses" style={styles.changeLink}>
                    Manage addresses
                  </Link>
                </div>

                {defaultAddress ? (
                  <div style={styles.addressBox}>
                    <strong>{defaultAddress.fullName}</strong>
                    <p>{formatAddress(defaultAddress)}</p>
                    <span>Phone: {defaultAddress.phoneNumber}</span>
                  </div>
                ) : (
                  <div style={styles.emptyAddress}>
                    <p>No delivery address found.</p>
                    <Link to="/addresses" style={styles.primaryLink}>
                      Add an address
                    </Link>
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <h2 style={styles.cardTitle}>Your products</h2>

                {cart.length === 0 && (
                  <p style={styles.message}>Your cart is empty.</p>
                )}

                <div style={styles.productList}>
                  {cart.map((item) => (
                    <div key={item.id || item.title} style={styles.productRow}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={styles.productImage}
                      />
                      <div style={styles.productInfo}>
                        <strong>{item.title}</strong>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ₹{item.price}</span>
                      </div>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside style={styles.summaryCard}>
              <h2 style={styles.cardTitle}>Order summary</h2>

              <div style={styles.summaryLine}>
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>
              <div style={styles.summaryLine}>
                <span>Delivery charge</span>
                <strong>₹{deliveryCharge}</strong>
              </div>
              <div style={styles.totalLine}>
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <label style={styles.paymentLabel}>
                Payment method
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  style={styles.select}
                >
                  <option>Cash on Delivery</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={isPlacingOrder || cart.length === 0 || !defaultAddress}
                style={{
                  ...styles.placeButton,
                  opacity:
                    isPlacingOrder || cart.length === 0 || !defaultAddress
                      ? 0.65
                      : 1,
                  cursor:
                    isPlacingOrder || cart.length === 0 || !defaultAddress
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isPlacingOrder ? "Placing order..." : "Place order"}
              </button>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 90px)",
    padding: "44px 20px",
    background:
      "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)",
  },
  container: {
    width: "min(100%, 1100px)",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "26px",
  },
  eyebrow: {
    color: "#1976d2",
    fontWeight: "700",
    fontSize: "14px",
  },
  title: {
    margin: "8px 0",
    color: "#172b4d",
    fontSize: "clamp(30px, 6vw, 42px)",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.5,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.8fr)",
    gap: "22px",
    alignItems: "start",
  },
  mainColumn: {
    display: "grid",
    gap: "22px",
  },
  card: {
    padding: "24px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(25,118,210,0.1)",
  },
  summaryCard: {
    padding: "24px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(25,118,210,0.1)",
    position: "sticky",
    top: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  cardTitle: {
    margin: 0,
    color: "#172b4d",
    fontSize: "21px",
  },
  changeLink: {
    color: "#1976d2",
    fontWeight: "700",
    fontSize: "14px",
  },
  addressBox: {
    padding: "16px",
    borderRadius: "12px",
    background: "#f4f9ff",
    color: "#172b4d",
    lineHeight: 1.5,
  },
  emptyAddress: {
    padding: "16px",
    borderRadius: "12px",
    background: "#fff7ed",
    color: "#9a3412",
  },
  primaryLink: {
    color: "#1976d2",
    fontWeight: "700",
  },
  productList: {
    display: "grid",
    gap: "14px",
    marginTop: "16px",
  },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingBottom: "14px",
    borderBottom: "1px solid #e2e8f0",
    color: "#172b4d",
  },
  productImage: {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },
  productInfo: {
    display: "grid",
    gap: "4px",
    flex: 1,
    minWidth: 0,
  },
  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "10px 0",
    color: "#64748b",
  },
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "18px 0",
    marginTop: "8px",
    borderTop: "1px solid #e2e8f0",
    color: "#1976d2",
    fontSize: "20px",
  },
  paymentLabel: {
    display: "grid",
    gap: "8px",
    marginTop: "16px",
    color: "#475569",
    fontWeight: "700",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "15px",
  },
  placeButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: 0,
    borderRadius: "10px",
    background: "#1976d2",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
  },
  message: {
    color: "#64748b",
  },
};

export default Checkout;
