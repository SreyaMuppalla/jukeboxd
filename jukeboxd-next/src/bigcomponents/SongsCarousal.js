import React, {useEffect} from "react";
import { Box, Typography, Rating } from "@mui/material"; // Import Material UI components
import { CarouselContainer, SongItem, AlbumCover, SongName, StarsContainer } from "../styles/StyledComponents"; // Adjust based on your folder structure
import albumpic from "../images/albumpic.jpg";
import Link from "next/link";
import Image from "next/image";
import spotifyTokenService from '@/states/spotifyTokenManager'; // Import the singleton
import { fetchTrendingSongs } from "@/utils/apiCalls";

const SongsCarousel = () => {
  const [songs, setSongs] = React.useState([]);

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
        console.error("Error fetching song details:", error);
        return null;
      }
    };

    getTrendingSongs();
  }
  , []);

  return (
    <CarouselContainer>
      {songs.map((song, index) => (
        <SongItem key={index}>
          {/* Album cover */}
          <AlbumCover
            style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
          >
            <Link href={`/album-page/${song.id}`}>
              <Image
                src={song.images[0].url} // Use the imported album picture
                alt={`Album cover for ${song.name}`}
                width="300"
                height="300"
              />
            </Link>
          </AlbumCover>

          {/* Song name */}
          <SongName
            style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
          >
            <Link href={`/album-page/${song.id}`}>{song.name}</Link>
          </SongName>
        </SongItem>
      ))}
    </CarouselContainer>
  );
};

export default SongsCarousel;
