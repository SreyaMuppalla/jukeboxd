import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc} from "firebase/firestore";

export const addAlbumById = async (albumId, albumData) => {
    try {
      // Create a reference to the 'albums' collection with albumId as the document ID
      const albumRef = doc(db, "albums", albumId);
  
      // Set the album document in Firestore with the provided album data
      await setDoc(albumRef, albumData);
  
      console.log("Album added successfully!");
    } catch (error) {
      console.error("Error adding album: ", error);
    }
  };

  export const getAlbumById = async (albumId) => {
    try {
      // Create a reference to the album document with the given albumId
      const albumRef = doc(db, "albums", albumId);
      const albumSnap = await getDoc(albumRef);
  
      if (albumSnap.exists()) {
        // If the document exists, return the album data
        return albumSnap.data();
      } else {
        // Return null if the album is not found
        return null;
      }
    } catch (error) {
      console.error("Error fetching album: ", error);
      throw error; // Handle unexpected errors
    }
  };