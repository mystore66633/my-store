import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

function Orders() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) {
			navigate("/login", { replace: true, state: { from: "/orders" } });
			return;
		}

		const loadOrders = async () => {
			try {
				const snapshot = await getDocs(
					query(collection(db, "orders"), where("userId", "==", user.uid))
				);
				const loadedOrders = snapshot.docs.map((orderDocument) => ({
					id: orderDocument.id,
					...orderDocument.data(),
				}));

				loadedOrders.sort((first, second) => {
					const firstTime = first.createdAt?.toMillis?.() || 0;
					const secondTime = second.createdAt?.toMillis?.() || 0;
					return secondTime - firstTime;
				});

				setOrders(loadedOrders);
			} catch (loadError) {
				console.error("Error loading orders:", loadError);
				setError("We could not load your orders. Please refresh and try again.");
			} finally {
				setIsLoading(false);
			}
		};

		loadOrders();
	}, [navigate, user]);

	if (!user) {
		return null;
	}

	return (
		<main style={styles.page}>
			<div style={styles.container}>
				<div style={styles.heading}>
					<span style={styles.eyebrow}>Your purchases</span>
					<h1 style={styles.title}>My Orders</h1>
					<p style={styles.subtitle}>Track your recent orders and their current status.</p>
				</div>

				{isLoading && <p style={styles.message}>Loading your orders...</p>}
				{error && <p style={styles.error}>{error}</p>}

				{!isLoading && !error && orders.length === 0 && (
					<section style={styles.emptyState}>
						<h2>No orders yet</h2>
						<p>Your completed purchases will appear here.</p>
					</section>
				)}

				<div style={styles.orderList}>
					{!isLoading && !error && orders.map((order) => (
						<article key={order.id} style={styles.orderCard}>
							<div style={styles.orderHeader}>
								<div>
									<span style={styles.label}>Order ID</span>
									<strong>#{order.id.slice(0, 8)}</strong>
								</div>
								<span style={styles.status}>{order.orderStatus || "Placed"}</span>
							</div>

							<div style={styles.items}>
								{order.items?.map((item) => (
									<div key={`${order.id}-${item.id || item.title}`} style={styles.item}>
										<span>{item.title} × {item.quantity}</span>
										<strong>₹{item.price * item.quantity}</strong>
									</div>
								))}
							</div>

							<div style={styles.orderFooter}>
								<span>Payment: {order.paymentStatus || "Pending"}</span>
								<strong>Total: ₹{order.totalPrice}</strong>
							</div>
						</article>
					))}
				</div>
			</div>
		</main>
	);
}

const styles = {
	page: { minHeight: "calc(100vh - 90px)", padding: "48px 20px", background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)" },
	container: { width: "min(100%, 900px)", margin: "0 auto" },
	heading: { marginBottom: "28px" },
	eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
	title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 6vw, 42px)" },
	subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
	orderList: { display: "grid", gap: "18px" },
	orderCard: { padding: "22px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(25, 118, 210, 0.1)" },
	orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" },
	label: { display: "block", marginBottom: "5px", color: "#64748b", fontSize: "13px" },
	status: { padding: "7px 10px", borderRadius: "999px", background: "#e0f2fe", color: "#0369a1", fontWeight: "700", fontSize: "14px" },
	items: { padding: "14px 0" },
	item: { display: "flex", justifyContent: "space-between", gap: "16px", padding: "8px 0", color: "#334155" },
	orderFooter: { display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid #e2e8f0", color: "#64748b" },
	emptyState: { padding: "36px 24px", textAlign: "center", background: "#fff", borderRadius: "16px", color: "#64748b" },
	message: { color: "#64748b" },
	error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", lineHeight: 1.4 },
};

export default Orders;
