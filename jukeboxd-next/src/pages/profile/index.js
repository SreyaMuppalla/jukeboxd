import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import {
  Background,
  ProfileContainer,
  ProfileInfo,
  ProfilePicContainer,
  ProfileDetailsContainer,
  ProfileDetails,
  StatsContainer,
  StatItem,
} from '../../styles/StyledComponents';
import Review from '../../bigcomponents/Review';
import pfp from '../../images/pfp.jpg';
import Image from 'next/image';
import { getUser, updateUserBio } from '../../backend/users';

const PersonalProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 'user1'; // Replace with dynamic user ID
        const data = await getUser(userId);
        setUserData(data);
        setBio(data?.bio || 'Add a bio...');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleBlur = async () => {
    const userId = 'user1';
    setEditingBio(false);
    await updateUserBio(userId, bio); // Update Firebase
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
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                marginRight: '16px',
              }}
            />
          </ProfilePicContainer>

          {/* Username and Bio */}
          <ProfileDetailsContainer>
            <ProfileDetails>
              <Typography variant="h4" style={{ color: '#fff', marginBottom: '8px' }}>
                {userData?.username || 'Username'}
              </Typography>

              {/* Click-to-Edit Bio */}
              {editingBio ? (
                <TextField
                  variant="outlined"
                  fullWidth
                  value={bio}
                  onChange={handleBioChange}
                  onBlur={handleBlur}
                  autoFocus
                  inputProps={{ maxLength: 150 }}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <Typography
                  variant="body1"
                  style={{ color: '#b3b3b3', cursor: 'pointer' }}
                  onClick={() => setEditingBio(true)}
                >
                  {bio}
                </Typography>
              )}
            </ProfileDetails>
          </ProfileDetailsContainer>
        </ProfileInfo>

        {/* Stats Section */}
        <StatsContainer>
          <StatItem>
            <Typography variant="h5" style={{ color: '#1db954' }}>
              {userData?.reviews?.length || 0}
            </Typography>
            <Typography variant="subtitle2" style={{ color: '#b3b3b3' }}>
              Reviews
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h5" style={{ color: '#1db954' }}>
              {userData?.followers?.length || 0}
            </Typography>
            <Typography variant="subtitle2" style={{ color: '#b3b3b3' }}>
              Followers
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h5" style={{ color: '#1db954' }}>
              {userData?.following?.length || 0}
            </Typography>
            <Typography variant="subtitle2" style={{ color: '#b3b3b3' }}>
              Following
            </Typography>
          </StatItem>
        </StatsContainer>

        {/* Reviews Section */}
        <Box
          style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#333',
            borderRadius: '16px',
            width: '90%',
            margin: '32px auto',
          }}
        >
          <Typography variant="h5" style={{ color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
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
