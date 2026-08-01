import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../firebase";

const statusOptions = [
	"Pending",
	"Confirmed",
	"Shipped",
	"Delivered",
	"Cancelled",
];

const getOrderDate = (createdAt) => {
	if (createdAt?.toDate) {
		return createdAt.toDate().toLocaleString();
	}

	return "Date unavailable";
};

function AdminOrders() {
	const [orders, setOrders] = useState([]);
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

	const updateOrderStatus = async (orderId, status) => {
		setUpdatingOrderId(orderId);

		try {
			await updateDoc(doc(db, "orders", orderId), {
				orderStatus: status,
			});

			setOrders((currentOrders) =>
				currentOrders.map((order) =>
					order.id === orderId ? { ...order, orderStatus: status } : order
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
					<span style={styles.eyebrow}>Admin dashboard</span>
					<h1 style={styles.title}>Customer Orders</h1>
					<p style={styles.subtitle}>Review every order and keep delivery status current.</p>
				</div>

				{isLoading && <p style={styles.message}>Loading customer orders...</p>}
				{error && <p style={styles.error}>{error}</p>}

				{!isLoading && !error && orders.length === 0 && (
					<section style={styles.emptyState}>
						<h2>No customer orders yet</h2>
						<p>New orders will appear here after checkout.</p>
					</section>
				)}

				<div style={styles.orderList}>
					{!isLoading &&
						!error &&
						orders.map((order) => {
							const currentStatus = statusOptions.includes(order.orderStatus)
								? order.orderStatus
								: "Pending";

							return (
								<article key={order.id} style={styles.orderCard}>
									<div style={styles.orderHeader}>
										<div>
											<span style={styles.orderId}>Order #{order.id.slice(0, 8)}</span>
											<h2 style={styles.customerName}>{order.user?.fullName || "Unknown customer"}</h2>
										</div>

										<label style={styles.statusLabel}>
											Status
											<select
												value={currentStatus}
												disabled={updatingOrderId === order.id}
												onChange={(event) => updateOrderStatus(order.id, event.target.value)}
												style={styles.statusSelect}
											>
												{statusOptions.map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
										</label>
									</div>

									<div style={styles.customerDetails}>
										<span><strong>Phone:</strong> {order.user?.phoneNumber || "Not provided"}</span>
										<span><strong>Order date:</strong> {getOrderDate(order.createdAt)}</span>
									</div>

									<div style={styles.products}>
										<h3 style={styles.sectionTitle}>Products</h3>
										{order.items?.map((item) => (
											<div key={`${order.id}-${item.id || item.title}`} style={styles.productRow}>
												<span>{item.title}</span>
												<span>Quantity: {item.quantity}</span>
												<strong>₹{item.price * item.quantity}</strong>
											</div>
										))}
									</div>

									<div style={styles.totalRow}>
										<span>Payment: {order.paymentStatus || "Pending"}</span>
										<strong>Total price: ₹{order.totalPrice}</strong>
									</div>
								</article>
							);
						})}
				</div>
			</div>
		</main>
	);
}

const styles = {
	page: { minHeight: "calc(100vh - 90px)", padding: "44px 20px", background: "#f4f8fc" },
	container: { width: "min(100%, 1100px)", margin: "0 auto" },
	heading: { marginBottom: "28px" },
	eyebrow: { color: "#1976d2", fontSize: "14px", fontWeight: "700" },
	title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 5vw, 42px)" },
	subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
	orderList: { display: "grid", gap: "18px" },
	orderCard: { padding: "22px", background: "#fff", borderRadius: "16px", boxShadow: "0 8px 25px rgba(25, 118, 210, 0.09)" },
	orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" },
	orderId: { color: "#64748b", fontSize: "13px" },
	customerName: { margin: "6px 0 0", color: "#172b4d", fontSize: "22px" },
	statusLabel: { display: "grid", gap: "6px", color: "#475569", fontSize: "13px", fontWeight: "700" },
	statusSelect: { minWidth: "150px", padding: "10px", border: "1px solid #1976d2", borderRadius: "8px", background: "#fff", color: "#172b4d", fontWeight: "600", cursor: "pointer" },
	customerDetails: { display: "flex", gap: "20px", flexWrap: "wrap", padding: "16px 0", color: "#475569" },
	products: { padding: "16px 0", borderTop: "1px solid #e2e8f0" },
	sectionTitle: { margin: "0 0 10px", color: "#172b4d", fontSize: "17px" },
	productRow: { display: "grid", gridTemplateColumns: "minmax(160px, 1fr) auto auto", gap: "16px", padding: "10px 0", color: "#334155" },
	totalRow: { display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid #e2e8f0", color: "#475569" },
	emptyState: { padding: "40px 24px", textAlign: "center", background: "#fff", borderRadius: "16px", color: "#64748b" },
	message: { color: "#64748b" },
	error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c" },
};

export default AdminOrders;
