import React from "react";
import { Box, Button, Typography } from "@mui/material"; // Import the Material UI Button
import { HeaderBackground, ButtonContainer } from "../styles/StyledComponents"; // Keep your styled header background
import SearchBar from "../smallcomponents/SearchBar";
import jkbxlogo from "../images/jkbxlogo.png"; // Add a placeholder profile pic
import Link from "next/link";
import Image from "next/image";


const Header = () => {

  return (
    <HeaderBackground>
      {/* Logo */}
      <Image
        src={jkbxlogo}
        alt="LOGO"
        style={{ width: '5%', height: '30%', borderRadius: '8px' }}
      />
      <Typography style={{ color: '#FFFFFF' }}>jukeboxd</Typography>
      {/* Search Bar */}
      <SearchBar type = "header"/>

      {/* Navigation Buttons */}
      <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }} // Spacing between buttons
        >
          <Link href="/feed">Feed</Link>
        </Button>
        <Button
          variant="contained"
          color="primary"
        >
          <Link href='/profile'>My Profile</Link>
        </Button>
      </ButtonContainer>
    </HeaderBackground>
  );
};

export default Header;
