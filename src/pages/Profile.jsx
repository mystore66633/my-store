import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const getDefaultProfile = (user) => ({
  fullName: user.displayName || "",
  email: user.email || "",
  phoneNumber: user.phoneNumber || "",
});

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", phoneNumber: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/profile" } });
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profileSnapshot = await getDoc(doc(db, "users", user.uid));
        const savedProfile = profileSnapshot.exists()
          ? profileSnapshot.data()
          : getDefaultProfile(user);
        const nextProfile = { ...getDefaultProfile(user), ...savedProfile };

        setProfile(nextProfile);
        setForm({
          fullName: nextProfile.fullName,
          phoneNumber: nextProfile.phoneNumber,
        });
      } catch (profileError) {
        console.error("Error loading profile:", profileError);
        setError("We could not load your profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate, user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedFullName = form.fullName.trim();
      const updatedPhoneNumber = form.phoneNumber.trim();

      await updateProfile(user, { displayName: updatedFullName });
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fullName: updatedFullName,
          email: user.email || "",
          phoneNumber: updatedPhoneNumber,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setProfile((current) => ({
        ...current,
        fullName: updatedFullName,
        phoneNumber: updatedPhoneNumber,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (saveError) {
      console.error("Error saving profile:", saveError);
      toast.error("Unable to update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      fullName: profile?.fullName || "",
      phoneNumber: profile?.phoneNumber || "",
    });
    setIsEditing(false);
  };

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

  const displayName = profile?.fullName || user.displayName || "Store customer";
  const email = profile?.email || user.email || "Not available";
  const phoneNumber = profile?.phoneNumber || user.phoneNumber || "Not provided";
  const avatarUrl =
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e3f2fd&color=1976d2&size=160`;

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Your account</span>
            <h1 style={styles.title}>Profile</h1>
          </div>

          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        {isLoading && <p style={styles.message}>Loading your profile...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!isLoading && !error && (
          <>
            <div style={styles.profileHero}>
              <img src={avatarUrl} alt="Profile avatar" style={styles.avatar} />
              <div>
                <p style={styles.welcome}>Welcome back</p>
                <h2 style={styles.name}>{displayName}</h2>
                <p style={styles.email}>{email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} style={styles.form}>
                <label style={styles.label}>
                  Full name
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Phone number
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="Add phone number"
                    style={styles.input}
                  />
                </label>

                <div style={styles.actions}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={styles.primaryButton}
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleCancelEdit}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.details}>
                <div style={styles.detail}>
                  <span style={styles.label}>Full name</span>
                  <strong>{displayName}</strong>
                </div>

                <div style={styles.detail}>
                  <span style={styles.label}>Email</span>
                  <strong>{email}</strong>
                </div>

                <div style={styles.detail}>
                  <span style={styles.label}>Phone number</span>
                  <strong>{phoneNumber}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={styles.primaryButton}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 90px)",
    padding: "48px 20px",
    background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)",
  },
  card: {
    width: "min(100%, 720px)",
    margin: "0 auto",
    padding: "clamp(24px, 6vw, 48px)",
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 18px 50px rgba(25, 118, 210, 0.14)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
  title: {
    margin: "8px 0 0",
    color: "#172b4d",
    fontSize: "clamp(30px, 5vw, 40px)",
  },
  logoutButton: {
    border: "1px solid #1976d2",
    borderRadius: "10px",
    padding: "11px 16px",
    background: "#fff",
    color: "#1976d2",
    fontWeight: "700",
    cursor: "pointer",
  },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    padding: "24px",
    borderRadius: "16px",
    background: "#f4f9ff",
    marginBottom: "24px",
  },
  avatar: {
    width: "112px",
    height: "112px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 6px 18px rgba(25, 118, 210, 0.16)",
  },
  welcome: { margin: 0, color: "#1976d2", fontWeight: "700", fontSize: "14px" },
  name: { margin: "6px 0", color: "#172b4d", fontSize: "clamp(22px, 4vw, 30px)" },
  email: { margin: 0, color: "#64748b", overflowWrap: "anywhere" },
  details: { display: "grid", gap: "12px" },
  detail: {
    display: "grid",
    gap: "6px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f8fbff",
    color: "#172b4d",
  },
  form: { display: "grid", gap: "16px" },
  label: { display: "grid", gap: "8px", color: "#475569", fontSize: "14px", fontWeight: "700" },
  input: { width: "100%", padding: "13px 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "16px", outline: "none", boxSizing: "border-box" },
  actions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  primaryButton: { border: 0, borderRadius: "10px", padding: "13px 18px", background: "#1976d2", color: "#fff", fontWeight: "700", cursor: "pointer" },
  secondaryButton: { border: "1px solid #1976d2", borderRadius: "10px", padding: "12px 18px", background: "#fff", color: "#1976d2", fontWeight: "700", cursor: "pointer" },
  message: { color: "#64748b" },
  error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", lineHeight: 1.4 },
};

export default Profile;
