import React, { useState, useEffect } from 'react';
import { Box, Rating, Typography, Button } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  SongsListContainer,
  ReviewsSection,
} from '../../styles/StyledComponents'; // Ensure these styled components are created
import { fetchAlbumData } from '@/utils/apiCalls';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import Next.js useRouter
import { useAtom } from 'jotai';
import { currItem } from '@/states/currItem';
import unknownArtwork from '@/images/unknown_artwork.jpg';
import ProtectedRoute from '@/smallcomponents/ProtectedRoute';
import { useAuth } from '@/backend/auth';
import { getUser, BookmarkAlbum, removeAlbumBookmark } from '@/backend/users';
import { getReviews } from '@/backend/reviews';
import ReviewForm from '@/smallcomponents/ReviewForm';

const AlbumPage = () => {
  const router = useRouter();
  const { id: albumId } = router.query; // Correctly get the albumId from the dynamic route
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [albumDetails, setAlbumDetails] = useState({
    name: '',
    artists: [{ id: '', name: '' }],
    images: [{}, { url: unknownArtwork }],
    songs: []
  });
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [token, _] = useAtom(currItem); // Access token state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!user) return;
        const data = await getUser(user.uid);
        setIsBookmarked(data.bookmarkedAlbums?.includes(albumId) || false);
        setUserData({ ...data, uid: user.uid });
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      }
    };
    fetchReviews();
  }, [albumId, user]);

  useEffect(() => {
      // Ensure albumId and token are present before making API calls
      const getAlbumData = async () => {
        try {
          setError(null); // Reset any previous errors
          // Fetch album details and tracks
          const details = await fetchAlbumData(albumId);
          const reviews_data = await getReviews(albumId, 'album');
          setAlbumDetails(details);
          setReviews(reviews_data);
        } catch (error) {
          console.error('Error fetching album data:', error);
          setError('Failed to fetch album details.');
        }
        finally {
          setLoading(false);
        }
      };
    if(albumId){
      getAlbumData();
    }
  }, [albumId, token]); // Trigger useEffect whenever albumId or token changes

  if (error) {
    return (
      <Typography variant="h5" style={{ color: '#ff4d4d' }}>
        {tokenError || error}
      </Typography>
    ); // Display any error
  }
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleBookmark = async () => {
    if (!albumId) return;
    if (!user) return;

    setBookmarkLoading(true);

    if (isBookmarked) {
      try{
        await removeAlbumBookmark(user.uid, albumId);
        setIsBookmarked(false);
      }
      catch(error){
        console.error('Error removing bookmark:', error);
        setError('Failed to remove bookmark.');
      }
      finally{
        setBookmarkLoading(false);
      }
    }
    else{
      try {
        await BookmarkAlbum(user.uid, albumId);
        setIsBookmarked(true);
      } catch (error) {
        console.error('Error bookmarking album:', error);
        setError('Failed to bookmark album.');
      } finally {
        setBookmarkLoading(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <Background>
        <AlbumContainer>
          {/* Album Info Section */}
          <AlbumInfoContainer>
            {/* Album Cover */}
            <img
              src={albumDetails.images[1]?.url || unknownArtwork} // Fallback to a default image if unavailable
              alt="Album Cover"
              width={250}
              height={250}
            />
            <AlbumDetails>
              {/* Album Name */}
              <Typography
                variant="h3"
                style={{ color: '#fff', marginBottom: '8px' }}
              >
                {albumDetails.name}
              </Typography>
              {/* Bookmark Button */}
              <Button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  variant="contained"
                  sx={{
                    backgroundColor: isBookmarked ? '#1DB954' : '#333',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: isBookmarked ? '#1ed760' : '#444',
                    },
                    minWidth: '120px',
                    height: '40px',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  <Bookmark />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              {/* Artist Name */}
              <Typography
                variant="h6"
                style={{ color: '#d3d3d3', cursor: 'pointer' }}
              >
                {albumDetails.artists.map((artist, index) => (
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
                    {index < albumDetails.artists.length - 1 && ', '}
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
          {/* Content Section (Songs and Reviews) */}
          <Box display="flex" width="95%" marginTop="32px">
            {/* Songs List */}
            <SongsListContainer>
              <Typography
                variant="h5"
                style={{ color: '#fff', marginBottom: '16px' }}
              >
                Songs:
              </Typography>
              <ol style={{ paddingLeft: '16px', color: '#b3b3b3' }}>
                {albumDetails.songs.map((track, index) => (
                  <li key={track.id} style={{ marginBottom: '8px' }}>
                    <Link
                      href={`/song-page/${track.id}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#b3b3b3';
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                      style={{
                        fontSize: '20px',
                      }}
                    >
                      <Box display="flex" gap={5} alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{ minWidth: 30, textAlign: 'right' }}
                        >
                          {index + 1}
                        </Typography>
                        <Typography variant="h6">{track.name}</Typography>
                      </Box>
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
              {reviews.length > 0 ? (
                  reviews.map((review) => (
                  <Review review={review}/>
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
        <ReviewForm userData={userData}></ReviewForm>
      </Background>
    </ProtectedRoute>
  );
};
export default AlbumPage;