import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

import { db } from "../../firebase";

const getOrderStatus = (order) =>
  order.orderStatus === "Placed" ? "Pending" : order.orderStatus || "Pending";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        setOrders(snapshot.docs.map((orderDocument) => ({
          id: orderDocument.id,
          ...orderDocument.data(),
        })));
      } catch (loadError) {
        console.error("Error loading dashboard orders:", loadError);
        setError("Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const metrics = useMemo(() => {
    const customers = new Set(
      orders.map((order) => order.userId).filter(Boolean)
    );
    const pendingOrders = orders.filter(
      (order) => getOrderStatus(order) === "Pending"
    ).length;
    const deliveredOrders = orders.filter(
      (order) => getOrderStatus(order) === "Delivered"
    ).length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total ?? order.totalPrice ?? 0),
      0
    );

    return [
      ["Total Orders", orders.length, "📦"],
      ["Pending Orders", pendingOrders, "⏳"],
      ["Delivered Orders", deliveredOrders, "✅"],
      ["Total Customers", customers.size, "👥"],
      ["Total Revenue", `₹${totalRevenue}`, "💰"],
    ];
  }, [orders]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Store administration</span>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Monitor orders, customers, and revenue from one place.</p>
        </div>

        {isLoading && <p style={styles.message}>Loading dashboard...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!isLoading && !error && (
          <>
            <section style={styles.metricsGrid}>
              {metrics.map(([label, value, icon]) => (
                <article key={label} style={styles.metricCard}>
                  <span style={styles.metricIcon}>{icon}</span>
                  <span style={styles.metricLabel}>{label}</span>
                  <strong style={styles.metricValue}>{value}</strong>
                </article>
              ))}
            </section>

            <section style={styles.actionCard}>
              <div>
                <h2 style={styles.actionTitle}>Manage customer orders</h2>
                <p style={styles.actionText}>Search orders, filter delivery status, and update fulfillment progress.</p>
              </div>
              <Link to="/admin/orders" style={styles.actionButton}>Open orders table</Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 90px)", padding: "44px 20px", background: "#f4f8fc" },
  container: { width: "min(100%, 1180px)", margin: "0 auto" },
  heading: { marginBottom: "28px" },
  eyebrow: { color: "#1976d2", fontSize: "14px", fontWeight: "700" },
  title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 5vw, 42px)" },
  subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px" },
  metricCard: { display: "grid", gap: "8px", padding: "22px", background: "#fff", borderRadius: "14px", boxShadow: "0 8px 25px rgba(25,118,210,0.09)" },
  metricIcon: { fontSize: "25px" },
  metricLabel: { color: "#64748b", fontSize: "14px", fontWeight: "700" },
  metricValue: { color: "#172b4d", fontSize: "28px" },
  actionCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", marginTop: "24px", padding: "24px", background: "#fff", borderRadius: "14px", boxShadow: "0 8px 25px rgba(25,118,210,0.09)" },
  actionTitle: { margin: 0, color: "#172b4d", fontSize: "20px" },
  actionText: { margin: "8px 0 0", color: "#64748b" },
  actionButton: { padding: "12px 16px", borderRadius: "9px", background: "#1976d2", color: "#fff", fontWeight: "700" },
  message: { color: "#64748b" },
  error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c" },
};

export default Dashboard;
