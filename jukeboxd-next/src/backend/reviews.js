import {db} from "./firebaseConfig";
import {doc, getDoc, addDoc, getDocs, query, collection, where, updateDoc} from "firebase/firestore";


export const getReviewById = async (review_id) => {
    try{
        if(!review_id){
            throw new Error("Missing review_id parameter");
        }

        const reviewDoc = await getDoc(doc(db, "reviews", review_id));
        if(!reviewDoc.exists()){
            throw new Error("Review not found");
        }

        return reviewDoc.data();
    }
    catch(error){
        throw error;
    }
};

export const createReview = async (reviewData) => {
    try {
        // Validate required fields
        const requiredFields = ['user_id', 'rating'];
        const missingFields = requiredFields.filter(field => !reviewData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate rating is a number
        if (typeof reviewData.rating !== 'number') {
            throw new Error("Invalid rating parameter");
        }

        // Ensure at least one of album_id or song_id is provided
        if (!reviewData.album_id && !reviewData.song_id) {
            throw new Error("Need to provide either album_id or song_id");
        }

        // Check if user exists
        const userRef = doc(db, "users", reviewData.user_id);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error("User does not exist");
        }

        // Prepare review object with default values and provided data
        const review = {
            song_id: reviewData.song_id || null,
            song_name: reviewData.song_name || null,
            album_id: reviewData.album_id || null,
            album_name: reviewData.album_name || null,
            artists: reviewData.artists || [],
            user_id: reviewData.user_id,
            user_pfp: reviewData.user_pfp || null,
            image: reviewData.image || null,
            rating: reviewData.rating,
            review_text: reviewData.review_text || null,
            likes: reviewData.likes || 0,
            dislikes: reviewData.dislikes || 0,
            date: reviewData.date || new Date(),
            created_at: new Date()
        };

        // Add review to Firestore
        const reviewDocRef = await addDoc(collection(db, "reviews"), review);
        const reviewDocId = reviewDocRef.id;

        // Update user's reviews array
        await updateDoc(userRef, {
            reviews: [...(userDoc.data().reviews || []), reviewDocId]
        });

        return reviewDocId;

    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
}

export const getFriendReviews = async (user_id) => {
    try{
        if(!user_id){
            throw new Error("Missing user_id parameter");
        }
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        const user_friends = userDoc.data()?.following || [];
        if(user_friends.length === 0){
            return [];
        }
        const reviews = [];
        const querySnapshot = await getDocs(query(collection(db, "reviews"), where("user_id", "in", user_friends)));
        querySnapshot.forEach((doc) => {
            reviews.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return reviews;
    }
    catch(error){
        throw error;
    }
}

export const getSongReviews = async (song_id) => {
    try{
        if(!song_id){
            throw new Error("Missing song_id");
        }

        const reviews = [];
        const querySnapshot = await getDocs(query(collection(db, "reviews"), where("is_song", "==", true), where("song_id", "==", song_id)));
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });

        return reviews;
    }
    catch(error){
        throw error;
    }
}