import React, { useState, useEffect } from 'react';
import { Box, Rating, Typography } from '@mui/material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  ReviewsSection,
  LargeAlbumCover,
} from '../../styles/StyledComponents';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { SpotifyAPIController } from '../../utils/SpotifyAPIController'; // Import your API controller
import { useRouter } from 'next/router'; // Import Next.js useRouter
import { useAtom } from 'jotai';
import { fetchTokenAtom, tokenAtom, tokenExpirationAtom } from '../../states/spotifyTokenManager'; // Updated import
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import {getSongReviews} from '@/backend/reviews';
import unknownArtwork from '@/images/unknown_artwork.jpg'
import Image from 'next/image';

const SongPage = () => {
  const router = useRouter();
  const { id: songId } = router.query; // Correctly get the albumId from the dynamic route

  const [error, setError] = useState(null);
  const [songDetails, setSongDetails] = useState({
    name: "",
    artists: [{id: "", name: ""}],
    album: {id: "", name: ""},
    images: [{},{url: unknownArtwork}],
  });
  const [token, _] = useAtom(tokenAtom); // Access token state
  const [tokenExpiration, __] = useAtom(tokenExpirationAtom); // Access token expiration time
  const [, fetchToken] = useAtom(fetchTokenAtom); // Trigger token fetch
  const [song_reviews, setReviews] = useState([]);



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Replace 'user1' with the actual user ID
        const songId = 'song1';
        const reviews_data = await getSongReviews(songId);
        setReviews(reviews_data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      }
    };

    fetchReviews();
  }, []);



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
        try {
          setError(null); // Reset any previous errors

          // Fetch song details
          const details = await SpotifyAPIController.getSongDetails(token, songId);

          // Update state with the fetched data
          setSongDetails(details);

        } catch (error) {
          console.error('Error fetching song data:', error);
          setError('Failed to fetch song details.');
        }
      };

      fetchSongData();
    }
  }, [songId, token]); // Trigger useEffect whenever songId or token changes

  if (error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display error if any
  }

  return (
    <ProtectedRoute>
      <Background>
        <AlbumContainer>
          {/* Song Info Section */}
          <AlbumInfoContainer>
            {/* Album Cover */}
              <Image
                src={songDetails.images[1]?.url} // First image from the images array
                alt={songDetails.name + ' Album Cover'}
                width={250}
                height={250}
              />
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
                <Link
                  href={`/album-page/${songDetails.album.id}`}
                  passHref
                  style={{
                    color: '#b3b3b3',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#b3b3b3';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {songDetails.album.name}{' '}
                  {/* Display the song or album name */}
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
                    <Link
                      href={`/artist-page/${artist.id}`}
                      passHref
                      style={{
                        color: '#b3b3b3',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#b3b3b3';
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {artist.name}
                    </Link>
                    {/* Add a comma between artist names, but not after the last one */}
                    {index < songDetails.artists.length - 1 && ', '}
                  </span>
                ))}
              </Typography>
              {/* Rating (Stars Placeholder) */}
              <Rating
                size="medium"
                value={5}
                readOnly
                sx={{
                  alignSelf: 'flex-start',
                  fontSize: '3rem',
                  '& .MuiRating-iconEmpty': {
                    color: 'white',
                  },
                  '& .MuiRating-iconFilled': {
                    fontSize: 'inherit',
                  },
                }}
              />
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
    </ProtectedRoute>
  );
}
export default SongPage;