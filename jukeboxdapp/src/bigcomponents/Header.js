// logo
// search bar
// feed button
// my profile button
import React from "react";
import { Button } from "@mui/material";  // Import the Material UI Button
import { HeaderBackground, ButtonContainer} from "../styles/StyledComponents"; // Keep your styled header background
import SearchBar from "../smallcomponents/SearchBar";

const Header = () => {
    return (
      <HeaderBackground>
        <img src="path_to_your_logo" alt="Jukeboxd Logo" className="logo" />
        <SearchBar />
        <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}  // Spacing between buttons
        >
          Feed
        </Button>
        <Button
          variant="contained"
          color="primary"
        >
          My Profile
        </Button>
      </ButtonContainer>
      </HeaderBackground>
    );
  };
  
  export default Header;
  