import { getSongById } from '@/backend/songs'; // Firebase functions
import { getAlbumById } from '@/backend/albums'; // Firebase functions
import { getArtistById } from '@/backend/artists';
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