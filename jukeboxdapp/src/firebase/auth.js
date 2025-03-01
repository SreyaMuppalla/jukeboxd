import { auth, googleProvider } from "./firebaseConfig.js";
import { signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

// create context obj to share data across components
const AuthContext = createContext();

// hook to make accessing the context easier
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(auth?.currentUser?.email);

    // sign in with google
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    // sign out
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };
    // Effect to listen for auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe; // Unsubscribe when component unmounts
    }, []);

    // Value to provide to consumers of the context
    const value = {
        currentUser,
        signInWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
