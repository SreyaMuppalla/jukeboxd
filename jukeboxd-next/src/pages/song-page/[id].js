import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  ReviewsSection,
  AlbumCover,
} from '../../styles/StyledComponents';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { SpotifyAPIController } from '../../utils/SpotifyAPIController'; // Import your API controller
import { useRouter } from 'next/router'; // Import Next.js useRouter

const SongPage = () => {
  const router = useRouter();
  const { id: songId } = router.query; // Correctly get the albumId from the dynamic route

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [songDetails, setSongDetails] = useState(null);

    // Fetch token on component mount
    useEffect(() => {
      const fetchToken = async () => {
        try {
          const token = await SpotifyAPIController.getToken();
          setToken(token);
        } catch (error) {
          console.error('Error fetching token:', error);
          setError('Failed to fetch token.');
        }
      };
      fetchToken();
    }, []);

    useEffect(() => {
      if (songId && token) { // Ensure albumId and token are present before making API calls
        const fetchSongData = async () => {
          try {
            setLoading(true); // Start loading
            setError(null); // Reset any previous errors
  
            // Fetch album details and tracks
            const details = await SpotifyAPIController.getSongDetails(token, songId);
            console.log(details)
  
            // Update state with the fetched data
            setSongDetails(details);
  
          } catch (error) {
            console.error('Error fetching album data:', error);
            setError('Failed to fetch album details.');
          } finally {
            setLoading(false); // Stop loading
          }
        };
  
        fetchSongData();
      }
    }, [songId, token]); // Trigger useEffect whenever albumId or token changes
  
    if (loading) {
      return <Typography variant="h5" style={{ color: '#fff' }}>Loading...</Typography>;
    }
  
    if (error) {
      return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display error if any
    }
  
    if (!songDetails) {
      return <Typography variant="h5" style={{ color: '#fff' }}>No album details available.</Typography>; // Fallback if no album data is found
    }
  

    return (
      <Background>
        <AlbumContainer>
          {/* Song Info Section */}
          <AlbumInfoContainer>
            {/* Album Cover */}
            <AlbumCover
              style={{ cursor: 'pointer' }} // Pointer cursor for clickable elements
            >
              <img
                src={songDetails.images[0]?.url} // First image from the images array
                alt={songDetails.name + ' Album Cover'}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '16px',
                  marginRight: '16px',
                }}
              />
            </AlbumCover>
            <AlbumDetails>
              {/* Song Title */}
              <Typography
                variant="h3"
                style={{ color: '#fff', marginBottom: '8px' }}
              >
                {songDetails.name}
              </Typography>
              {/* Album Name */}
              <Typography
                variant="h5"
                style={{
                  color: '#b3b3b3',
                  marginBottom: '8px',
                  cursor: 'pointer',
                }}
              >
              <Link href={`/album-page/${songDetails.album.id}`}>
                {songDetails.album.name} {/* Display the song or album name */}
                </Link>
              </Typography>
              {/* Artist Names */}
              <Typography
                variant="h6"
                style={{
                  color: '#b3b3b3',
                  marginBottom: '16px',
                }}
              >
                {songDetails.artists.map((artist, index) => (
                  <span key={artist.id}>
                    <Link href={`/artist-page/${artist.id}`}>
                      {artist.name}
                    </Link>
                    {/* Add a comma between artist names, but not after the last one */}
                    {index < songDetails.artists.length - 1 && ', '}
                  </span>
                ))}
              </Typography>
              {/* Rating (Stars Placeholder) */}
              <Typography variant="h6" style={{ color: '#1db954' }}>
                ★★★★★
              </Typography>
            </AlbumDetails>
          </AlbumInfoContainer>
  
          {/* Reviews Section */}
          <Box marginTop="32px" width="100%">
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
  
export default SongPage;