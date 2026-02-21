import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQU4_jPpLJHIwv_tYzliGNsK33ubXLmfc",
  authDomain: "esc-airdrop-e40bf.firebaseapp.com",
  projectId: "esc-airdrop-e40bf",
  storageBucket: "esc-airdrop-e40bf.firebasestorage.app",
  messagingSenderId: "902832230065",
  appId: "1:902832230065:web:793e1315de33ca43addc90"
};

// Initialize Firebase
let app;
let db;
let auth;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  messaging = getMessaging(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Fallback to null so the app doesn't crash
  db = null;
  auth = null;
  messaging = null;
}

export { db, auth, messaging, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getToken, onMessage };
