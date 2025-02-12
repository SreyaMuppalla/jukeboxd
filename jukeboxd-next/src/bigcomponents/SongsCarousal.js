import React from "react";
import { Box, Typography, Rating } from "@mui/material"; // Import Material UI components
import { CarouselContainer, SongItem, AlbumCover, SongName, StarsContainer } from "../styles/StyledComponents"; // Adjust based on your folder structure
import albumpic from "../images/albumpic.jpg";
import Link from "next/link";
import Image from "next/image";

const SongsCarousel = () => {

  // Placeholder data for songs
  const songs = new Array(10).fill({ albumCover: albumpic, songName: "Song Name", stars: 5 });

  return (
    <CarouselContainer>
      {songs.map((song, index) => (
        <SongItem key={index}>
          {/* Album cover */}
          <AlbumCover
            style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
          >
            <Link href="/album-page">
              <Image
                src={song.albumCover} // Use the imported album picture
                alt={`Album cover for ${song.songName}`}
                width="100%" // Ensures the image takes the full width of the container
              />
            </Link>
          </AlbumCover>

          {/* Song name */}
          <SongName
            style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
          >
            <Link href="/song-page">{song.songName}</Link>
          </SongName>

          {/* Star rating */}
          <StarsContainer>
            <Rating name="read-only" value={song.stars} readOnly />
          </StarsContainer>
        </SongItem>
      ))}
    </CarouselContainer>
  );
};

export default SongsCarousel;
