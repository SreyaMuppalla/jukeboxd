import { db } from "./firebaseConfig";
import { 
    collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, query, where, arrayUnion, arrayRemove
} from "firebase/firestore";

/** REVIEWS **/
export const createReview = async (user_id, is_song, name, rating, review_text) => {
    try {
        //Verify Parameters
        if (!user_id || typeof rating !== 'number' || !name) {
            throw new Error("Missing or invalid required parameters");
        }

        // Check if user exists
        const userDoc = await getDoc(doc(db, "users", user_id));
        if (!userDoc.exists()) {
            throw new Error("User does not exist");
        }

        const review = {
            user_id,
            is_song,
            name,
            rating,
            review_text,
            likes: 0,
            dislikes: 0,
            comments: [], 
            created_at: new Date()
        };

        await addDoc(collection(db, "reviews"), review);
    } catch (error) {
        throw error;
    }
};

export const getReview = async (user_id, review_id) => {
    try {
        if (!user_id || !review_id) {
            throw new Error("Missing required parameters");
        }

        const reviewDoc = await getDoc(doc(db, "reviews", review_id));
        if (!reviewDoc.exists()) {
            throw new Error("Review not found");
        }

        const reviewData = reviewDoc.data();
        return {
            rating: reviewData.rating,
            review_text: reviewData.review_text,
            dislikes: reviewData.dislikes || 0,
            likes: reviewData.likes || 0,
            comments: reviewData.comments || [], 
            created_at: reviewData.created_at
        };
    } catch (error) {
        throw error;
    }
};

/** USERS **/
export const getUser = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("User ID is required");
        }

        const userDoc = await getDoc(doc(db, "users", user_id));
        if (!userDoc.exists()) {
            throw new Error("User does not exist");
        }

        return userDoc.data();
    } catch (error) {
        throw error;
    }
};

export const createUser = async (prof_pic, user_name, bio) => {
    try {
        // Check if username already exists
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_name", "==", user_name));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            throw new Error("Username already exists");
        }

        const userData = {
            prof_pic,
            user_name,
            bio,
            past_reviews: [],
            bookmarked_songs: [],
            followers: [],
            following: [], 
            created_at: new Date()
        };

        await addDoc(collection(db, "users"), userData);
    } catch (error) {
        throw error;
    }
};

export const updateUserPic = async (user_id) => {
    try {
        const userRef = doc(db, "users", user_id);
        if (!(await getDoc(userRef)).exists()) {
            throw new Error("User does not exist");
        }
        await updateDoc(userRef, { prof_pic: prof_pic });
    } catch (error) {
        throw error;
    }
};

export const updateUserBio = async (user_id, bio) => {
    try {
        const userRef = doc(db, "users", user_id);
        if (!(await getDoc(userRef)).exists()) {
            throw new Error("User does not exist");
        }
        await updateDoc(userRef, { bio: bio });
    } catch (error) {
        throw error;
    }
};

export const updateBookmarkedSong = async (user_id, song) => {
    try {
        const userRef = doc(db, "users", user_id);
        if (!(await getDoc(userRef)).exists()) {
            throw new Error("User does not exist");
        }
        await updateDoc(userRef, {
            bookmarked_songs: arrayUnion(song)
        });
    } catch (error) {
        throw error;
    }
};

export const deleteBookmarkedSong = async (user_id, song) => {
    try {
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            throw new Error("User does not exist");
        }
        
        const userData = userDoc.data();
        if (!userData.bookmarked_songs.includes(song)) {
            throw new Error("Song not found in bookmarks");
        }
        
        await updateDoc(userRef, {
            bookmarked_songs: arrayRemove(song)
        });
    } catch (error) {
        throw error;
    }
};

export const updateFollower = async (user_id1, user_id2) => {
    try {
        const user1Ref = doc(db, "users", user_id1);
        const user2Ref = doc(db, "users", user_id2);
        
        const [user1Doc, user2Doc] = await Promise.all([
            getDoc(user1Ref),
            getDoc(user2Ref)
        ]);

        if (!user1Doc.exists() || !user2Doc.exists()) {
            throw new Error("One or both users do not exist");
        }

        await Promise.all([
            updateDoc(user1Ref, {
                followers: arrayUnion(user_id2)
            }),
            updateDoc(user2Ref, {
                following: arrayUnion(user_id1)
            })
        ]);
    } catch (error) {
        throw error;
    }
};

/** SONG REVIEWS **/
export const getAllReviewsSong = async (song) => {
    try {
        if (!song) {
            throw new Error("Song name is required");
        }

        const q = query(collection(db, "reviews"), where("name", "==", song), orderBy("created_at", 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

/** LIKES AND DISLIKES **/
export const createLike = async (comment_id) => {
    try {
        const docRef = doc(db, "reviews", comment_id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Comment/Review does not exist");
        }
        
        await updateDoc(docRef, {
            likes: (docSnap.data().likes || 0) + 1
        });
    } catch (error) {
        throw error;
    }
};

export const createDislike = async (comment_id) => {
    try {
        const docRef = doc(db, "reviews", comment_id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Comment/Review does not exist");
        }
        
        await updateDoc(docRef, {
            dislikes: (docSnap.data().dislikes || 0) + 1
        });
    } catch (error) {
        throw error;
    }
};

export const deleteLike = async (comment_id) => {
    try {
        const docRef = doc(db, "reviews", comment_id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Comment/Review does not exist");
        }
        
        const currentLikes = docSnap.data().likes || 0;
        await updateDoc(docRef, {
            likes: Math.max(0, currentLikes - 1)
        });
    } catch (error) {
        throw error;
    }
};

export const deleteDislike = async (comment_id) => {
    try {
        const docRef = doc(db, "reviews", comment_id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Comment/Review does not exist");
        }
        
        const currentDislikes = docSnap.data().dislikes || 0;
        await updateDoc(docRef, {
            dislikes: Math.max(0, currentDislikes - 1)
        });
    } catch (error) {
        throw error;
    }
};

/** COMMENTS **/
export const createComment = async (review_id, user_id, comment_text) => {
    try {
        const comment = {
            review_id,
            user_id,
            comment_text,
            created_at: new Date(),
            likes: 0,
            dislikes: 0
        };

        const docRef = await addDoc(collection(db, "comments"), comment);
        
        // Update the review's comments array
        const reviewRef = doc(db, "reviews", review_id);
        await updateDoc(reviewRef, {
            comments: arrayUnion(docRef.id)
        });

        return docRef.id;
    } catch (error) {
        throw error;
    }
};

export const getComment = async (comment_id) => {
    try {
        const commentDoc = await getDoc(doc(db, "comments", comment_id));
        if (!commentDoc.exists()) {
            throw new Error("Comment does not exist");
        }
        return commentDoc.data();
    } catch (error) {
        throw error;
    }
};


export const getCommentsForReview = async (review_id) => {
    try {
        const q = query(
            collection(db, "comments"),
            where("review_id", "==", review_id),
            orderBy("created_at", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};