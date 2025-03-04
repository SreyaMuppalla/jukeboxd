import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc} from "firebase/firestore";

// Add artist by ID to Firestore
export const addArtistById = async (artistId, artistData) => {
  try {
    // Create a reference to the 'artists' collection with artistId as the document ID
    const artistRef = doc(db, "artists", artistId);

    // Set the artist document in Firestore with the provided artist data
    await setDoc(artistRef, artistData);

    console.log("Artist added successfully!");
  } catch (error) {
    console.error("Error adding artist: ", error);
  }
};

// Get artist by ID from Firestore
export const getArtistById = async (artistId) => {
  try {
    // Create a reference to the artist document with the given artistId
    const artistRef = doc(db, "artists", artistId);
    const artistSnap = await getDoc(artistRef);

    if (artistSnap.exists()) {
      // If the document exists, return the artist data
      return artistSnap.data();
    } else {
      // Return null if the artist is not found
      return null;
    }
  } catch (error) {
    console.error("Error fetching artist: ", error);
    throw error; // Handle unexpected errors
  }
};
