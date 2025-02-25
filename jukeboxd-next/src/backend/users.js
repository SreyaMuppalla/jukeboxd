import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc} from "firebase/firestore";

export const getUser = async (user_id) => {
    try{
        if(!user_id){
            throw new Error("Missing required parameters");
        }

        const userDoc = await getDoc(doc(db, "users", user_id));
        if(!userDoc.exists()){
            throw new Error("User not found");
        }

        return userDoc.data();
    }
    catch(error){
        throw error;
    }
};

export const createUser = async (user_id, email, profilePicture, user_bio) => {
    try{
        if(!user_id || !email){
            throw new Error("Missing required parameters");
        }

        const user = {
            username: user_id,
            email,
            profilePicture,
            user_bio,
            bookmarkedSongs: [],
            created_at: new Date().toISOString(),
            followers: [],
            following: [],
            reviews: []
        };

        const userRef = doc(db, "users", user_id);
        await setDoc(userRef, user);
    }
    catch(error){
        throw error;
    }
}