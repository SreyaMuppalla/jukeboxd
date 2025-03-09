import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc} from "firebase/firestore";

/**
 * Adds an artist document to Firestore with the provided artist data.
 * @param {string} artistId - The unique identifier of the artist.
 * @param {Object} artistData - The data for the artist to be added.
    * @param {string} artistData.id - The unique identifier of the artist.
    * @param {string} artistData.name - The name of the artist.
 * @throws {Error} Throws an error if there is an issue fetching the album data (e.g., network error).
 */
export const addArtistById = async (artistId, artistData) => {
  try {
    if (!artistId) {
      throw new Error("Missing artistId parameter");
    }
    if (!artistData) {
        throw new Error("Missing artistData parameter");
    }
    // Create a reference to the 'artists' collection with artistId as the document ID
    const artistRef = doc(db, "artists", artistId);

    // Set the artist document in Firestore with the provided artist data
    await setDoc(artistRef, artistData);

    console.log("Artist added successfully!");
  } catch (error) {
    console.error("Error adding artist: ", error);
    throw error;
  }
};

/**
 * Retrieves an artist document from Firestore using the provided artist ID.
 * @param {string} artistId - The unique identifier of the artist.
 * @returns {Promise<Object|null>} - The artist data if found, or null if the artist is not found.
    * @returns {string} artistData.id - The unique identifier of the artist.
    * @returns {string} artistData.name - The name of the artist.
 * @throws {Error} Throws an error if there is an issue fetching the album data (e.g., network error).
 */
export const getArtistById = async (artistId) => {
  try {
    if (!artistId) {
      throw new Error("Missing artistId parameter");
    }
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
