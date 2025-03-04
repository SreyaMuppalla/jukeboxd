import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc} from "firebase/firestore";

export const addSongById = async (songId, songData) => {
    try {
      // Create a document reference in the 'songs' collection, using songId as the document ID
      const songRef = doc(db, "songs", songId);
  
      // Set the document at the reference with song data
      await setDoc(songRef, songData);
  
      console.log("Song added successfully!");
    } catch (error) {
      console.error("Error adding song: ", error);
    }
  };
  
  export const getSongById = async (songId) => {
    try {
      const songRef = doc(db, "songs", songId); // Reference to the song document
      const songSnap = await getDoc(songRef); // Fetch the document
  
      if (songSnap.exists()) {
        return songSnap.data(); // Return the song data if it exists
      } else {
        // Return null if the song is not found
        return null;
      }
    } catch (error) {
      console.error("Error fetching song: ", error);
      throw error; // Handle unexpected errors (e.g., network issues)
    }
  };
  