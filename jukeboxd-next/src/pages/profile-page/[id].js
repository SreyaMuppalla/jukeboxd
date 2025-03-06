"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
    Background,
    ProfileContainer,
    ProfileInfo,
    ProfilePicContainer,
    ProfileDetailsContainer,
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
import { getReviewById } from '@/backend/reviews';
import {followUser, UnfollowUser} from '@/backend/users';

const ProfilePage = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) return;

        const fetchUserData = async () => {
            try {
                const data = await getUser(id);

                const userReviews = [];
                for (const reviewId of data.reviews || []) {
                    const review = await getReviewById(reviewId);
                    if (review) {
                        userReviews.push(review);
                    }
                }

                // Check if the current user is already following this profile
                setIsFollowing(data.followers?.includes(user?.uid) || false);

                setReviews(userReviews);
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, user]); // Re-run the effect when the id changes

    const handleFollow = async () => {
        if (!user || !userData) return;

        if (isFollowing) {
            try{
            await UnfollowUser(user.uid, id);
            setIsFollowing(false);
            } catch (err) {
                console.error("Error unfollowing user:", err);
            }
        } else {
            try{
                await followUser(user.uid, id);
                setIsFollowing(true);
            }
            catch (err) {
                console.error("Error following user:", err);
            }
        }
    };

    if (!id) return <div>Loading...</div>;
    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>Error loading profile: {error}</div>;

    // Don't show follow button if viewing own profile
    const showFollowButton = user?.uid !== id;

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
                                width={150}
                                height={150}
                                style={{
                                    borderRadius: "50%",
                                    marginRight: "16px",
                                }}
                            />
                        </ProfilePicContainer>
                        {/* Username and Stats */}
                        <ProfileDetailsContainer>
                            <ProfileDetails>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <Typography
                                        variant="h4"
                                        style={{
                                            color: "#fff",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        {userData?.username || "Username"}
                                    </Typography>
                                    {showFollowButton && (
                                        <Button
                                            variant="contained"
                                            color={isFollowing ? "secondary" : "primary"}
                                            onClick={handleFollow}
                                            style={{
                                                backgroundColor: isFollowing ? "#555" : "#1db954",
                                                color: "white",
                                                textTransform: "none"
                                            }}
                                        >
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </Button>
                                    )}
                                </div>
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

                    {/* Bio Section */}
                    <Box
                        style={{
                            marginTop: "16px",
                            padding: "16px",
                            backgroundColor: "#333",
                            borderRadius: "16px",
                            width: "90%",
                            margin: "auto",
                        }}
                    >
                        <Typography
                            variant="h6"
                            style={{ color: "#fff", marginBottom: "8px" }}
                        >
                            Bio
                        </Typography>
                        <Typography style={{ color: "#b3b3b3" }}>
                            {userData?.user_bio || "No bio available."}
                        </Typography>
                    </Box>
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
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <Review 
                                    key={index}
                                    userName={userData.username} 
                                    userProfilePic={userData.profilePicture} 
                                    rating={review.rating} 
                                    review_text={review.review_text} 
                                    songName={review.song_id} 
                                />
                            ))
                        ) : (
                            <Typography 
                                variant="body1" 
                                style={{ color: '#b3b3b3', textAlign: 'center', marginBottom: '16px' }}
                            >
                                No reviews yet.
                            </Typography>
                        )}
                    </Box>
                </ProfileContainer>
            </Background>
        </ProtectedRoute>
    );
};

export default ProfilePage;