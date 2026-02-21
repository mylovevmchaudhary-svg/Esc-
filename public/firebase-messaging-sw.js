// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/firebase-logo.png'
  };

  if (Notification.permission === 'granted') {
    new Notification(notificationTitle, notificationOptions);
  }
});
