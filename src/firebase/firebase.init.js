// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Get these values from your Firebase project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvuT0cVZ0jdLZ5sKH8J-8L0C0h5q5z5z5",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mizizzi-1613c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mizizzi-1613c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mizizzi-1613c.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "104754232610",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:104754232610:web:c3f3c3f3c3f3c3f3c3f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

export default auth;
