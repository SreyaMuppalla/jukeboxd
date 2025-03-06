import {db} from "./firebaseConfig";
import {doc, getDoc, addDoc, getDocs, query, collection, where, updateDoc} from "firebase/firestore";

/**
 * Retrieves a review document from the database by its ID.
 * 
 * @param {string} review_id - The ID of the review to retrieve.
 * @returns {Promise<Object>} The data of the review if found.
 * @throws {Error} Throws an error if the review ID is missing or the review does not exist.
 */
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

/**
 * Creates a new review in the database after validating the provided review data.
 * 
 * @param {Object} reviewData - The data of the review to create.
    * @param {string} reviewData.user_id - The ID of the user who is creating the review.
    * @param {number} reviewData.rating - The rating for the review.
    * @param {string} reviewData.song_id - The ID of the song being reviewed.
    * @param {string} reviewData.song_name - The name of the song being reviewed.
    * @param {string} reviewData.album_id - The ID of the album being reviewed.
    * @param {string} reviewData.album_name - The name of the album being reviewed.
    * @param {Array}  reviewData.artists - The list of artists involved with the album/song.
    * @param {string} reviewData.username - The username of the user creating the review.
    * @param {string} reviewData.user_pfp - The profile picture of the user creating the review.
    * @param {Array}  reviewData.images - Array of image URLs related to the review.
    * @param {string} reviewData.review_text - The review text written by the user.
    * @param {number} reviewData.likes - The number of likes for the review.
    * @param {number} reviewData.dislikes - The number of dislikes for the review.
    * @param {Date}   reviewData.date - The date the review was created.
    * @param {string} reviewData.type - The type of review (e.g., "song", "album").
 * @returns {Promise<string>} The ID of the newly created review document.
 * @throws {Error} Throws an error if any validation fails or if the user does not exist.
 */
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
            username: reviewData.username || null,
            user_pfp: reviewData.user_pfp || null,
            images: reviewData.images || null,
            rating: reviewData.rating,
            review_text: reviewData.review_text || null,
            likes: reviewData.likes || 0,
            dislikes: reviewData.dislikes || 0,
            date: reviewData.date || new Date(),
            type: reviewData.type,
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
/**
 * Retrieves reviews created by the user's friends (people they are following).
 * 
 * @param {string} user_id - The ID of the user whose friends' reviews are to be retrieved.
 * @returns {Promise<Array>} A list of reviews created by the user's friends.
 * @throws {Error} Throws an error if the `user_id` parameter is missing or any other error occurs while retrieving data.
 */
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

/**
 * Retrieves reviews for a specific item (either a song or an album) based on the provided item ID and type.
 * 
 * @param {string} item_id - The ID of the item (song or album) for which to retrieve reviews.
 * @param {string} song_or_album - The type of item being reviewed, either "song" or "album".
 * @returns {Promise<Array>} A list of review objects for the specified item.
 * @throws {Error} Throws an error if either the `song_or_album` or `item_id` parameter is missing.
 */
export const getReviews = async (item_id, song_or_album) => {
    try{
        if(!song_or_album){
            throw new Error("Missing song_or_album parameter");
        }
        if(!item_id){
            throw new Error("Missing item_id parameter");
        }

        const reviews = [];
        let querySnapshot;
        if(song_or_album === "song"){
        querySnapshot = await getDocs(query(collection(db, "reviews"), where("type", "==", "song"), where("song_id", "==", item_id)));
        }
        else{
        querySnapshot = await getDocs(query(collection(db, "reviews"), where("type", "==", "album"), where("album_id", "==", item_id)));
        }
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });

        return reviews;
    }
    catch(error){
        throw error;
    }
}