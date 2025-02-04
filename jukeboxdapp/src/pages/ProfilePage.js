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

const ProfilePage = () => {
  return (
    <Background>
      <Header />
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
                Username
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
        <ReviewsSection>
          <Review />
          <Review />
          <Review />
        </ReviewsSection>
      </ProfileContainer>
    </Background>
  );
};

export default ProfilePage;
