import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";

/** USERS **/
export const addUser = async (user) => {
    await setDoc(doc(db, "users", user.user_id), user);
};

export const getUser = async (user_id) => {
    const userDoc = await getDoc(doc(db, "users", user_id));
    return userDoc.exists() ? userDoc.data() : null;
};

/** SONGS **/
export const addSong = async (song) => {
    await setDoc(doc(db, "songs", song.song_id), song);
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
export const addComment = async (comment) => {
    await setDoc(doc(db, "comments", comment.comment_id), comment);
};

export const getCommentsForReview = async (review_id) => {
    const q = query(collection(db, "comments"), where("review_id", "==", review_id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};
