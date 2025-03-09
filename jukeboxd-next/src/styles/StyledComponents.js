import styled from "styled-components";
import { Typography, Box } from "@mui/material";
import Image from "next/image";

export const Background = styled.div`
    background-color: #212121;
    height: auto;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
`;
export const HeaderBackground = styled.header`
    background-color: #121212;
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensures that logo, search bar, and buttons are spaced apart */
    padding: 0px 20px;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 1000;
`;
export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

// Carousel container
export const CarouselContainer = styled.div`
    position: relative;
    display: flex;
    overflow-x: auto;
    margin: 20px 70px;
    padding-top: 20px;
    gap: 20px;
    
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    
    white-space: nowrap;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    scrollbar-width: none;
    
    min-width: 0;
    flex-shrink: 0;

`;

// Individual song item
export const SongItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 180px; // Minimum width for each carousel item
    text-align: center;
    
`;

// Placeholder for the album cover
export const AlbumCover = styled.div`
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
    background-color: #212121;
    border-radius: 8px; // Optional: rounded corners
    overflow: hidden;
`;

// Placeholder for the album cover
export const LargeAlbumCover = styled.div`
    width: 320px;
    height: 320px;
    margin-bottom: 10px;
    background-color: #212121;
    border-radius: 8px; // Optional: rounded corners
    overflow: hidden;
`;

// Song name styling
export const SongName = styled(Typography)`
    cursor: pointer;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: text-decoration 0.3s ease;

    &:hover {
        text-decoration: underline;
    }
`;

export const ArrowButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
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
    height: 180px;
    margin: 16px auto;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

// Song and artist info container
export const SongInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 16px;
    width: 200px;
`;

export const ReviewSubContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 2;
    height: 100%;
    justify-content: space-between;
`;

// User info container
export const UserInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
`;

// Profile picture container
export const ProfilePic = styled.div`
    width: 40px;
    height: 40px;
    overflow: hidden;
`;

// Stars rating container
export const RatingContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

// Review text container
export const ReviewText = styled.div`
    flex-grow: 2;
    color: #fff;
    font-size: 18px;
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
    gap: 5px;
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
    align-items: center;
    width: 100%;
    gap: 24px;
    padding: 16px 32px;
`;

// Container for album details (name, artist, stars)
export const AlbumDetails = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-left: 32px;
`;

// Container for the list of songs
export const SongsListContainer = styled.div`
    flex: 0 0 30%; /* Take up 50% of the parent container */
    padding: 16px;
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
    width: 100%;
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

export const SongCard = ({ albumCover, songName, artistName }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#222",
                padding: "12px",
                borderRadius: "8px",
                width: "100%",
            }}
        >
            <Image
                src={albumCover}
                alt={songName}
                width={60}
                height={60}
                style={{ borderRadius: "8px" }}
            />
            <Box>
                <Typography
                    sx={{
                        color: "white",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    {songName} by {artistName}
                </Typography>
            </Box>
        </Box>
    );
};

// Dropdown select input
export const SearchDropdown = styled.select`
    padding: 10px;
    padding-right: 30px; /* Give space for the arrow */
    font-size: 16px;
    border-radius: 20px;
    border: none;
    outline: none;
    background-color: #333;
    color: #fff;
    text-align: center;
    text-align-last: center; /* Keeps the selected text centered */
    cursor: pointer;
    appearance: none; /* Hide default arrow */
    position: relative;

    /* Custom arrow */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='12px' height='12px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center; /* Keep arrow aligned */
    background-size: 20px; /* Adjust size of the arrow */

    &:focus {
        border: 2px solid #1db954;
    }
`;

export const SearchInputContainer = styled.div`
    display: flex;
    align-items: center;
    width: 60%;
    justify-content: center;
    position: relative;
`;

// Recommendation list container
export const RecommendationList = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    width: 100%;
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

export const LoginBackground = styled.div`
    background: linear-gradient(to bottom right, #121212, #535353);
    background-size: 400% 400%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const Title = styled(Typography)`
    color: #ffffff;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: #121212;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
`;

export const InputField = styled.input`
    padding: 12px;
    font-size: 16px;
    width: 100%;
    border-radius: 8px;
    border: none;
    outline: none;
    background-color: #333;
    color: #fff;
    text-align: center;
    margin-bottom: 16px;

    &::placeholder {
        color: #888; // Lighter gray for placeholder text
    }

    &:focus {
        border: 2px solid #1db954; // Highlight with Spotify's signature green
    }
`;

export const SignInButton = styled.button`
    background-color: #1db954;
    justify-content: center;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
        background-color: #1aa34a; // Slightly darker green on hover
        transform: scale(1.05); // Small scale effect on hover
    }

    &:active {
        transform: scale(1); // Reset scale on click
    }
`;
