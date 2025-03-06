import React, { useState, useEffect } from 'react';
import { Box, Rating, Typography } from '@mui/material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  ReviewsSection,
} from '../../styles/StyledComponents';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { fetchSongData } from '../../utils/apiCalls'; // Import your API controller
import { useRouter } from 'next/router'; // Import Next.js useRouter
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import { getReviews } from '@/backend/reviews';
import unknownArtwork from '@/images/unknown_artwork.jpg'
import Image from 'next/image';

const SongPage = () => {
  const router = useRouter();
  const { id: songId } = router.query; // Correctly get the albumId from the dynamic route
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songDetails, setSongDetails] = useState({
    name: "",
    artists: [{ id: "", name: "" }],
    album: { id: "", name: "" },
    images: [{}, { url: unknownArtwork }],
  });
  const [reviews, setReviews] = useState([]);

  // Fetch song data when songId is available
  useEffect(() => {
    const getSongData = async () => {
      try {
        if (songId) {         
          const details = await fetchSongData(songId);
          const reviews_data = await getReviews(songId, 'song');
          setReviews(reviews_data);
          setSongDetails(details);
        }
      } catch (error) {
        console.error('Error fetching song data:', error);
        setError('Failed to fetch song details.');
      }
      finally {
        setLoading(false);
      }
    };

    if (songId) {
      getSongData();
    }
  }, [songId]); // Trigger useEffect whenever songId changes

  if (error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display error if any
  }

  if (loading) return <div>Loading...</div>;

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
              {reviews.length > 0 ? (
                  reviews.map((review) => (
                  <Review userName={review.username} userProfilePic={review.user_pfp} rating= {review.rating} review_text={review.review_text} songName={review.song_name} albumName={review.album_name} albumCover={review.images} ArtistName={review.artists}/>
                  ))
              ) : (
                  <>
                  <Typography 
                      variant="body1" 
                      style={{ color: '#b3b3b3', textAlign: 'center', marginBottom: '16px' }}
                  >
                      No reviews yet.
                  </Typography>
                  </>
              )}
            </ReviewsSection>
          </Box>
        </AlbumContainer>
      </Background>
    </ProtectedRoute>
  );
};

export default SongPage;