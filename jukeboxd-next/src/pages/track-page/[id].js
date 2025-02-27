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
import { useAtom } from 'jotai';
import { fetchTokenAtom, tokenAtom, tokenExpirationAtom } from '../../states/spotifyTokenManager'; // Updated import
const SongPage = () => {
  const router = useRouter();
  const { id: songId } = router.query; // Correctly get the albumId from the dynamic route

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  const [token, _] = useAtom(tokenAtom); // Access token state
  const [tokenExpiration, __] = useAtom(tokenExpirationAtom); // Access token expiration time
  const [, fetchToken] = useAtom(fetchTokenAtom); // Trigger token fetch

  useEffect(() => {
    const fetchTokenOnMount = async () => {
      try {
        await fetchToken(); // Ensure token is fetched on load
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
  
    fetchTokenOnMount(); // Call the function
  }, [fetchToken]); // fetchToken as dependency

  useEffect(() => {
    if (songId && token) { // Ensure songId and token are present before making API calls
      const fetchSongData = async () => {
        if (!token || Date.now() >= tokenExpiration) {
          console.log('Token expired, fetching a new one...');
          await fetchToken(); // Refresh the token if expired
        }
        console.log(token)
        try {
          setLoading(true); // Start loading
          setError(null); // Reset any previous errors

          // Fetch song details
          const details = await SpotifyAPIController.getSongDetails(token, songId);
          console.log(details);

          // Update state with the fetched data
          setSongDetails(details);

        } catch (error) {
          console.error('Error fetching song data:', error);
          setError('Failed to fetch song details.');
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchSongData();
    }
  }, [songId, token]); // Trigger useEffect whenever songId or token changes

  if (loading) {
    return <Typography variant="h5" style={{ color: '#fff' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display error if any
  }

  if (!songDetails) {
    return <Typography variant="h5" style={{ color: '#fff' }}>No song details available.</Typography>; // Fallback if no song data is found
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
