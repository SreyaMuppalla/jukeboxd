import React, { useState, useEffect } from 'react';
import {
  Box,
  Rating,
  Typography,
  Button,
  Tab,
  Tabs,
  Skeleton,
} from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  SongsListContainer,
  ReviewsSection,
  ReviewContainer,
} from '../../styles/StyledComponents'; // Ensure these styled components are created
import { fetchAlbumData } from '@/utils/apiCalls';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import Next.js useRouter
import { useAtom } from 'jotai';
import { currItem } from '@/states/currItem';
import unknownArtwork from '@/images/unknown_artwork.jpg';
import ProtectedRoute from '@/smallcomponents/ProtectedRoute';
import StarRating from '@/smallcomponents/StarRating';
import { useAuth } from '@/backend/auth';
import { getUser, BookmarkAlbum, removeAlbumBookmark } from '@/backend/users';
import { getReviews } from '@/backend/reviews';
import ReviewForm from '@/smallcomponents/ReviewForm';
import spotifyTokenService from '@/states/spotifyTokenManager';
import Image from 'next/image';

const AlbumPage = () => {
  const router = useRouter();
  const { id: albumId } = router.query; // Correctly get the albumId from the dynamic route
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [albumDetails, setAlbumDetails] = useState({
    name: '',
    artists: [{ id: '', name: '' }],
    images: [{}, { url: unknownArtwork }],
    songs: [],
  });
  const [selectedItem, setSelectedItem] = useAtom(currItem);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const token = spotifyTokenService; // Access token state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            if (!user || !albumId) return; // Ensure user and albumId exist

            const data = await getUser(user.uid);

            if (data && Array.isArray(data.bookmarkedAlbums)) {
                setUserData({ ...data, uid: user.uid });

                // Check if album_id exists in bookmarkedAlbums
                const isAlreadyBookmarked = data.bookmarkedAlbums.some(album => {
                    return String(album.album_id).trim() === String(albumId).trim();
                });

                setIsBookmarked(prev => {
                    return isAlreadyBookmarked;
                });
            } else {
                setIsBookmarked(false);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
        }
    };

    fetchUserData();
  }, [albumId, user]); // Ensure this runs on user or albumId changes

  // Ensure isBookmarked updates if userData changes
  useEffect(() => {
      if (userData && Array.isArray(userData.bookmarkedAlbums) && albumId) {
          const isAlreadyBookmarked = userData.bookmarkedAlbums.some(album => {
              return String(album.album_id).trim() === String(albumId).trim();
          });

          console.log("Updating isBookmarked to:", isAlreadyBookmarked);
          setIsBookmarked(isAlreadyBookmarked);
      }
  }, [userData, albumId]);


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
      } finally {
        setLoading(false);
      }
    };
    if (albumId) {
      getAlbumData();
    }
  }, [albumId, token]); // Trigger useEffect whenever albumId or token changes

  useEffect(() => {
    // Prefill review form
    const newSelectedItem = {
      ...albumDetails,
      album_id: albumDetails.id,
      album_name: albumDetails.name,
      review_type: 'album',
    };

    // Only update Jotai atom if the value has changed
    setSelectedItem((prevItem) =>
      JSON.stringify(prevItem) !== JSON.stringify(newSelectedItem)
        ? newSelectedItem
        : prevItem
    );
  }, [albumDetails]);

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
      try {
        await removeAlbumBookmark(user.uid, albumId);
        setIsBookmarked(false);
      } catch (error) {
        console.error('Error removing bookmark:', error);
        setError('Failed to remove bookmark.');
      } finally {
        setBookmarkLoading(false);
      }
    } else {
      try {
        let artist = albumDetails.artists[0];
        let album_artist = artist instanceof Map 
                ? Array.from(artist.values())[0] || "Unknown Artist" // Get first artist from Map
                : Array.isArray(artist) 
                    ? artist[0]?.name || "Unknown Artist" // Handle array case
                    : artist?.name || "Unknown Artist";
        await BookmarkAlbum(user.uid, albumId, albumDetails.name, album_artist);
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
            {loading ? (
              <Skeleton variant="rectangular" height={200} width={200} />
            ) : (
              <Image
                src={albumDetails.images[1]?.url || unknownArtwork} // Fallback to a default image if unavailable
                alt="Album Cover"
                width={200}
                height={200}
                style={{ borderRadius: '8px' }}
              />
            )}

            <Box
              display="flex"
              justifyContent="space-between"
              flex="1"
              alignItems="flex-start"
            >
              <AlbumDetails>
                {/* Album Name */}
                <Typography
                  variant="h3"
                  style={{
                    color: '#fff',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? <Skeleton width={400} /> : albumDetails.name}
                </Typography>
                {/* Artist Name */}
                <Typography
                  variant="h6"
                  style={{ color: '#d3d3d3', cursor: 'pointer' }}
                >
                  {loading ? (
                    <Skeleton width={300} />
                  ) : (
                    albumDetails.artists.map((artist, index) => (
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
                    ))
                  )}
                  {}
                </Typography>
                {/* Rating (Stars Placeholder) */}
                <Box display="flex" alignItems="center" gap={1}>
                  <StarRating
                    rating={
                      albumDetails.num_reviews > 0
                        ? albumDetails.review_score / albumDetails.num_reviews
                        : 0
                    }
                  />
                  <Typography
                    variant="body1"
                    style={{ color: '#d3d3d3', marginLeft: '8px' }}
                  >
                    ({albumDetails.num_reviews} Reviews)
                  </Typography>
                </Box>
              </AlbumDetails>
              {/* Bookmark Button */}
              <Box display="flex" justifyContent="flex-end" alignItems="center">
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
              </Box>
            </Box>
          </AlbumInfoContainer>
          {/* Content Section (Songs and Reviews) */}
          <Box display="flex" width="95%" marginTop="32px">
            {/* Songs List */}
            <SongsListContainer>
              <Typography
                variant="h5"
                style={{
                  color: '#fff',
                  marginBottom: '16px',
                  textDecoration: 'underline',
                }}
              >
                Songs:
              </Typography>
              <ol style={{ color: '#b3b3b3' }}>
                {loading
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <li style={{ marginBottom: '8px' }}>
                        <Skeleton variant="text" width="100%" height={40} />
                      </li>
                    ))
                  : albumDetails.songs.map((track, index) => (
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
            <Box width="100%">
              <ReviewsSection
                style={{
                  marginTop: '32px',
                  padding: '16px',
                  backgroundColor: '#333',
                  borderRadius: '16px',
                  width: '100%',
                  margin: '32px auto',
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={(event, newValue) => setSelectedTab(newValue)}
                  left
                  textColor="inherit"
                  TabIndicatorProps={{
                    style: { backgroundColor: '#1db954' },
                  }}
                >
                  <Tab
                    label="Recent Reviews"
                    sx={{
                      color: 'white',
                      fontFamily: 'Inter',
                      textTransform: 'none', // Optional: Prevent uppercase transformation
                      fontSize: '16px',
                    }}
                  />
                </Tabs>
                {loading &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <ReviewContainer>
                      <Skeleton
                        variant="rectangular"
                        key={`skeleton-${index}`}
                        width="100%"
                        height="100%"
                      />
                    </ReviewContainer>
                  ))}
                {loading || reviews.length > 0 ? (
                  reviews.map((review) => <Review review={review} />)
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      style={{
                        color: '#b3b3b3',
                        textAlign: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      No reviews yet.
                    </Typography>
                  </>
                )}
              </ReviewsSection>
            </Box>
          </Box>
        </AlbumContainer>
        <ReviewForm userData={userData}></ReviewForm>
      </Background>
    </ProtectedRoute>
  );
};
export default AlbumPage;
