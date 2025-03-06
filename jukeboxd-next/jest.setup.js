import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Firebase Test Config
const firebaseConfig = {
  apiKey: "test",
  authDomain: "test",
  projectId: "test",
  storageBucket: "test",
  messagingSenderId: "test",
  appId: "test",
};

// Ensure Firebase is initialized only once and not deleted before tests
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

// Ensure Firebase Emulators are properly connected
if (process.env.NODE_ENV === "test") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// Expose Firebase globally for tests
global.firebaseAuth = auth;
global.firebaseDb = db;