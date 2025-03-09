"use client";
import React, { useState, useEffect, useRef} from "react";
import { Box, Typography, Button, TextField, Tab, Tabs } from "@mui/material";
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
    SongCard,
    SignInButton
} from "../../styles/StyledComponents";
import Review from "../../bigcomponents/Review";
import pfp from "../../images/pfp.jpg"; // Add a placeholder profile pic
import Image from "next/image";
import albumpic from '../../images/albumpic.jpg'; // Import the album image
import { getUser, updateUserBio, updateUsername, updateUserProfilePicture} from "../../backend/users";
import { useRouter } from "next/router";
import { useAuth } from "../../backend/auth.js";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import { getReviewById } from '@/backend/reviews';
import {storage} from "../../backend/firebaseConfig"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Avatar from "@mui/material/Avatar";

const PersonalProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState("");
    const [editingUsername, setEditingUsername] = useState(false);
    const [username, setUsername] = useState("");
    const fileInputRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);


    const router = useRouter(); // Initialize navigation using Next.js router
    const { user, logOut } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

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

    const handleEditBio = async () => {
        if (!userData) return;

        if (editingBio) {
            // Save the updated bio to Firebase
            try {
                await updateUserBio(user.uid, bio);

                // Update local state
                setUserData((prevData) => ({ ...prevData, bio: bio }));
            } catch (err) {
                console.error("Error updating bio:", err);
            }
        }

        setEditingBio(!editingBio);
    };

    const handleEditUsername = async () => {
      if (!userData) return;
      if (editingUsername) {
          try {
            await updateUsername(user.uid, username);
          } catch (error) {
              console.error("Error updating username:", error);
          }
      }
      setEditingUsername(!editingUsername);
    };

    const handleFileSelect = () => {
        fileInputRef.current.click(); 
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            handleSubmit(e.target.files[0]); 
        }
    };

    const handleSubmit = async (selectedImage) => {
        if (!selectedImage) return;
    
        const imageRef = ref(storage, `profile_pictures/${user.uid}`);
        try {
            await uploadBytes(imageRef, selectedImage);
            const url = await getDownloadURL(imageRef);
            
            setUrl(url);
            await updateUserProfilePicture(user.uid, url);
            setImage(null);
        } catch (error) {
            console.log(error.message, "error handling the image upload");
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            // Only proceed if user is not null
            if (!user) {
                return;
            }
    
            try {
                const curr_user = user.uid;
                const data = await getUser(curr_user);
                const reviews = [];
                for (const reviewId of data.reviews) {
                    const review = await getReviewById(reviewId);
                    if (review) {
                        reviews.push(review);
                    }
                }
                setReviews(reviews);
                setUserData(data);
                setBio(data.user_bio)
                setUsername(data.username)
                setUrl(data.profilePicture);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, [user]);

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
                            <Avatar src={url} sx={{ width: 150, height: 150 }} style={{ borderRadius: "50%", marginRight: "16px" }} />
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
                            <SignInButton onClick={handleFileSelect} style={{padding: "5px 24px", marginTop: "16px"}}> Upload Image </SignInButton>
                          </ProfilePicContainer>
                        {/* Username and Stats */}
                        <ProfileDetailsContainer>
                            <ProfileDetails>
                        {editingUsername ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                                sx={{
                                    backgroundColor: "#444",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#1db954",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#1db954",
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <Typography style={{ color: "#b3b3b3" }}>
                                {username}
                            </Typography>
                        )}

                        <Button
                            onClick={handleEditUsername}
                            variant="contained"
                            style={{
                                backgroundColor: "#1db954",
                                color: "#fff",
                                marginTop: "16px",
                                textTransform: "none",
                                width: "10%",
                                padding: "16px",
                            }}
                        >
                            {editingUsername ? "Save Username" : "Edit Username"}
                        </Button>
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

                        {editingBio ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                variant="outlined"
                                sx={{
                                    backgroundColor: "#444",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#1db954",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#1db954",
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <Typography style={{ color: "#b3b3b3" }}>
                                {bio}
                            </Typography>
                        )}

                        <Button
                            onClick={handleEditBio}
                            variant="contained"
                            style={{
                                backgroundColor: "#1db954",
                                color: "#fff",
                                marginTop: "8px",
                                textTransform: "none",
                            }}
                        >
                            {editingBio ? "Save Bio" : "Edit Bio"}
                        </Button>
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
                        <Tabs
                            value={selectedTab}
                            onChange={(event, newValue) => setSelectedTab(newValue)}
                            centered
                            textColor="inherit"
                            TabIndicatorProps={{ style: { backgroundColor: "#1db954" } }}
                        >
                            <Tab label="Recent Reviews" sx={{
                                color: "white",
                                fontFamily: "Inter",
                                textTransform: "none", // Optional: Prevent uppercase transformation
                                fontSize: "16px",
                            }}/>
                            <Tab label="Like to Listen To" sx={{
                                color: "white",
                                fontFamily: "Inter",
                                textTransform: "none", // Optional: Prevent uppercase transformation
                                fontSize: "16px",
                            }} />
                        </Tabs>
                        {selectedTab === 0 && (
                            <Box style={{marginTop: "12px"}}>

                            {/* Individual Reviews */}
                                    {reviews.length > 0 ? (
                            reviews.map((review) => (
                            <Review review={review}/>
                            ))
                        ) : (
                            <>
                            <Typography 
                                variant="body1" 
                                style={{ color: '#b3b3b3', textAlign: 'center', marginBottom: '16px' }}
                            >
                                No reviews yet.
                            </Typography>
                            </>
                        )}
                        </Box>
                        )}
                        {selectedTab === 1 && (
                            <Box style={{marginTop: "12px"}}>
                                <SongCard albumCover={albumpic} songName="Song 1" artistName="Artist A" />
                            </Box>
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
