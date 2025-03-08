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
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in likeReview()");
            return;
        }
        const reviewRef = doc(db, "reviews", review_id);
        const reviewDoc = await getDoc(reviewRef);
        if (!reviewDoc.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return;
        }
        const reviewData = reviewDoc.data();
        if (!reviewData || typeof reviewData.likes !== "number") {
            console.error("Error: Invalid review data structure:", reviewData);
            return;
        }
        await updateDoc(reviewRef, {
            likes: reviewData.likes + 1
        });

    } catch (error) {
        console.error("Error in likeReview:", error);
    }
};

export const getReviewLikes = async (review_id) => {
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in getReviewLikes()");
            return 0; // Default to 0 likes if the ID is invalid
        }

        const reviewRef = doc(db, "reviews", review_id);
        const reviewSnap = await getDoc(reviewRef);

        if (!reviewSnap.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return 0;
        }

        const reviewData = reviewSnap.data();
        return typeof reviewData.likes === "number" ? reviewData.likes : 0;

    } catch (error) {
        console.error("Error in getReviewLikes:", error);
        return 0; // Default to 0 if Firestore fails
    }
};

export const getReviewDislikes = async (review_id) => {
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in getReviewDislikes()");
            return 0;
        }

        const reviewRef = doc(db, "reviews", review_id);
        const reviewSnap = await getDoc(reviewRef);

        if (!reviewSnap.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return 0;
        }

        const reviewData = reviewSnap.data();
        return typeof reviewData.dislikes === "number" ? reviewData.dislikes : 0;

    } catch (error) {
        console.error("Error in getReviewDislikes:", error);
        return 0;
    }
};

export const dislikeReview = async (review_id) => {
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in dislikeReview()");
            return;
        }

        const reviewRef = doc(db, "reviews", review_id);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return;
        }

        const reviewData = reviewDoc.data();

        if (!reviewData || typeof reviewData.dislikes !== "number") {
            console.error("Error: Invalid review data structure:", reviewData);
            return;
        }

        await updateDoc(reviewRef, {
            dislikes: reviewData.dislikes + 1
        });

    } catch (error) {
        console.error("Error in dislikeReview:", error);
    }
};

export const removeLike = async (review_id) => {
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in removeLike()");
            return;
        }

        const reviewRef = doc(db, "reviews", review_id);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return;
        }

        const reviewData = reviewDoc.data();
        if (typeof reviewData.likes !== "number" || reviewData.likes <= 0) {
            console.error("Error: Invalid likes count:", reviewData.likes);
            return;
        }

        await updateDoc(reviewRef, {
            likes: reviewData.likes - 1
        });

    } catch (error) {
        console.error("Error in removeLike:", error);
    }
};

export const removeDislike = async (review_id) => {
    try {
        if (!review_id) {
            console.error("Error: Missing review_id in removeDislike()");
            return;
        }

        const reviewRef = doc(db, "reviews", review_id);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            console.error("Error: Review not found in Firestore for ID:", review_id);
            return;
        }

        const reviewData = reviewDoc.data();
        if (typeof reviewData.dislikes !== "number" || reviewData.dislikes <= 0) {
            console.error("Error: Invalid dislikes count:", reviewData.dislikes);
            return;
        }

        await updateDoc(reviewRef, {
            dislikes: reviewData.dislikes - 1
        });

    } catch (error) {
        console.error("Error in removeDislike:", error);
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
