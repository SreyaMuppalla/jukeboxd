import styled from "styled-components";
import { Typography } from "@mui/material";

export const Background = styled.div`
  background-color: #212121;
  height: 100%;
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
  padding: 0px 20px;
  gap: 16px;
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
// Main container for the Profile Page
export const ProfileContainer = styled.div`
  background-color: #212121;
  padding: 32px;
  min-height: 100vh;
`;

// Profile info section
export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

// Profile picture container
export const ProfilePicContainer = styled.div`
  flex-shrink: 0;
`;

// Profile details container
export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 16px;
`;

// Stats container
export const StatsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 24px;
  margin-top: 16px;
`;

// Individual stat item
export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Reviews section
export const ReviewsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;
export const ProfileDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1; // Ensures it takes up the remaining space
`;

export const AlbumContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
`;

// Container for album info (cover + details)
export const AlbumInfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 16px 32px;
`;

// Container for album details (name, artist, stars)
export const AlbumDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// Container for the list of songs
export const SongsListContainer = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #333;
  border-radius: 16px;
  margin-right: 16px;
`;

export const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; // Ensures it takes the remaining space
  padding-left: 16px; // Adds spacing from the album cover
  color: #fff;

  & > * {
    margin-bottom: 4px; // Adds consistent spacing between text elements
  }

  & > *:last-child {
    margin-bottom: 0; // Removes spacing for the last child
  }
`;

export const TopSongItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #444; // Subtle background for each item
  border-radius: 12px;

  &:hover {
    background-color: #555; // Slight highlight on hover
    cursor: pointer;
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

export const SongDetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 16px;
  flex-grow: 1;

  & > * {
    margin-right: 8px; // Add space between song name, stars, etc.
  }
`;

export const SongDetailsText = styled.div`
  display: flex;
  flex-direction: column;

  & > .song-name {
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 4px;
    text-decoration: underline;
  }

  & > .album-name {
    color: #ccc;
    font-size: 1rem;
    margin-bottom: 2px;
    text-decoration: underline;
  }

  & > .year {
    color: #aaa;
    font-size: 0.9rem;
  }
`;
// Search bar container
export const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  justify-content: center;
`;

// Dropdown container
export const DropdownContainer = styled.div`
  margin-right: 10px;
`;

// Search input field
export const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 60%;
  border-radius: 20px;
  border: none;
  outline: none;
  background-color: #333;
  color: #fff;
  text-align: center;

  &:focus {
    border: 2px solid #1db954;
  }
`;

// Dropdown select input
export const SearchDropdown = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  background-color: #333;
  color: #fff;
  text-align: center;
  cursor: pointer;

  &:focus {
    border: 2px solid #1db954;
  }
`;

// Recommendation list container
export const RecommendationList = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  width: 60%;
  background-color: #121212;
  border-radius: 16px;
  padding: 16px;
  z-index: 1000;
`;

// Individual recommendation item
export const RecommendationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #333;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #444;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 10px;
  }
`;

// Song details in the recommendation list
export const RecommendationDetails = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column;

  .song-title {
    font-size: 16px;
    font-weight: bold;
  }

  .artist-name {
    font-size: 14px;
    color: #ccc;
  }
`;