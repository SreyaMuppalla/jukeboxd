import React from "react";
import { Box, Typography, Rating } from "@mui/material";
import { styled } from "@mui/system";
import albumpic from "../images/albumpic.jpg";
import pfp from "../images/pfp.jpg";
import { useNavigate } from "react-router-dom";
import commentbubble from "../images/commentbubble.jpg";

const ReviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  borderRadius: "8px",
  padding: "16px",
  gap: theme.spacing(2),
  width: "100%",
  alignItems: "center", // Vertically align items
  backgroundColor: "#333",

}));

const AlbumCover = styled("div")({
  width: "120px",
  height: "120px",
  borderRadius: "4px",
  overflow: "hidden",
  flexShrink: 0, // Prevent shrinking
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cursor: "pointer",
});

const InfoContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
});

const SongInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const UserInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const ProfilePic = styled("div")({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  overflow: "hidden",
  flexShrink: 0,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cursor: "pointer",
});
const CommentBubble = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  cursor: "pointer",
  "& img": {
    width: "16px",
    height: "16px",
  },
});
const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const ReviewText = styled(Typography)({
  color: "#fff",
  fontSize: "16px",
  fontFamily: "Inter",
  width: "700px"
});

const AdditionalInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop:"0px",
  marginBottom: "0px",
  alignSelf: "stretch", 
  marginLeft: "auto", // Push to the right
  color: "#fff",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "4px 16px"
});

const Review = () => {
  const navigate = useNavigate();

  return (
    <ReviewContainer>
      {/* Album Cover */}
      <AlbumCover onClick={() => navigate("/album-page")}>
        <img src={albumpic} alt="Album Cover" />
      </AlbumCover>

      {/* Info Container */}
      <InfoContainer>
        <SongInfo>
          <Typography
            variant="subtitle1"
            style={{ color: "#fff", cursor: "pointer", fontFamily:"Inter", fontSize:"24px" }}
            onClick={() => navigate("/song-page")}
          >
            Song Name
          </Typography>
          <Typography
            variant="body2"
            style={{ color: "#d3d3d3", cursor: "pointer", fontFamily:"Inter", fontSize:"20px"}}
            onClick={() => navigate("/artist-page")}
          >
            Artist Name
          </Typography>
        </SongInfo>
      </InfoContainer>
      <Box
        style={{
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          gap:"8px"
        }}
      >
      <UserInfo>
          <ProfilePic onClick={() => navigate("/profile-page")}>
            <img src={pfp} alt="User Profile" />
          </ProfilePic>
          <Typography
            variant="body2"
            style={{ color: "#fff", cursor: "pointer", fontFamily: "Inter", fontSize:"16px" }}
            onClick={() => navigate("/profile-page")}
          >
            Username
          </Typography>
          <RatingContainer>
            <Rating name="read-only" value={5} size="small" readOnly />
          </RatingContainer>
        </UserInfo>
      {/* Review Text */}
      <ReviewText>
        This is a placeholder review. The user loved this song and wrote a lot
        of amazing things about it! 🎵 This is a placeholder review. The user loved this song and wrote a lot
        of amazing things about it! 🎵
      </ReviewText>
      </Box>

      {/* Additional Info (Date, Likes, etc.) */}
      <AdditionalInfo>
        <Typography variant="caption" style={{fontFamily: "Inter", fontSize:"12px"}}>Jan 27, 2025</Typography>
        <Box
        style={{
          borderRadius: "16px",
          display: "flex",
          flexDirection: "row",
          gap:"8px"
        }}
      >        
      <CommentBubble onClick={() => navigate("/comments-page")}>
            <img src={commentbubble} alt="Comments" />
            <Typography variant="caption">15</Typography>
          </CommentBubble>
      <Typography variant="caption">👍10 </Typography>
        <Typography variant="caption">👎3k </Typography>
        
        </Box>
      </AdditionalInfo>
    </ReviewContainer>
  );
};

export default Review;
