import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import {
  Background,
  ProfileContainer,
  ProfileInfo,
  ProfilePicContainer,
  ProfileDetailsContainer,
  ProfileDetails,
  StatsContainer,
  StatItem,
} from "../../styles/StyledComponents";
import Review from "../../bigcomponents/Review";
import pfp from "../../images/pfp.jpg";
import Image from "next/image";
import { getUser } from "../../backend/users";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";

const PersonalProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = "user1"; // Example: Use dynamic ID in production
        const data = await getUser(userId);
        setUserData(data);
        setBio(data?.bio || "No bio available");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditBio = async () => {
    if (!userData) return;

    if (editingBio) {
      // Save the updated bio to Firebase
      try {
        const userRef = doc(db, "users", "user1"); // Replace with dynamic user ID
        await updateDoc(userRef, { bio: bio });

        // Update local state
        setUserData((prevData) => ({ ...prevData, bio: bio }));
      } catch (err) {
        console.error("Error updating bio:", err);
      }
    }

    setEditingBio(!editingBio);
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
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
                style={{ color: "#fff", marginBottom: "8px" }}
              >
                {userData?.username || "Username"}
              </Typography>
            </ProfileDetails>

            {/* Stats Section */}
            <StatsContainer>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  {userData?.reviews?.length || 0}
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
                  Reviews
                </Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  {userData?.followers?.length || 0}
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
                  Followers
                </Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h5" style={{ color: "#1db954" }}>
                  {userData?.following?.length || 0}
                </Typography>
                <Typography variant="subtitle2" style={{ color: "#b3b3b3" }}>
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
            <Typography style={{ color: "#b3b3b3" }}>{bio}</Typography>
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
          <Typography
            variant="h5"
            style={{ color: "#fff", marginBottom: "16px", textAlign: "center" }}
          >
            Recent Reviews
          </Typography>

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
    </Background>
  );
};

export default PersonalProfilePage;