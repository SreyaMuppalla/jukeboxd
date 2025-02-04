import React from "react";
import { Button } from "@mui/material"; // Import the Material UI Button
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { HeaderBackground, ButtonContainer } from "../styles/StyledComponents"; // Keep your styled header background
import SearchBar from "../smallcomponents/SearchBar";

const Header = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <HeaderBackground>
      {/* Logo */}
      <img src="path_to_your_logo" alt="Jukeboxd Logo" className="logo" />

      {/* Search Bar */}
      <SearchBar />

      {/* Navigation Buttons */}
      <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }} // Spacing between buttons
          onClick={() => navigate("/feed")} // Navigate to FeedPage
        >
          Feed
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/profile")} // Navigate to PersonalProfilePage
        >
          My Profile
        </Button>
      </ButtonContainer>
    </HeaderBackground>
  );
};

export default Header;
