// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foody-cee52.firebaseapp.com",
  projectId: "foody-cee52",
  storageBucket: "foody-cee52.firebasestorage.app",
  messagingSenderId: "665512596537",
  appId: "1:665512596537:web:2de1d09eb9007fc4e569e8",
  measurementId: "G-GBR1F093ZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth};