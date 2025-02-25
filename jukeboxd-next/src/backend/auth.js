"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // check if user exists
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            // if user doesn't exist, add to Firestore
            if (!userDocSnapshot.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                });
            }

            return userCredential; // Return userCredential if sign-up is successful
        } catch (err) {
            throw err; // Propagate error
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential; // Return userCredential if login is successful
        } catch (err) {
            // Throw custom error messages based on Firebase error codes
            if (err.code === "auth/user-not-found") {
                throw new Error("User not found. Please sign up first.");
            } else if (err.code === "auth/wrong-password") {
                throw new Error("Incorrect password. Please try again.");
            } else {
                throw new Error("An error occurred. Please try again.");
            }
        }
    };

    const logOut = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signInWithGoogle,
                signUp,
                signInWithEmail,
                logOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
