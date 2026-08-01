import { useEffect, useRef, useState } from "react";
import { EmailAuthProvider, RecaptchaVerifier, linkWithCredential, signOut, signInWithPhoneNumber } from "firebase/auth";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

const initialForm = {
	fullName: "",
	email: "",
	phoneNumber: "",
	password: "",
};

const getRegistrationErrorMessage = (error) => {
	const messages = {
		"auth/email-already-in-use": "An account already exists with this email.",
		"auth/invalid-phone-number": "Enter a valid phone number with country code.",
		"auth/invalid-verification-code": "That OTP is incorrect. Please try again.",
		"auth/code-expired": "That OTP has expired. Please request a new one.",
		"auth/credential-already-in-use": "This phone number or email is already linked to another account.",
		"auth/too-many-requests": "Too many attempts. Please wait and try again later.",
	};

	return messages[error.code] || "We could not complete registration. Please try again.";
};

const normalizePhoneNumber = (value) => value.replace(/[\s()-]/g, "");

function Register() {
	const navigate = useNavigate();
	const recaptchaContainerRef = useRef(null);
	const recaptchaVerifierRef = useRef(null);
	const [form, setForm] = useState(initialForm);
	const [confirmationResult, setConfirmationResult] = useState(null);
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		return () => {
			recaptchaVerifierRef.current?.clear();
		};
	}, []);

	const handleChange = (event) => {
		setForm((current) => ({
			...current,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSendOtp = async (event) => {
		event.preventDefault();
		setError("");

		const email = form.email.trim().toLowerCase();
		const phoneNumber = normalizePhoneNumber(form.phoneNumber.trim());

		if (form.fullName.trim().length < 2) {
			setError("Please enter your full name.");
			return;
		}

		if (!/^\S+@\S+\.\S+$/.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
			setError("Enter your phone number with country code, for example +14155552671.");
			return;
		}

		if (form.password.length < 6) {
			setError("Your password must be at least 6 characters.");
			return;
		}

		setIsLoading(true);

		try {
			const [emailMatches, phoneMatches] = await Promise.all([
				getDocs(query(collection(db, "users"), where("email", "==", email))),
				getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber))),
			]);

			if (!emailMatches.empty) {
				throw new Error("EMAIL_ALREADY_REGISTERED");
			}

			if (!phoneMatches.empty) {
				throw new Error("PHONE_ALREADY_REGISTERED");
			}

			recaptchaVerifierRef.current?.clear();
			recaptchaVerifierRef.current = new RecaptchaVerifier(
				auth,
				recaptchaContainerRef.current,
				{ size: "normal" }
			);

			const result = await signInWithPhoneNumber(
				auth,
				phoneNumber,
				recaptchaVerifierRef.current
			);

			setForm((current) => ({ ...current, email, phoneNumber }));
			setConfirmationResult(result);
		} catch (registrationError) {
			if (registrationError.message === "EMAIL_ALREADY_REGISTERED") {
				setError("An account already exists with this email.");
			} else if (registrationError.message === "PHONE_ALREADY_REGISTERED") {
				setError("An account already exists with this phone number.");
			} else {
				setError(getRegistrationErrorMessage(registrationError));
			}
			recaptchaVerifierRef.current?.clear();
			recaptchaVerifierRef.current = null;
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOtp = async (event) => {
		event.preventDefault();
		setError("");

		if (!/^\d{6}$/.test(otp)) {
			setError("Enter the 6-digit verification code sent to your phone.");
			return;
		}

		setIsLoading(true);

		try {
			const phoneResult = await confirmationResult.confirm(otp);
			const emailCredential = EmailAuthProvider.credential(
				form.email,
				form.password
			);
			const linkedResult = await linkWithCredential(
				phoneResult.user,
				emailCredential
			);

			await setDoc(doc(db, "users", linkedResult.user.uid), {
				uid: linkedResult.user.uid,
				fullName: form.fullName.trim(),
				email: form.email,
				phoneNumber: form.phoneNumber,
				createdAt: serverTimestamp(),
			});

			navigate("/profile", { replace: true });
		} catch (verificationError) {
			await signOut(auth).catch(() => {});
			setError(getRegistrationErrorMessage(verificationError));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main style={styles.page}>
			<section style={styles.card}>
				<div style={styles.heading}>
					<span style={styles.eyebrow}>Join Nishan Store</span>
					<h1 style={styles.title}>{confirmationResult ? "Verify your phone" : "Create your account"}</h1>
					<p style={styles.subtitle}>
						{confirmationResult
							? `Enter the code sent to ${form.phoneNumber}.`
							: "A verified account makes every checkout simpler."}
					</p>
				</div>

				{error && <p style={styles.error}>{error}</p>}

				{confirmationResult ? (
					<form onSubmit={handleVerifyOtp} style={styles.form}>
						<label style={styles.label}>
							Verification code
							<input
								type="text"
								inputMode="numeric"
								value={otp}
								onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
								placeholder="123456"
								autoComplete="one-time-code"
								required
								style={styles.input}
							/>
						</label>

						<button type="submit" disabled={isLoading} style={styles.button}>
							{isLoading ? "Verifying..." : "Verify and create account"}
						</button>
						<button
							type="button"
							disabled={isLoading}
							onClick={() => {
								setConfirmationResult(null);
								setOtp("");
								setError("");
							}}
							style={styles.secondaryButton}
						>
							Change details
						</button>
					</form>
				) : (
					<form onSubmit={handleSendOtp} style={styles.form}>
						<label style={styles.label}>
							Full name
							<input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" autoComplete="name" required style={styles.input} />
						</label>

						<label style={styles.label}>
							Email
							<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required style={styles.input} />
						</label>

						<label style={styles.label}>
							Phone number
							<input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="+14155552671" autoComplete="tel" required style={styles.input} />
						</label>

						<label style={styles.label}>
							Password
							<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" minLength="6" required style={styles.input} />
						</label>

						<div ref={recaptchaContainerRef} />

						<button type="submit" disabled={isLoading} style={styles.button}>
							{isLoading ? "Sending code..." : "Send verification code"}
						</button>
					</form>
				)}

				<p style={styles.footerText}>
					Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
	card: { width: "min(100%, 520px)", padding: "clamp(24px, 6vw, 44px)", background: "#fff", borderRadius: "20px", boxShadow: "0 18px 50px rgba(25, 118, 210, 0.14)" },
	heading: { marginBottom: "24px" },
	eyebrow: { color: "#1976d2", fontWeight: "700", fontSize: "14px" },
	title: { margin: "8px 0", color: "#172b4d", fontSize: "clamp(26px, 5vw, 34px)" },
	subtitle: { margin: 0, color: "#64748b", lineHeight: 1.5 },
	form: { display: "grid", gap: "16px" },
	label: { display: "grid", gap: "8px", color: "#334155", fontWeight: "600" },
	input: { width: "100%", padding: "13px 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "16px", outline: "none" },
	button: { border: 0, borderRadius: "10px", padding: "14px", background: "#1976d2", color: "#fff", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
	secondaryButton: { border: "1px solid #1976d2", borderRadius: "10px", padding: "13px", background: "#fff", color: "#1976d2", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
	error: { padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", lineHeight: 1.4 },
	footerText: { margin: "24px 0 0", textAlign: "center", color: "#64748b" },
	link: { color: "#1976d2", fontWeight: "700" },
};

export default Register;
