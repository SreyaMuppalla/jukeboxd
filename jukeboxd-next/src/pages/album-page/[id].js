import React, { useState, useEffect } from 'react';
import { Box, Rating, Typography } from '@mui/material';
import {
  Background,
  AlbumContainer,
  AlbumInfoContainer,
  AlbumDetails,
  SongsListContainer,
  ReviewsSection,
} from '../../styles/StyledComponents';
import { fetchAlbumData } from '../../utils/apiCalls';
import Review from '../../bigcomponents/Review';
import Link from 'next/link';
import { useRouter } from 'next/router';
import unknownArtwork from '@/images/unknown_artwork.jpg';
import ProtectedRoute from '@/smallcomponents/ProtectedRoute';

const AlbumPage = () => {
  const router = useRouter();
  const { id: albumId } = router.query;

  const [albumDetails, setAlbumDetails] = useState({
    name: '',
    artists: [{ id: '', name: '' }],
    images: [{}, { url: unknownArtwork }],
    songs: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (albumId) {
      const getAlbumData = async () => {
        try {
          setError(null); // Reset any previous errors

          // Fetch album details and tracks
          const details = await fetchAlbumData(albumId);
          setAlbumDetails(details);
        } catch (error) {
          console.error('Error fetching album data:', error);
          setError('Failed to fetch album details.');
        }
      };

      getAlbumData();
    }
  }, [albumId]);

  if (error) {
    return (
      <Typography variant="h5" style={{ color: '#ff4d4d' }}>
        {error}
      </Typography>
    );
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <ProtectedRoute>
      <Background>
        <AlbumContainer>
          <AlbumInfoContainer>
            <img
              src={albumDetails.images[1]?.url || unknownArtwork}
              alt="Album Cover"
              width={250}
              height={250}
            />
            <AlbumDetails>
              <Typography
                variant="h3"
                style={{ color: '#fff', marginBottom: '8px' }}
              >
                {albumDetails.name}
              </Typography>
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
                    {index < albumDetails.artists.length - 1 && ', '}
                  </span>
                ))}
              </Typography>
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

          <Box display="flex" width="95%" marginTop="32px">
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

export default AlbumPage;