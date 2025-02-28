import React from "react";
import { Box, Button, Typography } from "@mui/material"; // Import the Material UI Button
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { HeaderBackground, ButtonContainer } from "../styles/StyledComponents"; // Keep your styled header background
import SearchBar from "../smallcomponents/SearchBar";
import jkbxlogo from "../images/jkbxlogo.png"; // Add a placeholder profile pic

const Header = () => {
    const navigate = useNavigate(); // Initialize navigation

    return (
        <HeaderBackground>
            {/* Logo */}
            <img
                src={jkbxlogo}
                alt="LOGO"
                style={{ width: "5%", height: "30%", borderRadius: "8px" }}
            />
            <Typography style={{ color: "#FFFFFF" }}>jukeboxd</Typography>
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
