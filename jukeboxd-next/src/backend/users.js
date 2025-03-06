import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, updateDoc, query, where, orderBy, startAt, endAt, getDocs, collection} from "firebase/firestore";

/**
 * Retrieves the data of a user based on their user_id.
 * 
 * @param {string} user_id - The ID of the user whose data is to be retrieved.
 * @returns {Promise<Object>} The data of the user if found. Grabs data like profile picture, user name, and email
 * @throws {Error} Throws an error if the `user_id` parameter is missing or the user is not found.
 */
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

/**
 * Checks if a user exists in the database based on the provided user_id.
 * 
 * @param {string} user_id - The ID of the user to check for existence.
 * @returns {Promise<boolean>} Returns `true` if the user exists, otherwise `false`.
 * @throws {Error} Throws an error if the `user_id` parameter is missing or if an issue occurs while retrieving the user document.
 */
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

/**
 * Creates a new user in the database.
 * 
 * @param {string} user_id - The unique identifier for the user.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} profilePicture - The profile picture URL of the user.
 * @param {string} user_bio - The biography of the user.
 * @returns {Promise<Object>} The user object that was created.
 * @throws {Error} Throws an error if required parameters are missing, the user already exists, or any issue occurs while creating the user.
 */
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

/**
 * Updates the biography of a user in the database.
 * 
 * @param {string} user_id - The unique identifier for the user whose bio is being updated.
 * @param {string} new_bio - The new biography text to update.
 * @returns {Promise<Object>} A success message indicating the bio update was successful.
 * @throws {Error} Throws an error if the `user_id` or `new_bio` parameters are missing, the user is not found, or any issue occurs during the update process.
 */
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
            bio: new_bio
        });

        return { message: "User bio updated successfully" };
    } catch (error) {
        throw error;
    }
};

/**
 * Searches for users in the database by username.
 * 
 * @param {string} username - The username to search for. The search is case-insensitive and matches usernames that start with the input string.
 * @returns {Promise<Array>} A list of user objects that match the search criteria.
 * Each user object contains the user's ID and data from the Firestore document.
 * @throws {Error} Throws an error if there is an issue retrieving the users from the database.
 */
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

/**
 * Allows a user to follow another user.
 * 
 * @param {string} user_id - The ID of the user who wants to follow another user.
 * @param {string} friend_id - The ID of the user to be followed.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or friend_id parameter.
 *  - User or friend does not exist in the database.
 *  - User is already following the friend or vice versa.
 */
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
/**
 * Allows a user to unfollow another user.
 * 
 * @param {string} user_id - The ID of the user who wants to unfollow another user.
 * @param {string} friend_id - The ID of the user to be unfollowed.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or friend_id parameter.
 *  - User or friend does not exist in the database.
 *  - User is not following the friend.
 */
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
/**
 * Adds a song to the user's list of bookmarked songs.
 * 
 * @param {string} user_id - The ID of the user who wants to bookmark the song.
 * @param {string} song_id - The ID of the song to be bookmarked.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or song_id parameter.
 *  - User does not exist in the database.
 */
export const BookmarkSong = async (user_id, song_id) => {
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
            bookmarkedSongs: [...(userDoc.data().bookmarkedSongs || []), song_id]
        });

        return { message: "Song bookmarked successfully" };
    } catch (error) {
        throw error;
    }
};

/**
 * Removes a song from the user's list of bookmarked songs.
 * 
 * @param {string} user_id - The ID of the user who wants to remove the song from bookmarks.
 * @param {string} song_id - The ID of the song to be removed from the bookmarks.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or song_id parameter.
 *  - User does not exist in the database.
 */
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
/**
 * Adds an album to the user's list of bookmarked albums.
 * 
 * @param {string} user_id - The ID of the user who wants to bookmark the album.
 * @param {string} album_id - The ID of the album to be bookmarked.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or album_id parameter.
 *  - User does not exist in the database.
 */
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
/**
 * Removes an album from the user's list of bookmarked albums.
 * 
 * @param {string} user_id - The ID of the user who wants to remove the album from bookmarks.
 * @param {string} album_id - The ID of the album to be removed from the bookmarks.
 * @returns {Promise<Object>} An object containing a success message if the operation is successful.
 * @throws {Error} Throws an error if any of the following conditions are met:
 *  - Missing user_id or album_id parameter.
 *  - User does not exist in the database.
 */
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
