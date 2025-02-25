import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
    Background,
    ProfileContainer,
    ProfileInfo,
    ProfilePicContainer,
    ProfileDetailsContainer, // New container for alignment
    ProfileDetails,
    StatsContainer,
    StatItem,
    ReviewsSection,
} from "../../styles/StyledComponents";
import Review from "../../bigcomponents/Review";
import pfp from "../../images/pfp.jpg"; // Add a placeholder profile pic
import Image from "next/image";
import { useRouter } from "next/router";

const ProfilePage = () => {
    return (
        <Background>
            <ProfileContainer>
                {/* Profile Info Section */}
                <ProfileInfo>
                    {/* Profile Picture */}
                    <ProfilePicContainer>
                        <Image
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
                            <Typography
                                variant="h4"
                                style={{ color: "#fff", marginBottom: "8px" }}
                            >
                                Username
                            </Typography>
                        </ProfileDetails>

                        {/* Stats aligned to the right */}
                        <StatsContainer>
                            <StatItem>
                                <Typography
                                    variant="h5"
                                    style={{ color: "#1db954" }}
                                >
                                    ##
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{ color: "#b3b3b3" }}
                                >
                                    Reviews
                                </Typography>
                            </StatItem>
                            <StatItem>
                                <Typography
                                    variant="h5"
                                    style={{ color: "#1db954" }}
                                >
                                    ##
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{ color: "#b3b3b3" }}
                                >
                                    Upvotes
                                </Typography>
                            </StatItem>
                            <StatItem>
                                <Typography
                                    variant="h5"
                                    style={{ color: "#1db954" }}
                                >
                                    ##
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{ color: "#b3b3b3" }}
                                >
                                    Friends
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
                        style={{
                            color: "#fff",
                            marginBottom: "16px",
                            textAlign: "center",
                        }}
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

export default ProfilePage;
