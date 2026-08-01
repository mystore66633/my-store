import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/profile" } });
      return;
    }

    const loadProfile = async () => {
      try {
        const profileSnapshot = await getDoc(doc(db, "users", user.uid));
        setProfile(profileSnapshot.exists() ? profileSnapshot.data() : null);
      } catch {
        setError("We could not load your profile. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate, user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Your account</span>
            <h1 style={styles.title}>Profile</h1>
          </div>
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            Sign out
          </button>
        </div>

        {isLoading && <p style={styles.message}>Loading your profile...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!isLoading && !error && (
          <div style={styles.details}>
            <div style={styles.detail}>
              <span style={styles.label}>Full name</span>
              <strong>{profile?.fullName || "Not available"}</strong>
            </div>
            <div style={styles.detail}>
              <span style={styles.label}>Email</span>
              <strong>{profile?.email || user.email || "Not available"}</strong>
            </div>
            <div style={styles.detail}>
              <span style={styles.label}>Phone number</span>
              <strong>{profile?.phoneNumber || user.phoneNumber || "Not available"}</strong>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 90px)", padding: "48px 20px", background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)" },
  card: { width: "min(100%, 680px)", margin: "0 auto", padding: "clamp(24px, 6vw, 44px)", background: "#fff", borderRadius: "20px", boxShadow: "0 18px 50px rgba(25, 118, 210, 0.14)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", marginBottom: "28px" },
  eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
  title: { margin: "8px 0 0", color: "#172b4d", fontSize: "clamp(28px, 5vw, 38px)" },
  logoutButton: { border: "1px solid #1976d2", borderRadius: "10px", padding: "11px 16px", background: "#fff", color: "#1976d2", fontWeight: "700", cursor: "pointer" },
  details: { display: "grid", gap: "12px" },
  detail: { display: "grid", gap: "6px", padding: "16px", borderRadius: "12px", background: "#f8fbff", color: "#172b4d" },
  label: { color: "#64748b", fontSize: "14px", fontWeight: "600" },
  message: { color: "#64748b" },
  error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", lineHeight: 1.4 },
};

export default Profile;