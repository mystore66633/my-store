// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmdDEm52AYPAxDhEfxG3MZxuZomItHZvg",
  authDomain: "store-app-7e01b.firebaseapp.com",
  projectId: "store-app-7e01b",
  storageBucket: "store-app-7e01b.firebasestorage.app",
  messagingSenderId: "3901278863",
  appId: "1:3901278863:web:545eb3faee9c74a917fefa",
  measurementId: "G-8NE9CRCF2E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Export app
export default app;