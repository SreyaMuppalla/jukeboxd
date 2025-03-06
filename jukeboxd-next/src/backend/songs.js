import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, runTransaction, getDocs, collection, deleteDoc}  from "firebase/firestore";


/**
 * Adds song data along with associated album and artist information to the Firestore database.
 * 
 * @param {string} songId - The unique identifier of the song to be added.
 * @param {Object} songData - The object containing the song data to be added.
 * 
 * @param {string} songData.id - The unique identifier of the song.
 * @param {string} songData.name - The name of the song.
 * @param {Object} songData.album - An object containing details about the album the song belongs to.
 *     @param {string} songData.album.id - The unique identifier of the album.
 *     @param {string} songData.album.name - The name of the album.
 * @param {Array<Object>} songData.artists - An array of artist objects associated with the song.
 *     @param {string} songData.artists[].id - The unique identifier of the artist.
 *     @param {string} songData.artists[].name - The name of the artist.
 * @param {Array<Object>} songData.images - An array of image objects associated with the song or album (useful for displaying album art).
 * @param {number} songData.review_score - The aggregated review score for the song (default is 0).
 * @param {number} songData.num_reviews - The number of reviews the song has received (default is 0).
 * 
 * @throws {Error} Throws an error if there is an issue with adding the song data (e.g., network error).
 */
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





 /**
 * Retrieves song data from Firestore along with associated album and artist information.
 * 
 * @param {string} songId - The unique identifier of the song.
 * @return {Promise<Object|null>} songData - The object containing song data, album details, and artist information. Returns `null` if the song does not exist.
    * @return {string} songData.id - The unique identifier of the song.
    * @return {string} songData.name - The name of the song.
    * @return {Object} songData.album - An object containing album details for the song.
    *     @return {string} songData.album.id - The unique identifier of the album.
    *     @return {string} songData.album.name - The name of the album.
    * @return {Array<Object>} songData.artists - An array of artist objects associated with the song.
    *     @return {string} songData.artists[].id - The unique identifier of the artist.
    *     @return {string} songData.artists[].name - The name of the artist.
    * @return {Array<Object>} songData.images - An array of image objects associated with the song or album (useful for displaying album art).
    * @return {number} songData.review_score - The aggregated review score for the song (default is 0).
    * @return {number} songData.num_reviews - The number of reviews the song has received (default is 0).
 * 
 * @throws Will throw an error if there's a problem retrieving the song data, such as network issues.
 */
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