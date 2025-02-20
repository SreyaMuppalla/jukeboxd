import React from "react";
import "@fontsource/inter";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderBackground, ButtonContainer } from "../styles/StyledComponents";
import SearchBar from "../smallcomponents/SearchBar";
import jkbxlogo from "../images/jkbxlogo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are on the feed or profile page
  const isFeedPage = location.pathname === "/feed";
  const isProfilePage = location.pathname === "/profile";

  return (
    <HeaderBackground>
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Aligns items vertically
          gap: "16px", // Adds spacing between logo and text
        }}
      >
      <img
        src={jkbxlogo}
        alt="LOGO"
        style={{
          width: "55px", // Fixed width
          height: "55px", // Fixed height

          borderRadius: "4px",
        }}
      />

      <Typography
        style={{ color: "#FFFFFF", fontFamily: "Inter", fontSize: "40px", fontWeight: "bold" }}
      >
        jukeboxd
      </Typography>
      </Box>
      {/* Search Bar */}
      <SearchBar />

      {/* Navigation Buttons */}
      <ButtonContainer>
        <Button
          variant="contained"
          sx={{
            marginRight: 2,
            borderRadius: "50px",
            height: "52px",
            width: "90px",
            backgroundColor: isFeedPage ? "#1DB954" : "#535353",
            "&:hover": { backgroundColor: isFeedPage ? "#1AAE4E" : "#444444" },
            textTransform: "none", // Prevents uppercase transformation
          }}
          onClick={() => navigate("/feed")}
        >
          <Typography
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Feed
          </Typography>
        </Button>

        <Button
          variant="contained"
          sx={{
            borderRadius: "50px",
            height: "52px",
            width: "154px",
            backgroundColor: isProfilePage ? "#1DB954" : "#535353",
            "&:hover": { backgroundColor: isProfilePage ? "#1AAE4E" : "#444444" },
            textTransform: "none", // Prevents uppercase transformation
          }}
          onClick={() => navigate("/profile")}
        >
          <Typography
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            My Profile
          </Typography>
        </Button>

      </ButtonContainer>
    </HeaderBackground>
  );
};

export default Header;
