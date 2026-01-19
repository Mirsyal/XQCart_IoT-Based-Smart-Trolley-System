// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAzA6FXdhcVfMZbjyPpBEVTCKlSSC2NP_U",
  authDomain: "xqcart-iot-smart-trolley.firebaseapp.com",
  databaseURL: "https://xqcart-iot-smart-trolley-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xqcart-iot-smart-trolley",
  storageBucket: "xqcart-iot-smart-trolley.firebasestorage.app",
  messagingSenderId: "1020995483236",
  appId: "1:1020995483236:web:36d125241358d3ac87d171",
  measurementId: "G-TLWX577EJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
