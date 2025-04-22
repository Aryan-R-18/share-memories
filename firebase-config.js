// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwTN5v3KVgJwoqBj8X6oBaLol29vB2i1w",
  authDomain: "first-year-63d1f.firebaseapp.com",
  projectId: "first-year-63d1f",
  storageBucket: "first-year-63d1f.firebasestorage.app",
  messagingSenderId: "1092822478938",
  appId: "1:1092822478938:web:39dee59c12bc332b01a863"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
