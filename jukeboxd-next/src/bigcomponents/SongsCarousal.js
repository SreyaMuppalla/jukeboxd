import React from "react";
import { Box, Typography, Rating } from "@mui/material"; // Import Material UI components
import { CarouselContainer, SongItem, AlbumCover, SongName, StarsContainer } from "../styles/StyledComponents"; // Adjust based on your folder structure
import albumpic from "../images/albumpic.jpg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const SongsCarousel = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  // Placeholder data for songs
  const songs = new Array(10).fill({ albumCover: albumpic, songName: "Song Name", stars: 5 });

  return (
    <CarouselContainer>
      {songs.map((song, index) => (
        <SongItem key={index}>
          {/* Album cover */}
          <AlbumCover
            onClick={() => navigate("/album-page")} // Navigate to AlbumPage when clicked
            style={{ cursor: "pointer" }} // Change cursor to indicate it's clickable
          >
            <img
              src={song.albumCover} // Use the imported album picture
              alt={`Album cover for ${song.songName}`}
              width="100%" // Ensures the image takes the full width of the container
            />
          </AlbumCover>

          {/* Song name */}
          <SongName
            onClick={() => navigate("/song-page")} // Navigate to SongPage when clicked
            style={{ cursor: "pointer" }} // Change cursor to indicate it's clickable
          >
            {song.songName}
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
