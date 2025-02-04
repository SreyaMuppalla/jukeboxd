// header
// album cover
// album song
// artist and date
// stars
// songs in the album
// album reviews
// write a review

import React from "react";
import { Box, Typography } from "@mui/material";
import { 
  Background, 
  AlbumContainer, 
  AlbumInfoContainer, 
  AlbumDetails, 
  SongsListContainer, 
  ReviewsSection 
} from "../styles/StyledComponents"; // Ensure these styled components are created
import Header from "../bigcomponents/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Review from "../bigcomponents/Review";
import albumpic from "../images/albumpic.jpg"; // Import the album cover image

const AlbumPage = () => {
    const navigate = useNavigate(); // Hook for navigation

  return (
    <Background>
      <AlbumContainer>
        {/* Album Info Section */}
        <AlbumInfoContainer>
          {/* Album Cover */}
          <img
            src={albumpic}
            alt="Album Cover"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "16px",
              marginRight: "16px",
            }}
          />
          <AlbumDetails>
            {/* Album Name */}
            <Typography variant="h3" style={{ color: "#fff", marginBottom: "8px" }}>
              Album Name
            </Typography>
            {/* Artist Name */}
            <Typography
                variant="subtitle2"
                style={{ color: "#d3d3d3", cursor: "pointer" }} // Pointer cursor
                onClick={() => navigate("/artist-page")} // Navigate to ArtistPage
                >
                Artist Name
            </Typography>
            {/* Rating (Stars Placeholder) */}
            <Typography variant="h6" style={{ color: "#1db954" }}>
              ★★★★★
            </Typography>
          </AlbumDetails>
        </AlbumInfoContainer>

        {/* Content Section (Songs and Reviews) */}
        <Box display="flex" width="100%" marginTop="32px">
          {/* Songs List */}
          <SongsListContainer>
            <Typography variant="h5" style={{ color: "#fff", marginBottom: "16px" }}>
              Songs:
            </Typography>
            <ol style={{ paddingLeft: "16px", color: "#b3b3b3" }}>
              {Array.from({ length: 10 }).map((_, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  Song {index + 1}
                </li>
              ))}
            </ol>
          </SongsListContainer>

          {/* Reviews Section */}
          <ReviewsSection>
            <Typography variant="h5" style={{ color: "#fff", marginBottom: "16px" }}>
              Reviews:
            </Typography>
            <Review />
            <Review />
            <Review />
          </ReviewsSection>
        </Box>
      </AlbumContainer>
    </Background>
  );
};

export default AlbumPage;
