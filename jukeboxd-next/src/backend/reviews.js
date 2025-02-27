import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, addDoc, getDocs, query, collection, where} from "firebase/firestore";


export const getReview = async (review_id) => {
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

export const createReview = async (user_id, is_song, name, rating, review_text) => {
    try{
        if(!user_id || typeof rating !== 'number' || !name){
            if (!user_id) {
            throw new Error("Missing user_id parameter");
            }
            if (typeof rating !== 'number') {
            throw new Error("Invalid rating parameter");
            }
            if (!name) {
            throw new Error("Missing name parameter");
            }
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

export const getFriendReviews = async (user_id) => {
    try{
        if(!user_id){
            throw new Error("Missing user_id parameter");
        }
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        const user_friends = userDoc.data().following || [];
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