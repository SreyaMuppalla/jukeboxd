import { auth, provider, db } from "./firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

// User Authentication
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
            user_id: user.uid,
            username: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
            created_at: new Date()
        }, { merge: true });
        return user;
    } catch (error) {
        console.error("Error signing in: ", error);
        return null;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};

// Fetch User Data
export const getUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

// Add Review
export const addReview = async (userId, songId, rating, reviewText) => {
    const reviewRef = collection(db, "reviews");
    await addDoc(reviewRef, {
        user_id: userId,
        song_id: songId,
        rating,
        review_text: reviewText,
        created_at: new Date()
    });
};

// Get Reviews for a Song
export const getReviewsForSong = async (songId) => {
    const q = query(collection(db, "reviews"), where("song_id", "==", songId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};
