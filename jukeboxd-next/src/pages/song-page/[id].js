import React, { useState, useEffect } from 'react';
import { Box, Rating, Typography, Button } from '@mui/material';
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
import { getSongReviews } from '@/backend/reviews';
import {getUser, BookmarkSong, removeSongBookmark} from '@/backend/users';
import unknownArtwork from '@/images/unknown_artwork.jpg'
import Image from 'next/image';
import { useAuth } from '@/backend/auth';
import { useAtom } from 'jotai';
import { currItem } from '@/states/currItem';

const SongPage = () => {
  const router = useRouter();
  const { id: songId } = router.query; // Correctly get the albumId from the dynamic route
  const { user } = useAuth();

  const [error, setError] = useState(null);
  const [songDetails, setSongDetails] = useState({
    name: "",
    artists: [{ id: "", name: "" }],
    album: { id: "", name: "" },
    images: [{}, { url: unknownArtwork }],
  });
  const [song_reviews, setReviews] = useState([]);
  const [token, _] = useAtom(currItem); // Access token state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!user) return;
        const data = await getUser(user.uid);
        const reviews_data = await getSongReviews(songId);
        setReviews(reviews_data);
        setIsBookmarked(data.bookmarkedSongs?.includes(songId) || false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      }
    };

    fetchReviews();
  }, [songId, user]);

  // Fetch song data when songId is available
  useEffect(() => {
    const getSongData = async () => {
      try {
        if (songId) {
          setError(null); // Reset any previous e          

          const details = await fetchSongData(songId);
          
          // Update state with the fetched data
          setSongDetails(details);
        }
      } catch (error) {
        console.error('Error fetching song data:', error);
        setError('Failed to fetch song details.');
      }
    };

    if (songId) {
      getSongData();
    }
  }, [songId, token]); // Trigger useEffect whenever songId changes

  const handleBookmark = async () => {
    if (!songId) return;
    if (!user) return;
    
    setBookmarkLoading(true);

    if (isBookmarked) {
      try{
        await removeSongBookmark(user.uid, songId);
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
        await BookmarkSong(user.uid, songId);
        setIsBookmarked(true);
      } catch (error) {
        console.error('Error bookmarking song:', error);
        setError('Failed to bookmark song.');
      } finally {
        setBookmarkLoading(false);
      }
    }
  };

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
              {/* Song Title and Bookmark Button Container */}
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                {/* Song Title */}
                <Typography
                  variant="h3"
                  style={{ color: '#fff', marginBottom: '8px' }}
                >
                  {songDetails.name}
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
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </Box>
              
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
              <Review />
              <Review />
              <Review />
            </ReviewsSection>
          </Box>
        </AlbumContainer>
      </Background>
    </ProtectedRoute>
  );
};

export default SongPage;