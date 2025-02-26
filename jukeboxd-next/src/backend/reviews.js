import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, addDoc} from "firebase/firestore";


export const getReview = async (review_id) => {
    try{
        if(!review_id){
            throw new Error("Missing required parameters");
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

export const createReview = async (user_id, is_song, name, rating, review_text) => {
    try{
        if(!user_id || typeof rating !== 'number' || !name){
            throw new Error("Missing required parameters");
        }
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
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

        const userReviews = userDoc.data().reviews || [];
        userReviews.push(review);
        await setDoc(userRef, { reviews: userReviews }, { merge: true });

    } catch (error) {
        throw error;
    }
}

export const getAllReviews = async () => {
    try{
        const reviews = [];
        const querySnapshot = await getDocs(collection(db, "reviews"));
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });

        return reviews;
    }
    catch(error){
        throw error;
    }
}