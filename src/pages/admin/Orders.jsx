import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../firebase";

const statusOptions = [
  "All",
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const getStatus = (order) =>
  order.orderStatus === "Placed" ? "Pending" : order.orderStatus || "Pending";

const getProducts = (order) => order.products || order.items || [];

const getProductName = (product) => product.name || product.title || "Product";

const getOrderDate = (createdAt) => {
  if (createdAt?.toDate) {
    return createdAt.toDate().toLocaleString();
  }

  if (createdAt) {
    return new Date(createdAt).toLocaleString();
  }

  return "Date unavailable";
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
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
      } catch (loadError) {
        console.error("Error loading admin orders:", loadError);
        setError("Unable to load customer orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.customerName || order.user?.fullName || "";
      const phoneNumber =
        order.phoneNumber || order.user?.phoneNumber || "";
      const matchesSearch =
        !query ||
        customerName.toLowerCase().includes(query) ||
        phoneNumber.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || getStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId, orderStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await updateDoc(doc(db, "orders", orderId), { orderStatus });
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus } : order
        )
      );
      toast.success("Order status updated.");
    } catch (updateError) {
      console.error("Error updating order status:", updateError);
      toast.error("Unable to update the order status.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Store administration</span>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Search and manage every customer order.</p>
        </div>

        <div style={styles.toolbar}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search customer, phone, or order ID"
            style={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter orders by status"
            style={styles.filterSelect}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All statuses" : status}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p style={styles.message}>Loading orders...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!isLoading && !error && filteredOrders.length === 0 && (
          <section style={styles.emptyState}>
            <h2>No matching orders</h2>
            <p>Try changing the search text or status filter.</p>
          </section>
        )}

        {!isLoading && !error && filteredOrders.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const products = getProducts(order);
                  const customerName =
                    order.customerName || order.user?.fullName || "Unknown customer";
                  const phoneNumber =
                    order.phoneNumber || order.user?.phoneNumber || "Not provided";
                  const address =
                    order.address || order.user?.address || "Not provided";
                  const total = order.total ?? order.totalPrice ?? 0;
                  const currentStatus = getStatus(order);

                  return (
                    <tr key={order.id}>
                      <td style={styles.td}>
                        <strong>#{order.id.slice(0, 8)}</strong>
                      </td>
                      <td style={styles.td}>
                        <strong>{customerName}</strong>
                        <span style={styles.secondaryText}>{phoneNumber}</span>
                      </td>
                      <td style={styles.td}>{address}</td>
                      <td style={styles.td}>
                        <div style={styles.productList}>
                          {products.map((product) => (
                            <span key={`${order.id}-${product.id || getProductName(product)}`}>
                              {getProductName(product)} × {product.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}><strong>₹{total}</strong></td>
                      <td style={styles.td}>{order.paymentMethod || order.paymentStatus || "Cash on Delivery"}</td>
                      <td style={styles.td}>
                        <select
                          value={statusOptions.includes(currentStatus) ? currentStatus : "Pending"}
                          disabled={updatingOrderId === order.id}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                          style={styles.statusSelect}
                        >
                          {statusOptions.slice(1).map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td style={styles.td}>{getOrderDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 90px)", padding: "44px 20px", background: "#f4f8fc" },
  container: { width: "min(100%, 1400px)", margin: "0 auto" },
  heading: { marginBottom: "26px" },
  eyebrow: { color: "#1976d2", fontSize: "14px", fontWeight: "700" },
  title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 5vw, 42px)" },
  subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  toolbar: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" },
  searchInput: { flex: "1 1 320px", minHeight: "44px", padding: "10px 13px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "15px", boxSizing: "border-box" },
  filterSelect: { minHeight: "44px", padding: "10px 13px", border: "1px solid #cbd5e1", borderRadius: "10px", background: "#fff", color: "#172b4d", fontSize: "15px" },
  tableWrapper: { overflowX: "auto", background: "#fff", borderRadius: "16px", boxShadow: "0 8px 25px rgba(25,118,210,0.09)" },
  table: { width: "100%", minWidth: "1180px", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "15px 14px", background: "#eaf4ff", color: "#334155", fontSize: "13px", whiteSpace: "nowrap" },
  td: { padding: "16px 14px", borderTop: "1px solid #e2e8f0", color: "#334155", verticalAlign: "top", fontSize: "14px", lineHeight: 1.5 },
  secondaryText: { display: "block", marginTop: "4px", color: "#64748b", fontSize: "13px" },
  productList: { display: "grid", gap: "4px", minWidth: "150px" },
  statusSelect: { minWidth: "145px", padding: "9px", border: "1px solid #1976d2", borderRadius: "8px", background: "#fff", color: "#172b4d", fontWeight: "600" },
  emptyState: { padding: "40px 24px", textAlign: "center", background: "#fff", borderRadius: "16px", color: "#64748b" },
  message: { color: "#64748b" },
  error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c" },
};

export default AdminOrders;
