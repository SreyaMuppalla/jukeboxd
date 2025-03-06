import { getSongById, addSongById, addSongReviewScore  } from '@/backend/songs'; // Firebase functions
import { getAlbumById, addAlbumById } from '@/backend/albums'; // Firebase functions
import { getArtistById, addArtistById } from '@/backend/artists';
import { createReview } from '@/backend/reviews';
import { SpotifyAPIController } from './SpotifyAPIController'; // Spotify function
import spotifyTokenService from '../states/spotifyTokenManager'; // Import the TokenManager singleton

export const fetchSongData = async (songId) => {

    const spotifyToken = await spotifyTokenService.getToken();

    try {
      // Step 1: Try to get the song from Firebase
      const songData = await getSongById(songId);
      
      if (songData) {
        console.log("Song found in Firebase");
        return songData; // Return the song data from Firebase
      }
  
      // Step 2: If not found in Firebase, fetch from Spotify API
      console.log("Song not found in Firebase, fetching from Spotify...");
  
      const spotifySongData = await SpotifyAPIController.getSongDetails(spotifyToken, songId);
  
      if (spotifySongData) {
        // Step 3: Return the raw song data from Spotify
        return spotifySongData;
      }
  
      // If Spotify does not return any data, return null or handle accordingly
      return null;
  
    } catch (error) {
      console.error("Error fetching song data:", error);
      throw error; // Handle any unexpected errors
    }
  };

  // Function to fetch an album by its ID, checking Firebase first, and using Spotify as a fallback
export const fetchAlbumData = async (albumId) => {

  const spotifyToken = await spotifyTokenService.getToken();

    try {
      // Step 1: Try to get the album from Firebase
      const albumData = await getAlbumById(albumId);
      
      if (albumData) {
        console.log("Album found in Firebase");
        return albumData; // Return the album data from Firebase
      }
  
      // Step 2: If not found in Firebase, fetch from Spotify API
      console.log("Album not found in Firebase, fetching from Spotify...");
  
      const spotifyAlbumData = await SpotifyAPIController.getAlbumDetails(spotifyToken, albumId);
  
      if (spotifyAlbumData) {
        // Step 3: Return the raw album data from Spotify
        return spotifyAlbumData;
      }
  
      // If Spotify does not return any data, return null or handle accordingly
      return null;
  
    } catch (error) {
      console.error("Error fetching album data:", error);
      throw error; // Handle any unexpected errors
    }
  };

  export const fetchArtistData = async (artistId) => {
    const spotifyToken = await spotifyTokenService.getToken();

    try {
      // Step 1: Try to get the album from Firebase
      const artistData = await getArtistById(albumId);
      
      if (artistData) {
        console.log("Artist found in Firebase");
        return artistData; // Return the album data from Firebase
      }
  
      // Step 2: If not found in Firebase, fetch from Spotify API
      console.log("Artist not found in Firebase, fetching from Spotify...");
        const spotifyArtistData = await SpotifyAPIController.getArtistDetails(spotifyToken, artistId);
    
        if (spotifyArtistData) {
          // Step 3: Return the raw album data from Spotify
          return spotifyArtistData;
        }
    
        // If Spotify does not return any data, return null or handle accordingly
        return null;
    
      } catch (error) {
        console.error("Error fetching artist data:", error);
        throw error; // Handle any unexpected errors
      }
  }

  /**
 * Adds a review object for a song or album.
 *
 * @param {Object} reviewInfo - The review object containing the review data.
    * @param {string} reviewInfo.user_id - The unique identifier of the user submitting the review.
    * @param {string} reviewInfo.song_name - The name of the song being reviewed.
    * @param {string} reviewInfo.song_id - The unique identifier of the song being reviewed.
    * @param {string} reviewInfo.album_name - The name of the album the song belongs to.
    * @param {string} reviewInfo.album_id - The unique identifier of the album the song belongs to.
    * @param {Array<Object>} reviewInfo.artists - The list of artists associated with the song.
    * @param {Array<Object>} reviewInfo.images - The array of image objects associated with the song/album.
    * @param {number} reviewInfo.rating - The numerical rating provided by the user (e.g., 1 to 5 stars).
    * @param {string} reviewInfo.review_text - The text content of the review submitted by the user.
    * @param {number} reviewInfo.likes - The number of likes the review has received (default is 0).
    * @param {number} reviewInfo.dislikes - The number of dislikes the review has received (default is 0).
    * @param {Date} reviewInfo.date - The date and time when the review was created (default is the current date).
    * @param {string} reviewInfo.type - The type of review being submitted, typically the review content itself.
 */
  export const addReview = async (reviewInfo) => {
    try {
      console.log("In add review")
      const { song_id, album_id, song_name, album_name, artists, images } = reviewInfo;

      const spotifyToken = await spotifyTokenService.getToken();
      console.log(spotifyToken)

  
      // Helper function to add song if it doesn't exist
      const addSongIfNeeded = async (song_id, song_name, album_id, album_name, artists, images) => {
        const songData = await getSongById(song_id);
        if (!songData) {
          const newSongData = {
            id: song_id,
            name: song_name,
            album: { id: album_id, name: album_name },
            artists: artists.map(artist => ({
              id: artist.id,
              name: artist.name
            })),
            images,
            review_score: 0,
            num_reviews: 0
          };
          console.log("Song not found in Firebase, adding song...");
          console.log(newSongData)
          await addSongById(song_id, newSongData);
        } else {
          console.log("Song found in Firebase")
        }
      };
  
      // Helper function to add album if it doesn't exist
      const addAlbumIfNeeded = async (album_id, album_name, artists, images) => {
        const albumData = await getAlbumById(album_id);
        if (!albumData) {

          const albumSongs = await SpotifyAPIController.getAlbumSongs(spotifyToken, album_id)
          const newAlbumData = {
            id: album_id,
            name: album_name,
            artists: artists.map(artist => ({
              id: artist.id,
              name: artist.name
            })),
            songs: albumSongs.map(song => ({
              id: song.id,
              name: song.name
            })),
            images: images,
            review_score: 0,
            num_reviews: 0
          };
          console.log("Album not found in Firebase, adding album...");
          await addAlbumById(album_id, newAlbumData);
        } else {
          console.log("Album found in Firebase");
        }
      };
  
      // Helper function to add artists if they don't exist
      const addArtistsIfNeeded = async (artists) => {
        for (const artist of artists) {
          const artistData = await getArtistById(artist.id);  // Assuming you have a function to get artist by ID
          if (!artistData) {
            const newArtist = await SpotifyAPIController.getArtistDetails(spotifyToken, artist.id)
            await addArtistById(artist.id, newArtist);  // Assuming you have a function to add artist
          } else {
            console.log("Artist found in Firebase");
          }
        }
      };
  
      // Step 1: Ensure the song exists or is added
      if (song_id) {
        await addSongIfNeeded(song_id, song_name, album_id, album_name, artists, images);
      }
  
      // Step 2: Ensure the album exists or is added
      if (album_id) {
        await addAlbumIfNeeded(album_id, album_name, artists, images);
      }
  
      // Step 3: Ensure artists exist or are added
      if (artists && artists.length > 0) {
        await addArtistsIfNeeded(artists);
      }
      console.log(typeof reviewInfo.rating)
      const review = 
      {
        song_id: reviewInfo.song_id ,
        song_name: reviewInfo.song_name || null,
        album_id: reviewInfo.album_id || null,
        album_name: reviewInfo.album_name || null,
        artists: reviewInfo.artists || [],
        user_id: reviewInfo.user_id,
        images: reviewInfo.images || null,
        rating: reviewInfo.rating,
        review_text: reviewInfo.review_text || null,
        likes: reviewInfo.likes || 0,
        dislikes: reviewInfo.dislikes || 0,
        date: reviewInfo.date || new Date(),
        type: reviewInfo.type
      }

      await createReview(review);
      console.log("Review added successfully.");


      if (review.type === "song") {
        await addSongReviewScore(review.song_id, review.rating)
      } else if (review.type === "album") {
        await addAlbumReviewScore(review.album_id_id, review.rating)
      }
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  };