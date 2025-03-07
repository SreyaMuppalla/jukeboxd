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
import { auth } from "./firebaseConfig";
import { createUser, usernameExists } from "./users";

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

    const signUp = async (username, email, password, profilePicture, bio) => {
        try {
            const usernameInDB = await usernameExists(username);
            if (usernameInDB) {
                throw new Error("Username already exists");
            }
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            const create = await createUser(user.uid, username, email, profilePicture, bio);

            return userCredential;
        } catch (err) {
            throw err;
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential;
        } catch (err) {
            throw new Error("Invalid email or password");
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
