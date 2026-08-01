import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const statusStyles = {
  Pending: { background: "#ffedd5", color: "#c2410c" },
  Confirmed: { background: "#dbeafe", color: "#1d4ed8" },
  Packed: { background: "#f3e8ff", color: "#7e22ce" },
  Shipped: { background: "#cffafe", color: "#0e7490" },
  "Out for Delivery": { background: "#e0e7ff", color: "#4338ca" },
  Delivered: { background: "#dcfce7", color: "#15803d" },
  Cancelled: { background: "#fee2e2", color: "#b91c1c" },
};

const getStatus = (order) =>
  order.orderStatus === "Placed" ? "Pending" : order.orderStatus || "Pending";

const getProducts = (order) => order.products || order.items || [];

const getProductName = (product) => product.name || product.title || "Product";

const getDateTime = (createdAt) => {
  if (createdAt?.toDate) {
    return createdAt.toDate().toLocaleString();
  }

  if (createdAt) {
    return new Date(createdAt).toLocaleString();
  }

  return "Date unavailable";
};

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders = snapshot.docs
          .map((orderDocument) => ({
            id: orderDocument.id,
            ...orderDocument.data(),
          }))
          .sort((first, second) => {
            const firstTime = first.createdAt?.toMillis?.() || 0;
            const secondTime = second.createdAt?.toMillis?.() || 0;
            return secondTime - firstTime;
          });

        setOrders(loadedOrders);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        toast.error("We could not load your orders. Please try again.");
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleCancelOrder = async (order) => {
    if (getStatus(order) !== "Pending") {
      return;
    }

    try {
      await updateDoc(doc(db, "orders", order.id), {
        orderStatus: "Cancelled",
      });
      toast.success("Order cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Unable to cancel your order. Please try again.");
    }
  };

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.emptyState}>
          <h1 style={styles.title}>My Orders</h1>
          <p style={styles.message}>Please sign in to view your orders.</p>
          <Link to="/login" style={styles.primaryButton}>Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Your purchases</span>
          <h1 style={styles.title}>My Orders</h1>
          <p style={styles.subtitle}>Track your orders and delivery progress in real time.</p>
        </div>

        {isLoading && <p style={styles.message}>Loading your orders...</p>}

        {!isLoading && orders.length === 0 && (
          <section style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h2 style={styles.emptyTitle}>No orders yet</h2>
            <p style={styles.message}>Your completed purchases will appear here.</p>
            <Link to="/products" style={styles.primaryButton}>Continue Shopping</Link>
          </section>
        )}

        {!isLoading && orders.length > 0 && (
          <div style={styles.orderList}>
            {orders.map((order) => {
              const status = getStatus(order);
              const products = getProducts(order);
              const isExpanded = expandedOrderId === order.id;
              const total = order.total ?? order.totalPrice ?? 0;
              const address = order.address || order.user?.address || "Not provided";
              const paymentMethod = order.paymentMethod || order.paymentStatus || "Cash on Delivery";
              const badgeStyle = statusStyles[status] || statusStyles.Pending;

              return (
                <article key={order.id} style={styles.orderCard}>
                  <div style={styles.orderTop}>
                    <div>
                      <span style={styles.orderLabel}>Order ID</span>
                      <strong style={styles.orderId}>#{order.id.slice(0, 10)}</strong>
                    </div>
                    <span style={{ ...styles.statusBadge, ...badgeStyle }}>{status}</span>
                  </div>

                  <div style={styles.summaryGrid}>
                    <div>
                      <span style={styles.fieldLabel}>Order date</span>
                      <strong>{getDateTime(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span style={styles.fieldLabel}>Payment method</span>
                      <strong>{paymentMethod}</strong>
                    </div>
                    <div>
                      <span style={styles.fieldLabel}>Total amount</span>
                      <strong style={styles.total}>₹{total}</strong>
                    </div>
                  </div>

                  <div style={styles.previewProducts}>
                    {products.slice(0, 2).map((product) => (
                      <div key={`${order.id}-${product.id || getProductName(product)}`} style={styles.previewProduct}>
                        <img src={product.image} alt={getProductName(product)} style={styles.previewImage} />
                        <span>{getProductName(product)} × {product.quantity}</span>
                      </div>
                    ))}
                    {products.length > 2 && <span style={styles.moreProducts}>+{products.length - 2} more</span>}
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      style={styles.secondaryButton}
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                    {status === "Pending" && (
                      <button type="button" onClick={() => handleCancelOrder(order)} style={styles.cancelButton}>
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div style={styles.details}>
                      <div style={styles.detailBlock}>
                        <h3 style={styles.detailTitle}>Delivery address</h3>
                        <p style={styles.detailText}>{address}</p>
                        <p style={styles.detailText}>Phone: {order.phoneNumber || order.user?.phoneNumber || "Not provided"}</p>
                      </div>

                      <div style={styles.detailBlock}>
                        <h3 style={styles.detailTitle}>Products</h3>
                        <div style={styles.productList}>
                          {products.map((product) => (
                            <div key={`${order.id}-detail-${product.id || getProductName(product)}`} style={styles.productRow}>
                              <img src={product.image} alt={getProductName(product)} style={styles.productImage} />
                              <div style={styles.productInfo}>
                                <strong>{getProductName(product)}</strong>
                                <span>Quantity: {product.quantity}</span>
                                <span>Price: ₹{product.price}</span>
                              </div>
                              <strong>₹{product.price * product.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 90px)", padding: "48px 20px", background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)" },
  container: { width: "min(100%, 950px)", margin: "0 auto" },
  heading: { marginBottom: "28px" },
  eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
  title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 6vw, 42px)" },
  subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  orderList: { display: "grid", gap: "18px" },
  orderCard: { padding: "22px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(25,118,210,0.1)" },
  orderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" },
  orderLabel: { display: "block", marginBottom: "5px", color: "#64748b", fontSize: "13px" },
  orderId: { color: "#172b4d" },
  statusBadge: { padding: "8px 11px", borderRadius: "999px", fontWeight: "700", fontSize: "13px" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "16px", padding: "18px 0" },
  fieldLabel: { display: "block", marginBottom: "5px", color: "#64748b", fontSize: "13px" },
  total: { color: "#1976d2", fontSize: "18px" },
  previewProducts: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", padding: "14px 0", borderTop: "1px solid #e2e8f0" },
  previewProduct: { display: "flex", alignItems: "center", gap: "8px", color: "#334155", fontSize: "14px" },
  previewImage: { width: "38px", height: "38px", borderRadius: "7px", objectFit: "cover" },
  moreProducts: { color: "#64748b", fontSize: "14px" },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid #e2e8f0" },
  secondaryButton: { border: "1px solid #1976d2", borderRadius: "9px", padding: "10px 14px", background: "#fff", color: "#1976d2", fontWeight: "700", cursor: "pointer" },
  cancelButton: { border: "1px solid #dc2626", borderRadius: "9px", padding: "10px 14px", background: "#fff", color: "#dc2626", fontWeight: "700", cursor: "pointer" },
  details: { display: "grid", gap: "18px", marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #e2e8f0" },
  detailBlock: { padding: "16px", borderRadius: "12px", background: "#f8fbff" },
  detailTitle: { margin: "0 0 10px", color: "#172b4d", fontSize: "17px" },
  detailText: { margin: "6px 0", color: "#475569", lineHeight: 1.5 },
  productList: { display: "grid", gap: "12px" },
  productRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #e2e8f0", color: "#334155" },
  productImage: { width: "58px", height: "58px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 },
  productInfo: { display: "grid", gap: "3px", flex: 1, minWidth: 0 },
  emptyState: { padding: "44px 24px", textAlign: "center", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(25,118,210,0.1)" },
  emptyIcon: { fontSize: "42px" },
  emptyTitle: { margin: "12px 0 8px", color: "#172b4d" },
  message: { color: "#64748b" },
  primaryButton: { display: "inline-block", marginTop: "12px", padding: "12px 17px", borderRadius: "9px", background: "#1976d2", color: "#fff", fontWeight: "700" },
};

export default Orders;
