// header
// pfp
// name
// both editable
// review/upvote/friends count
// recent reviews

import React from "react";
import { Box, Typography } from "@mui/material";
import { 
  Background, 
  ProfileContainer, 
  ProfileInfo, 
  ProfilePicContainer, 
  ProfileDetailsContainer, // New container for alignment
  ProfileDetails, 
  StatsContainer, 
  StatItem, 
  ReviewsSection 
} from "../styles/StyledComponents";
import Header from "../bigcomponents/Header";
import Review from "../bigcomponents/Review";
import pfp from "../images/pfp.jpg"; // Add a placeholder profile pic

const PersonalProfilePage = () => {
  return (
    <Background>
      <ProfileContainer>
        {/* Profile Info Section */}
        <ProfileInfo>
          {/* Profile Picture */}
          <ProfilePicContainer>
            <img
              src={pfp}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            />
          </ProfilePicContainer>

          {/* Username and Stats */}
          <ProfileDetailsContainer>
            <ProfileDetails>
              <Typography variant="h4" style={{ color: "#fff", marginBottom: "8px" }}>
                PERSONAL PROFILE
              </Typography>
            </ProfileDetails>
            
            {/* Stats aligned to the right */}
            <StatsContainer>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  ##
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
                  word
                </Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  ##
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
                  word
                </Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  ##
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
                  word
                </Typography>
              </StatItem>
            </StatsContainer>
          </ProfileDetailsContainer>
        </ProfileInfo>

        {/* Reviews Section */}
        <Box
        style={{
          marginTop: "32px",
          padding: "16px",
          backgroundColor: "#333",
          borderRadius: "16px",
          width: "90%",
          margin: "32px auto",
        }}
      >
        {/* Reviews Section Header */}
        <Typography
          variant="h5"
          style={{ color: "#fff", marginBottom: "16px", textAlign: "center" }}
        >
          Recent Reviews
        </Typography>

        {/* Individual Reviews */}
        <Review />
        <Review />
        <Review />
      </Box>
      </ProfileContainer>
    </Background>
  );
};

export default PersonalProfilePage;

