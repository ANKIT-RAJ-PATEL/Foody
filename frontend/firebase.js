// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-8c11f.firebaseapp.com",
  projectId: "vingo-food-delivery-8c11f",
  storageBucket: "vingo-food-delivery-8c11f.firebasestorage.app",
  messagingSenderId: "1066080035273",
  appId: "1:1066080035273:web:2d442b56b6e6865259c818"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth};