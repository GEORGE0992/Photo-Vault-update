
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT CONFIG VALUES
const firebaseConfig = {
  apiKey: "AIzaSyCqXz5H9rP3t6v5Srj-IfNDBpWB2SUenUE",
  authDomain: "firegeorge-a216e.firebaseapp.com",
  projectId: "firegeorge-a216e",
  storageBucket: "firegeorge-a216e.appspot.com", // Usually .appspot.com for storage
  messagingSenderId: "35797401399",
  appId: "1:35797401399:web:7f9a7296dcfa52cc0f24b2"
};

// Initialize Firebase
// Check if Firebase has already been initialized to prevent errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
