import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  SongsListContainer,
  ReviewsSection,
} from '../../styles/StyledComponents'; // Ensure these styled components are created
import { SpotifyAPIController } from '../../utils/SpotifyAPIController'; // Import your API controller
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import Next.js useRouter
import { useSpotify } from '../../context/SpotifyContext'; // Import the useSpotify hook


const AlbumPage = () => {
  const router = useRouter();
  const { id: albumId } = router.query; // Correctly get the albumId from the dynamic route
  
  const [albumDetails, setAlbumDetails] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, error: tokenError } = useSpotify(); // Use token from SpotifyContext
  const [error, setError] = useState(null);


  useEffect(() => {
    if (albumId && token) { // Ensure albumId and token are present before making API calls
      const fetchAlbumData = async () => {
        try {
          setLoading(true); // Start loading
          setError(null); // Reset any previous errors

          // Fetch album details and tracks
          const details = await SpotifyAPIController.getAlbumDetails(token, albumId);
          const tracks = await SpotifyAPIController.getAlbumTracks(token, albumId);

          // Update state with the fetched data
          setAlbumDetails(details);
          setAlbumTracks(tracks); // Track list is often nested under 'items'

        } catch (error) {
          console.error('Error fetching album data:', error);
          setError('Failed to fetch album details.');
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchAlbumData();
    }
  }, [albumId, token]); // Trigger useEffect whenever albumId or token changes

  if (loading) {
    return <Typography variant="h5" style={{ color: '#fff' }}>Loading...</Typography>;
  }

  if (tokenError || error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{tokenError || error}</Typography>; // Display any error
  }

  if (!albumDetails) {
    return <Typography variant="h5" style={{ color: '#fff' }}>No album details available.</Typography>; // Fallback if no album data is found
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

    return (
      <Background>
        <AlbumContainer>
          {/* Album Info Section */}
          <AlbumInfoContainer>
            {/* Album Cover */}
            <img
              src={albumDetails.images[0]?.url || '/default-album.jpg'} // Fallback to a default image if unavailable
              alt="Album Cover"
              width={200}
              height={200}
              style={{
                borderRadius: '16px',
                marginRight: '16px',
              }}
            />
            <AlbumDetails>
              {/* Album Name */}
              <Typography
                variant="h3"
                style={{ color: '#fff', marginBottom: '8px' }}
              >
                {albumDetails.name}
              </Typography>
              {/* Artist Name */}
              <Typography
                variant="subtitle2"
                style={{ color: '#d3d3d3', cursor: 'pointer' }}
              >
                {albumDetails.artists.map((artist) => (
                  <Link key={artist.id} href={`/artist-page/${artist.id}`}>
                    {artist.name}
                  </Link>
                ))}
              </Typography>
              {/* Rating (Stars Placeholder) */}
              <Typography variant="h6" style={{ color: '#1db954' }}>
                ★★★★★
              </Typography>
            </AlbumDetails>
          </AlbumInfoContainer>
    
          {/* Content Section (Songs and Reviews) */}
          <Box display="flex" width="100%" marginTop="32px">
            {/* Songs List */}
            <SongsListContainer>
              <Typography
                variant="h5"
                style={{ color: '#fff', marginBottom: '16px' }}
              >
                Songs:
              </Typography>
              <ol style={{ paddingLeft: '16px', color: '#b3b3b3' }}>
                {albumTracks.map((track, index) => (
                  <li key={track.id} style={{ marginBottom: '8px' }}>
                    <Link href = {`/song-page/${track.id}`}>
                    {track.track_number}. {track.name} ({formatDuration(track.duration_ms)})
                    </Link>
                  </li>
                ))}
              </ol>
            </SongsListContainer>
    
            {/* Reviews Section */}
            <ReviewsSection>
              <Typography
                variant="h5"
                style={{ color: '#fff', marginBottom: '16px' }}
              >
                Reviews:
              </Typography>
              <Review />
              <Review />
              <Review />
            </ReviewsSection>
          </Box>
        </AlbumContainer>
      </Background>
    );
};

export default AlbumPage;