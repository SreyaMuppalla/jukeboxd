// header
// pfp
// name
// both editable
// review/upvote/friends count
// recent reviews
"use client";
import React, { useState, useEffect } from "react";
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
import { getUser } from "../../backend/users";
import { useRouter } from "next/router";
import { useAuth } from "../../backend/auth.js";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";

const PersonalProfilePage = () => {
    const router = useRouter(); // Initialize navigation using Next.js router
    const { user, logOut } = useAuth();

    console.log("user", user);

    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logOut();
            router.push("/"); // Use router.push for redirection in Next.js
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Replace 'user123' with the actual user ID
                // This could come from authentication context, URL params, etc.
                const userId = "user1"; // Example: Use dynamic ID in production
                const data = await getUser(userId);
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>Error loading profile: {error}</div>;
    return (
        <ProtectedRoute>
            <Background>
                <ProfileContainer>
                    {/* Profile Info Section */}
                    <ProfileInfo>
                        {/* Profile Picture */}
                        <ProfilePicContainer>
                            <Image
                                src={userData?.profilePicture || pfp}
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
                                    style={{
                                        color: "#fff",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {userData?.username || "Username"}
                                </Typography>
                            </ProfileDetails>

                            {/* Stats aligned to the right */}
                            <StatsContainer>
                                <StatItem>
                                    <Typography
                                        variant="h5"
                                        style={{ color: "#1db954" }}
                                    >
                                        {userData?.reviews?.length || 0}
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
                                        {userData?.followers?.length || 0}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        style={{ color: "#b3b3b3" }}
                                    >
                                        Followers
                                    </Typography>
                                </StatItem>
                                <StatItem>
                                    <Typography
                                        variant="h5"
                                        style={{ color: "#1db954" }}
                                    >
                                        {userData?.following?.length || 0}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        style={{ color: "#b3b3b3" }}
                                    >
                                        Following
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
                        {userData?.recentReviews?.map((review, index) => (
                            <Review key={index} reviewData={review} />
                        )) || (
                            <>
                                <Review />
                                <Review />
                                <Review />
                            </>
                        )}
                    </Box>
                </ProfileContainer>

                {/* Logout Button */}
                {user && !isLoggingOut && (
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 16,
                            right: 16,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Background>
        </ProtectedRoute>
    );
};

export default PersonalProfilePage;
