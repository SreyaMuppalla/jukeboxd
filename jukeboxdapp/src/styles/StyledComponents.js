import styled from "styled-components";
import { Typography } from "@mui/material";

export const Background = styled.div`
  background-color: #212121;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
export const HeaderBackground = styled.header`
  background-color: #121212;
  height: 108px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures that logo, search bar, and buttons are spaced apart */
  padding: 0 20px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;  
  gap: 8px
`;

// Carousel container
export const CarouselContainer = styled.div`
  display: flex;
  overflow-x: scroll;  // Makes it horizontally scrollable
  padding: 20px;
  gap: 20px;  // Adds space between each item in the carousel
`;

// Individual song item
export const SongItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;  // Minimum width for each carousel item
  text-align: center;
`;

// Placeholder for the album cover
export const AlbumCover = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  background-color: #212121;
  border-radius: 8px;  // Optional: rounded corners
  overflow: hidden;
`;

// Song name styling
export const SongName = styled(Typography)`
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
`;

// Container for stars (Rating component)
export const StarsContainer = styled.div`
  margin-top: 5px;
`;

export const ReviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background-color: #535353;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 800px;
  margin: 16px auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

// Song and artist info container
export const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  margin-right: 16px;
`;

// User info container
export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

// Profile picture container
export const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  overflow: hidden;
`;

// Stars rating container
export const RatingContainer = styled.div`
  margin-top: 4px;
`;

// Review text container
export const ReviewText = styled.div`
  flex-grow: 2;
  color: #fff;
  font-size: 14px;
  margin-top: 8px;
`;