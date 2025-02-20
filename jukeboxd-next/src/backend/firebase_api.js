import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";

/** USERS **/
export const addUser = async (userId, userData) => {
    await setDoc(doc(db, "users", userId), userData);
};

export const getUser = async (user_id) => {
    const userDoc = await getDoc(doc(db, "users", user_id));
    return userDoc.exists() ? userDoc.data() : null;
};

/** SONGS **/
export const addSong = async (song) => {
    await addDoc(collection(db, "songs"), song);
};

export const getSong = async (song_id) => {
    const songDoc = await getDoc(doc(db, "songs", song_id));
    return songDoc.exists() ? songDoc.data() : null;
};

export const getAllSongs = async () => {
    const querySnapshot = await getDocs(collection(db, "songs"));
    return querySnapshot.docs.map(doc => doc.data());
};

/** REVIEWS **/
export const addReview = async (review) => {
    await setDoc(doc(db, "reviews", review.review_id), review);
};

export const getReviewsForSong = async (song_id) => {
    const q = query(collection(db, "reviews"), where("song_id", "==", song_id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};

export const likeReview = async (review_id) => {
    const reviewRef = doc(db, "reviews", review_id);
    const reviewDoc = await getDoc(reviewRef);
    if (reviewDoc.exists()) {
        await updateDoc(reviewRef, { likes: (reviewDoc.data().likes || 0) + 1 });
    }
};

export const dislikeReview = async (review_id) => {
    const reviewRef = doc(db, "reviews", review_id);
    const reviewDoc = await getDoc(reviewRef);
    if (reviewDoc.exists()) {
        await updateDoc(reviewRef, { dislikes: (reviewDoc.data().dislikes || 0) + 1 });
    }
};

/** COMMENTS **/
export const addComment = async (commentData) => {
    try {
        const docRef = await addDoc(collection(db, "comments"), {
            ...commentData,
            created_at: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
};

export const getCommentsForReview = async (review_id) => {
    try {
        const commentsRef = collection(db, "comments");
        const q = query(commentsRef, where("review_id", "==", review_id), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);

        const comments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
};
