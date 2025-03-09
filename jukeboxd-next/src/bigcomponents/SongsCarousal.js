import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Rating, Skeleton } from '@mui/material'; // Import Material UI components
import {
  CarouselContainer,
  SongItem,
  AlbumCover,
  SongName,
  StarsContainer,
} from '../styles/StyledComponents'; // Adjust based on your folder structure
import Link from 'next/link';
import Image from 'next/image';
import spotifyTokenService from '@/states/spotifyTokenManager'; // Import the singleton
import { fetchTrendingSongs } from '@/utils/apiCalls';

const SongsCarousel = () => {
  const [songs, setSongs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Fetch trending songs from Spotify API
    const getTrendingSongs = async () => {
      try {
        const spotifyTrending = await fetchTrendingSongs();
        if (spotifyTrending) {
          // Step 3: Return the raw album data from Spotify
          setSongs(spotifyTrending);
        }
      } catch (error) {
        console.error('Error fetching song details:', error);
        return null;
      }
    };

    getTrendingSongs().then(() => {
      setLoading(false);
    });
    
  }, []);

  const scrollRight = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.firstChild
        ? carouselRef.current.firstChild.offsetWidth
        : 0;
      const scrollAmount = itemWidth * 3; // Scroll by 3 items at a time
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.firstChild
        ? carouselRef.current.firstChild.offsetWidth
        : 0;
      const scrollAmount = itemWidth * -3; // Scroll left by 3 items
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      position="relative"
      width="100%"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CarouselContainer
        ref={carouselRef}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {loading
          ? // Render skeletons when loading
            Array.from({ length: 8 }).map((_, index) => (
              <SongItem
                key={`skeleton-${index}`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Album cover skeleton */}
                <AlbumCover style={{ cursor: 'pointer' }}>
                  <Skeleton
                    variant="rectangular"
                    width={300}
                    height={300}
                    sx={{ bgcolor: '#535353' }}
                  />
                </AlbumCover>

                {/* Song name skeleton */}
                <SongName style={{ cursor: 'pointer' }}>
                  <Skeleton
                    variant="text"
                    width={200}
                    sx={{ bgcolor: '#535353' }}
                  />
                </SongName>
              </SongItem>
            ))
          : // Render actual songs when not loading
            songs.map((song, index) => (
              <SongItem key={index} style={{ scrollSnapAlign: 'start' }}>
                {/* Album cover */}
                <AlbumCover style={{ cursor: 'pointer' }}>
                  <Link href={`/album-page/${song.id}`}>
                    <Image
                      src={song.images[0].url}
                      alt={`Album cover for ${song.name}`}
                      width="300"
                      height="300"
                    />
                  </Link>
                </AlbumCover>

            {/* Song name */}
            <SongName style={{ cursor: 'pointer', fontFamily: "Inter", color: "#FFFFFF", fontWeight: "bolder" }}>
              <Link href={`/album-page/${song.id}`}>{song.name}</Link>
            </SongName>
          </SongItem>
        ))}
      </CarouselContainer>

      {/* Left Scroll Button */}
      <Box
        position="absolute"
        left="70px"
        top="50%"
        sx={{
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
          opacity: isHovering ? 1 : 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)',
          },
        }}
        onClick={scrollLeft}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>

      {/* Right Scroll Button */}
      <Box
        position="absolute"
        right="70px"
        top="50%"
        sx={{
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
          opacity: isHovering ? 1 : 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)',
          },
        }}
        onClick={scrollRight}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
    </Box>
  );
};

export default SongsCarousel;
