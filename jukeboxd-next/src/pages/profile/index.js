// header
// pfp
// name
// both editable
// review/upvote/friends count
// recent reviews

import React, {useState, useEffect} from 'react';
import { Box, Typography } from '@mui/material';
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
} from '../../styles/StyledComponents';
import Review from '../../bigcomponents/Review';
import pfp from '../../images/pfp.jpg'; // Add a placeholder profile pic
import Image from 'next/image';
import { getUser } from '../../backend/users';
import { getReview } from '@/backend/reviews';

const PersonalProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace 'user1' with the actual user ID
        const userId = 'user1';
        const data = await getUser(userId);
        const reviews = [];
        for (const reviewId of data.reviews) {
          const review = await getReview(reviewId);
          if (review) {
            reviews.push(review);
          }
        }
        setReviews(reviews);
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
          {/* Username and Stats */}
          <ProfileDetailsContainer>
            <ProfileDetails>
              <Typography
                variant="h4"
                style={{ color: '#fff', marginBottom: '8px' }}
              >
                {userData?.username || "Username"}
              </Typography>
            </ProfileDetails>

            {/* Stats aligned to the right */}
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
                {userData?.followering?.length || 0}
                </Typography>
                <Typography variant="subtitle2" style={{ color: '#b3b3b3' }}>
                  Following
                </Typography>
              </StatItem>
            </StatsContainer>
          </ProfileDetailsContainer>
        </ProfileInfo>
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
          {/* Reviews Section Header */}
          <Typography
            variant="h5"
            style={{ color: '#fff', marginBottom: '16px', textAlign: 'center' }}
          >
            Recent Reviews
          </Typography>
          {/* Individual Reviews */}

          {reviews.length > 0 ? (
                reviews.map((review) => (
                <Review userName={userData.user_id} userProfilePic={userData.profilePicture} rating= {review.rating} review_text={review.review_text} songName={review.song_id} />
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
      </ProfileContainer>
    </Background>
  );
};
export default PersonalProfilePage;