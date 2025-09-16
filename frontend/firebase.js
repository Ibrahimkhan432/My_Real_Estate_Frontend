// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "signup-login-4c030.firebaseapp.com",
  databaseURL: "https://signup-login-4c030-default-rtdb.firebaseio.com",
  projectId: "signup-login-4c030",
  storageBucket: "signup-login-4c030.firebasestorage.app",
  messagingSenderId: "988879950045",
  appId: "1:988879950045:web:dd5aad81c151a8bab0cb34",
  measurementId: "G-TFKLCSD733",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
