// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTxggM9pxt84DAzUYySZLDLgvfDz4r9lM",
  authDomain: "eventhive-8db9a.firebaseapp.com",
  projectId: "eventhive-8db9a",
  storageBucket: "eventhive-8db9a.appspot.com",
  messagingSenderId: "545020124285",
  appId: "1:545020124285:web:3d449d6ea83c425d60e514",
  measurementId: "G-48DV19NYHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // NEW
