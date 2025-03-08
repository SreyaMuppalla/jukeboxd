import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTCj418fPmWFAOSRzJ_5fDUsH1E8fwAVs",
  authDomain: "jukeboxd-w25.firebaseapp.com",
  databaseURL: "https://jukeboxd-w25-default-rtdb.firebaseio.com",
  projectId: "jukeboxd-w25",
  storageBucket: "jukeboxd-w25.firebasestorage.app",
  messagingSenderId: "53948329337",
  appId: "1:53948329337:web:ac075998d8a34b01b413a8",
  measurementId: "G-8RTTBF9JZQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
