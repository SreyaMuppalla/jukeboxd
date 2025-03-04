import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, updateDoc} from "firebase/firestore";

export const getUser = async (user_id) => {
    try{
        if(!user_id){
            throw new Error("Missing user_id parameter");
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
            if(!user_id){
                throw new Error("Missing user_id parameter");
            }
            if(!email){
                throw new Error("Missing email parameter");
            }
        }

        const user = {
            username: user_id,
            email,
            profile_picture,
            user_bio,
            bookmarkedSongs: [],
            created_at: new Date().toISOString(),
            followers: [],
            following: [],
            reviews: []
        };

        const userRef = doc(db, "users", user_id);
        const existingUserDoc = await getDoc(userRef);
        if (existingUserDoc.exists()) {
            throw new Error("User already exists");
        }
        await setDoc(userRef, user);
        return user;
    }
    catch(error){
        throw error;
    }
}

export const updateUserBio = async (user_id, new_bio) => {
    try {
        if (!user_id || !new_bio) {
            throw new Error("Missing user_id or new_bio parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        await updateDoc(userRef, {
            user_bio: new_bio
        });

        return { message: "User bio updated successfully" };
    } catch (error) {
        throw error;
    }
};
export const updateUserProfilePicture = async (user_id, profile_picture_url) => {
    try {
        if (!user_id || !profile_picture_url) {
            throw new Error("Missing user_id or profile_picture_url parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        await updateDoc(userRef, {
            profile_picture: profile_picture_url
        });

        return { message: "Profile picture updated successfully" };
    } catch (error) {
        throw error;
    }
};