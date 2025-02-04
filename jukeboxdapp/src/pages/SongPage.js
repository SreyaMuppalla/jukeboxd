import React from "react";
import { Box, Typography } from "@mui/material";
import { 
  Background, 
  AlbumContainer, 
  AlbumInfoContainer, 
  AlbumDetails, 
  ReviewsSection 
} from "../styles/StyledComponents"; // Ensure these styled components are created
import Header from "../bigcomponents/Header";
import Review from "../bigcomponents/Review";
import albumpic from "../images/albumpic.jpg"; // Import the album cover image

const SongPage = () => {
  return (
    <Background>
      <Header />
      <AlbumContainer>
        {/* Song Info Section */}
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
            {/* Song Title */}
            <Typography variant="h3" style={{ color: "#fff", marginBottom: "8px" }}>
              Song Title
            </Typography>
            {/* Album Name */}
            <Typography variant="h5" style={{ color: "#b3b3b3", marginBottom: "8px" }}>
              Album Name
            </Typography>
            {/* Artist Name */}
            <Typography variant="h6" style={{ color: "#b3b3b3", marginBottom: "16px" }}>
              Artist Name
            </Typography>
            {/* Rating (Stars Placeholder) */}
            <Typography variant="h6" style={{ color: "#1db954" }}>
              ★★★★★
            </Typography>
          </AlbumDetails>
        </AlbumInfoContainer>

        {/* Reviews Section */}
        <Box marginTop="32px" width="100%">
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

export default SongPage;
