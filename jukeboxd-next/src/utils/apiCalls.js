import { getSongById, addSongById } from '@/backend/songs'; // Firebase functions
import { getAlbumById, addAlbumById } from '@/backend/albums'; // Firebase functions
import { getArtistById, addArtistById } from '@/backend/artists';
import { createReview } from '@/backend/reviews';
import { SpotifyAPIController } from './SpotifyAPIController'; // Spotify function

export const fetchSongData = async (songId, spotifyToken) => {
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
export const fetchAlbumData = async (albumId, spotifyToken) => {
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

  export const fetchArtistData = async (artistId, spotifyToken) => {
    try {
        // Step 1: Try to get the album from Firebase
        const artistData = await getArtistById(artistId);
        
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

  export const addReview = async (reviewInfo) => {
    try {
      const { song_id, artist_id, album_id } = reviewInfo;
  
      // Step 1: Check if the song exists in Firebase, if not, add it
      if (song_id) {
        const songData = await getSongById(song_id);
        if (!songData) {
          console.log("Song not found in Firebase, adding song...");
          await addSongById(song_id, reviewInfo);  // Assuming reviewInfo has all required song details
        }
      }
  
      // Step 2: Check if the artist exists in Firebase, if not, add the artist
      if (artist_id) {
        const artistData = await getArtistById(artist_id);
        if (!artistData) {
          console.log("Artist not found in Firebase, adding artist...");
          await addArtistById(artist_id, reviewInfo);  // Assuming reviewInfo has all required artist details
        }
      }
  
      // Step 3: Check if the album exists in Firebase, if not, add the album
      if (album_id) {
        const albumData = await getAlbumById(album_id);
        if (!albumData) {
          console.log("Album not found in Firebase, adding album...");
          await addAlbumById(album_id, reviewInfo);  // Assuming reviewInfo has all required album details
        }
      }
  
      // Step 4: Finally, create the review
      await createReview(reviewInfo);
      console.log("Review added successfully.");
  
    } catch (error) {
      console.error("Error adding review:", error);
      throw error; // Handle any unexpected errors
    }
  };