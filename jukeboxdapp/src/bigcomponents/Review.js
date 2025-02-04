// album cover
// text box for song name
// text box for artist name
// username and pfp
// stars
// date reviewed
// review
// upvotes/downvotes
// extension to comments
import React from "react";
import { Box, Typography, Rating } from "@mui/material"; // Material UI components
import { 
  ReviewContainer, 
  AlbumCover, 
  SongInfo, 
  UserInfo, 
  ProfilePic, 
  RatingContainer, 
  ReviewText 
} from "../styles/StyledComponents";
import albumpic from "../images/albumpic.jpg"; // Import the album image
import pfp from "../images/pfp.jpg"; // Add a placeholder profile pic
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Review = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <ReviewContainer>
      {/* Album Cover */}
      <AlbumCover
        onClick={() => navigate("/album-page")} // Navigate to AlbumPage
        style={{ cursor: "pointer" }} // Pointer cursor for clickable elements
      >
        <img
          src={albumpic}
          alt="Album Cover"
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        />
      </AlbumCover>

      {/* Song and Artist Info */}
      <SongInfo>
        <Typography
          variant="h6"
          style={{ color: "#fff", marginBottom: "4px", cursor: "pointer" }} // Pointer cursor
          onClick={() => navigate("/song-page")} // Navigate to SongPage
        >
          Song Name
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: "#d3d3d3", cursor: "pointer" }} // Pointer cursor
          onClick={() => navigate("/artist-page")} // Navigate to ArtistPage
        >
          Artist Name
        </Typography>
      </SongInfo>

      {/* User Info */}
      <UserInfo>
        <ProfilePic
          onClick={() => navigate("/profile-page")} // Navigate to ProfilePage
          style={{ cursor: "pointer" }} // Pointer cursor
        >
          <img
            src={pfp}
            alt="User Profile"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </ProfilePic>
        <Typography
          variant="subtitle2"
          style={{ color: "#fff", marginLeft: "8px", cursor: "pointer" }} // Pointer cursor
          onClick={() => navigate("/profile-page")} // Navigate to ProfilePage
        >
          Username
        </Typography>
        <RatingContainer>
          <Rating name="read-only" value={5} readOnly />
        </RatingContainer>
      </UserInfo>

      {/* Review Text */}
      <ReviewText>
        This is a placeholder review. The user loved this song and wrote a lot
        of amazing things about it! 🎵
      </ReviewText>
    </ReviewContainer>
  );
};

export default Review;
