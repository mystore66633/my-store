import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  houseFlat: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
};

const fields = [
  ["fullName", "Full Name", "text", true],
  ["phoneNumber", "Phone Number", "tel", true],
  ["houseFlat", "House/Flat No.", "text", true],
  ["street", "Street", "text", true],
  ["landmark", "Landmark (Optional)", "text", false],
  ["city", "City", "text", true],
  ["state", "State", "text", true],
  ["pinCode", "PIN Code", "text", true],
  ["country", "Country", "text", true],
];

function Addresses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/addresses" } });
      setIsLoading(false);
      return;
    }

    const loadAddresses = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "addresses")
        );
        setAddresses(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      } catch (error) {
        console.error("Error loading addresses:", error);
        toast.error("Unable to load your addresses.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [navigate, user]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    const requiredFields = fields.filter(([, , , required]) => required);
    const hasMissingField = requiredFields.some(([name]) => !form[name].trim());

    if (hasMissingField) {
      toast.error("Please fill in all required address fields.");
      return false;
    }

    if (!/^\d{4,10}$/.test(form.pinCode.trim())) {
      toast.error("Please enter a valid PIN Code.");
      return false;
    }

    return true;
  };

  const clearDefaultAddress = async (batch, addressIdToKeep = null) => {
    addresses.forEach((address) => {
      if (address.id !== addressIdToKeep && address.isDefault) {
        batch.update(doc(db, "users", user.uid, "addresses", address.id), {
          isDefault: false,
        });
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const isFirstAddress = addresses.length === 0;
      const addressData = {
        ...form,
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        houseFlat: form.houseFlat.trim(),
        street: form.street.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pinCode: form.pinCode.trim(),
        country: form.country.trim() || "India",
        isDefault: isFirstAddress || form.isDefault === true,
        updatedAt: serverTimestamp(),
      };

      const batch = writeBatch(db);
      if (addressData.isDefault) {
        await clearDefaultAddress(batch, editingId);
      }

      if (editingId) {
        batch.update(
          doc(db, "users", user.uid, "addresses", editingId),
          addressData
        );
      } else {
        const addressRef = doc(collection(db, "users", user.uid, "addresses"));
        batch.set(addressRef, { ...addressData, createdAt: serverTimestamp() });
      }

      await batch.commit();
      toast.success(editingId ? "Address updated." : "Address added.");
      resetForm();

      const refreshed = await getDocs(
        collection(db, "users", user.uid, "addresses")
      );
      setAddresses(refreshed.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Unable to save your address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setForm({ ...emptyForm, ...address });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "addresses", addressId));
      const remaining = addresses.filter((address) => address.id !== addressId);

      if (remaining.length > 0 && !remaining.some((address) => address.isDefault)) {
        await updateDoc(
          doc(db, "users", user.uid, "addresses", remaining[0].id),
          { isDefault: true }
        );
        remaining[0] = { ...remaining[0], isDefault: true };
      }

      setAddresses(remaining);
      if (editingId === addressId) resetForm();
      toast.success("Address deleted.");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Unable to delete this address.");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const batch = writeBatch(db);
      await clearDefaultAddress(batch, addressId);
      batch.update(doc(db, "users", user.uid, "addresses", addressId), {
        isDefault: true,
      });
      await batch.commit();
      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        }))
      );
      toast.success("Default address updated.");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Unable to set the default address.");
    }
  };

  if (!user) return null;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.eyebrow}>Delivery details</span>
          <h1 style={styles.title}>My Addresses</h1>
          <p style={styles.subtitle}>Keep your saved delivery locations ready for checkout.</p>
        </div>

        <section style={styles.formCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{editingId ? "Edit address" : "Add a new address"}</h2>
            {editingId && <button type="button" onClick={resetForm} style={styles.textButton}>Cancel edit</button>}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {fields.map(([name, label, type, required]) => (
              <label key={name} style={name === "landmark" || name === "country" ? styles.label : styles.label}>
                {label}
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  placeholder={name === "country" ? "India" : label}
                  style={styles.input}
                />
              </label>
            ))}

            <button type="submit" disabled={isSaving} style={styles.primaryButton}>
              {isSaving ? "Saving..." : editingId ? "Update address" : "Save address"}
            </button>
          </form>
        </section>

        <section style={styles.listSection}>
          <h2 style={styles.sectionTitle}>Saved addresses</h2>
          {isLoading && <p style={styles.message}>Loading addresses...</p>}
          {!isLoading && addresses.length === 0 && <p style={styles.empty}>No saved addresses yet.</p>}

          <div style={styles.addressGrid}>
            {!isLoading && addresses.map((address) => (
              <article key={address.id} style={styles.addressCard}>
                <div style={styles.addressHeader}>
                  <strong>{address.fullName}</strong>
                  {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
                </div>
                <p style={styles.addressText}>
                  {address.houseFlat}, {address.street}<br />
                  {address.landmark && <>{address.landmark}<br /></>}
                  {address.city}, {address.state} {address.pinCode}<br />
                  {address.country}
                </p>
                <p style={styles.phone}>Phone: {address.phoneNumber}</p>
                <div style={styles.cardActions}>
                  {!address.isDefault && <button type="button" onClick={() => handleSetDefault(address.id)} style={styles.smallButton}>Set default</button>}
                  <button type="button" onClick={() => handleEdit(address)} style={styles.smallButton}>Edit</button>
                  <button type="button" onClick={() => handleDelete(address.id)} style={styles.deleteButton}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Link to="/profile" style={styles.backLink}>Back to Profile</Link>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "calc(100vh - 90px)", padding: "44px 20px", background: "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 55%, #fff 100%)" },
  container: { width: "min(100%, 1000px)", margin: "0 auto" },
  heading: { marginBottom: "24px" },
  eyebrow: { color: "#1976d2", fontSize: "14px", fontWeight: "700" },
  title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(30px, 6vw, 42px)" },
  subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  formCard: { padding: "24px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(25,118,210,0.1)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "18px" },
  sectionTitle: { margin: 0, color: "#172b4d", fontSize: "22px" },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
  label: { display: "grid", gap: "7px", color: "#475569", fontSize: "14px", fontWeight: "700" },
  input: { width: "100%", minHeight: "44px", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "15px", boxSizing: "border-box" },
  primaryButton: { border: 0, borderRadius: "10px", padding: "13px 18px", background: "#1976d2", color: "#fff", fontWeight: "700", cursor: "pointer" },
  textButton: { border: 0, background: "transparent", color: "#1976d2", fontWeight: "700", cursor: "pointer" },
  listSection: { marginTop: "32px" },
  addressGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px", marginTop: "16px" },
  addressCard: { padding: "20px", background: "#fff", borderRadius: "14px", boxShadow: "0 8px 24px rgba(25,118,210,0.09)" },
  addressHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", color: "#172b4d" },
  defaultBadge: { padding: "5px 9px", borderRadius: "999px", background: "#e0f2fe", color: "#0369a1", fontSize: "12px", fontWeight: "700" },
  addressText: { color: "#475569", lineHeight: 1.6 },
  phone: { color: "#64748b", fontSize: "14px" },
  cardActions: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" },
  smallButton: { border: "1px solid #1976d2", borderRadius: "8px", padding: "8px 10px", background: "#fff", color: "#1976d2", fontWeight: "700", cursor: "pointer" },
  deleteButton: { border: "1px solid #dc2626", borderRadius: "8px", padding: "8px 10px", background: "#fff", color: "#dc2626", fontWeight: "700", cursor: "pointer" },
  message: { color: "#64748b" },
  empty: { padding: "20px", color: "#64748b", background: "#fff", borderRadius: "12px" },
  backLink: { display: "inline-block", marginTop: "24px", color: "#1976d2", fontWeight: "700" },
};

export default Addresses;
