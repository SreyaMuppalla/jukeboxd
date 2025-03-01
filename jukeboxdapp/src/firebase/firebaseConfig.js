// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";
//import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTCj418fPmWFAOSRzJ_5fDUsH1E8fwAVs",
    authDomain: "jukeboxd-w25.firebaseapp.com",
    databaseURL: "https://jukeboxd-w25-default-rtdb.firebaseio.com",
    projectId: "jukeboxd-w25",
    storageBucket: "jukeboxd-w25.firebasestorage.app",
    messagingSenderId: "53948329337",
    appId: "1:53948329337:web:ac075998d8a34b01b413a8",
    measurementId: "G-8RTTBF9JZQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

//database
//export const db = getFirestore(app);
