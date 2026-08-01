import { Link } from "react-router-dom";

function Dashboard() {
	return (
		<main
			style={{
				minHeight: "calc(100vh - 90px)",
				padding: "44px 20px",
				background: "#f4f8fc",
			}}
		>
			<section
				style={{
					width: "min(100%, 900px)",
					margin: "0 auto",
					padding: "clamp(24px, 6vw, 48px)",
					background: "#fff",
					borderRadius: "16px",
					boxShadow: "0 8px 25px rgba(25, 118, 210, 0.09)",
				}}
			>
				<span style={{ color: "#1976d2", fontSize: "14px", fontWeight: "700" }}>
					Store administration
				</span>
				<h1 style={{ margin: "8px 0", color: "#172b4d" }}>Admin Dashboard</h1>
				<p style={{ color: "#64748b", lineHeight: 1.5 }}>
					Manage customer orders and keep their delivery status up to date.
				</p>
				<Link
					to="/admin/orders"
					style={{
						display: "inline-block",
						marginTop: "18px",
						padding: "13px 18px",
						borderRadius: "9px",
						background: "#1976d2",
						color: "#fff",
						fontWeight: "700",
					}}
				>
					View Customer Orders
				</Link>
			</section>
		</main>
	);
}

export default Dashboard;
