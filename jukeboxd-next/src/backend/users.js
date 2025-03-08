import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, updateDoc, query, where, orderBy, startAt, endAt, getDocs, collection} from "firebase/firestore";

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

export const checkUser = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error('Missing user_id parameter');
    }

    const userDoc = await getDoc(doc(db, 'users', user_id));
    if (!userDoc.exists()) {
    //   throw new Error('User not found');
        return false
    }

    return true
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user_id, username, email, profilePicture, user_bio) => {
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
            username: username,
            email,
            profilePicture,
            user_bio,
            bookmarkedSongs: [],
            bookmarkedAlbums: [],
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

export const updateUsername = async (user_id, new_username) => {
    try {
        if (!user_id || !new_username) {
            throw new Error("Missing user_id or new_username parameter");
        }

        // Check if the new username already exists
        const usernameInDB = await usernameExists(new_username);
        if (usernameInDB) {
            throw new Error(`Error: Username "${new_username}" already exists`);
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        // Proceed with updating the username if no conflict exists
        await updateDoc(userRef, {
            username: new_username
        });

        return { message: "Username updated successfully" };
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
            profilePicture: profile_picture_url
        });

        return { message: "Profile picture updated successfully" };
    } catch (error) {
        throw error;
    }
};

export const searchUsers = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      orderBy("username"),
      startAt(username),
      endAt(username + "\uf8ff")
    );
  
    try {
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return users;
    } catch (error) {
      console.error("Error searching for users:", error);
      return [];
    }
  };

  export const usernameExists = async (username) => {
    try {
        if (!username) {
            throw new Error("Missing username parameter");
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));

        const querySnapshot = await getDocs(q);
        
        // If any document is found, it means the username exists
        if (!querySnapshot.empty) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
};

  export const followUser = async (user_id, friend_id) => {
    try {
        if (!user_id || !friend_id) {
            throw new Error("Missing user_id or friend_id parameter");
        }

        const userRef = doc(db, "users", user_id);
        const friendRef = doc(db, "users", friend_id);
        const userDoc = await getDoc(userRef);
        const friendDoc = await getDoc(friendRef);

        if (!userDoc.exists() || !friendDoc.exists()) {
            throw new Error("User not found");
        }

        const userFollowing = userDoc.data().following || [];
        const friendFollowers = friendDoc.data().followers || [];

        if (userFollowing.includes(friend_id) || friendFollowers.includes(user_id)) {
            throw new Error("User is already following this friend");
        }

        userFollowing.push(friend_id);
        friendFollowers.push(user_id);

        await updateDoc(userRef, {
            following: userFollowing
        });

        await updateDoc(friendRef, {
            followers: friendFollowers
        });

        return { message: "User followed successfully" };
    } catch (error) {
        throw error;
    } 
}

export const UnfollowUser = async (user_id, friend_id) => {
    try {
        if (!user_id || !friend_id) {
            throw new Error("Missing user_id or friend_id parameter");
        }

        const userRef = doc(db, "users", user_id);
        const friendRef = doc(db, "users", friend_id);
        const userDoc = await getDoc(userRef);
        const friendDoc = await getDoc(friendRef);

        if (!userDoc.exists() || !friendDoc.exists()) {
            throw new Error("User not found");
        }

        let userFollowing = userDoc.data().following || [];
        let friendFollowers = friendDoc.data().followers || [];

        if (!userFollowing.includes(friend_id) || !friendFollowers.includes(user_id)) {
            throw new Error("User is not following this friend");
        }

        userFollowing = userFollowing.filter(id => id !== friend_id);
        friendFollowers = friendFollowers.filter(id => id !== user_id);

        await updateDoc(userRef, {
            following: userFollowing
        });

        await updateDoc(friendRef, {
            followers: friendFollowers
        });

        return { message: "User unfollowed successfully" };
    } catch (error) {
        throw error;
    }
}

export const BookmarkSong = async (user_id, song_id, song_name, song_artist) => {
    try {
        if (!user_id || !song_id || !song_name || !song_artist) {
            throw new Error("Missing user_id, song_id, song_name, or song_artist parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        const currentBookmarks = userDoc.data().bookmarkedSongs || [];

        await updateDoc(userRef, {
            bookmarkedSongs: [...currentBookmarks, {song_id, song_name, song_artist}]
        });

        return { message: "Song bookmarked successfully" };
    } catch (error) {
        throw error;
    }
};

export const removeSongBookmark = async (user_id, song_id) => {
    try {
        if (!user_id || !song_id) {
            throw new Error("Missing user_id or song_id parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        await updateDoc(userRef, {
            bookmarkedSongs: userDoc.data().bookmarkedSongs.filter(id => id !== song_id)
        });

        return { message: "Song removed from bookmarks successfully" };
    } catch (error) {
        throw error;
    }
}

export const BookmarkAlbum = async (user_id, album_id) => {
    try {
        if (!user_id || !album_id) {
            throw new Error("Missing user_id or album_id parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        await updateDoc(userRef, {
            bookmarkedAlbums: [...(userDoc.data().bookmarkedAlbums || []), album_id]
        });

        return { message: "Album bookmarked successfully" };
    } catch (error) {
        throw error;
    }
};

export const removeAlbumBookmark = async (user_id, album_id) => {
    try {
        if (!user_id || !album_id) {
            throw new Error("Missing user_id or album_id parameter");
        }

        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        await updateDoc(userRef, {
            bookmarkedAlbums: userDoc.data().bookmarkedAlbums.filter(id => id !== album_id)
        });

        return { message: "Album removed from bookmarks successfully" };
    } catch (error) {
        throw error;
    }
}
