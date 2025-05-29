import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, runTransaction } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBeXmP-U5F1R41ZH2LPsy43V6xxkm0nt7o",
  authDomain: "budget-e82ba.firebaseapp.com",
  databaseURL: "https://budget-e82ba-default-rtdb.firebaseio.com",
  projectId: "budget-e82ba",
  storageBucket: "budget-e82ba.firebasestorage.app",
  messagingSenderId: "914830068997",
  appId: "1:914830068997:web:0af4e3aecdd2907233fb6c",
  measurementId: "G-QK0C3EZ274"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, ref, onValue, set, runTransaction }; 