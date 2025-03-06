import {db} from "./firebaseConfig";
import {doc, setDoc, getDoc, runTransaction} from "firebase/firestore";

/**
 * Adds album data to the Firestore database.
 * 
 * @param {string} albumId - The unique identifier for the album to be added.
 * @param {Object} albumData - The data to be added for the album.
 * 
 * @param {string} albumData.id - The unique identifier for the album.
 * @param {string} albumData.name - The name of the album.
 * @param {Array<Object>} albumData.artists - An array of artist objects associated with the album.
 *     @param {string} albumData.artists[].id - The unique identifier of the artist.
 *     @param {string} albumData.artists[].name - The name of the artist.
 * @param {Array<Object>} albumData.images - An array of image objects for displaying album art.
 * @param {number} albumData.review_score - The aggregated review score for the album (default is 0).
 * @param {number} albumData.num_reviews - The number of reviews the album has received (default is 0).
 * 
 * @throws {Error} Throws an error if there is an issue with adding the album data (e.g., network error).
 */
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
/**
 * Fetches album data from the Firestore database by albumId.
 * 
 * @param {string} albumId - The unique identifier for the album to be fetched.
 * @return {Promise<Object|null>} Returns the album data if the album exists, or null if not.
    * @returns {string} albumData.id - The unique identifier for the album.
    * @returns {string} albumData.name - The name of the album.
    * @returns {Array<Object>} albumData.artists - An array of artist objects associated with the album.
    *     @returns {string} albumData.artists[].id - The unique identifier of the artist.
    *     @returns {string} albumData.artists[].name - The name of the artist.
    * @returns {Array<Object>} albumData.images - An array of image objects for displaying album art.
    * @returns {number} albumData.review_score - The aggregated review score for the album (default is 0).
    * @returns {number} albumData.num_reviews - The number of reviews the album has received (default is 0).
 * @throws {Error} Throws an error if there is an issue fetching the album data (e.g., network error).
 */
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

  /**
 * Adds a review score to the album and increments the number of reviews.
 * 
 * @param {string} albumId - The unique identifier of the album for which the review score is being added.
 * @param {number} reviewScore - The review score to be added to the album.
 * 
 * @throws {Error} Throws an error if the album does not exist or if there is an issue with the transaction (e.g., network error).
 */
  export const addAlbumReviewScore = async (albumId, reviewScore) => {
    try {
      const albumRef = doc(db, "albums", albumId); // Reference to the album document
  
      // Run a transaction to ensure atomicity of the update
      await runTransaction(db, async (transaction) => {
        const albumSnap = await transaction.get(albumRef); // Fetch the current album data
  
        if (!albumSnap.exists()) {
          throw new Error("Album does not exist!");
        }
  
        // Get the current review score and num_reviews, or initialize them if not set
        const currentData = albumSnap.data();
        const currentReviewScore = currentData.review_score || 0;
        const currentNumReviews = currentData.num_reviews || 0;
  
        // Update the album with the new review score and increment the number of reviews
        const newReviewScore = currentReviewScore + reviewScore;
        const newNumReviews = currentNumReviews + 1;
  
        // Update the document atomically
        transaction.update(albumRef, {
          review_score: newReviewScore,
          num_reviews: newNumReviews,
        });
      });
  
      console.log("Album review score added successfully!");
    } catch (error) {
      console.error("Error adding album review score: ", error);
      throw error; // Propagate error for handling in calling code
    }
  };