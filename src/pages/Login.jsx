import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getAuthErrorMessage = (error) => {
  const messages = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };

  return messages[error.code] || "Unable to sign in. Please try again.";
};

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [navigate, user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form.email.trim(), form.password);
      const destination = location.state?.from || "/profile";
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Welcome back</span>
          <h1 style={styles.title}>Sign in to Nishan Store</h1>
          <p style={styles.subtitle}>Access your account and continue shopping.</p>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={styles.input}
            />
          </label>

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.footerText}>
          New here? <Link to="/register" style={styles.link}>Create an account</Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 90px)",
    padding: "48px 20px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)",
  },
  card: {
    width: "min(100%, 460px)",
    padding: "clamp(24px, 6vw, 44px)",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 18px 50px rgba(25, 118, 210, 0.14)",
  },
  heading: { marginBottom: "24px" },
  eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
  title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(26px, 5vw, 34px)" },
  subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  form: { display: "grid", gap: "18px" },
  label: { display: "grid", gap: "8px", color: "#334155", fontWeight: "600" },
  input: { width: "100%", padding: "13px 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "16px", outline: "none" },
  button: { border: 0, borderRadius: "10px", padding: "14px", background: "#1976d2", color: "#fff", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", lineHeight: 1.4 },
  footerText: { margin: "24px 0 0", textAlign: "center", color: "#64748b" },
  link: { color: "#1976d2", fontWeight: "700" },
};

export default Login;