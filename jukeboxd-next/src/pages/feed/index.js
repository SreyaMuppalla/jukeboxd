import React, { useState, useEffect } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { Background, ReviewContainer } from '../../styles/StyledComponents';
import SongsCarousel from '../../bigcomponents/SongsCarousal';
import Review from '../../bigcomponents/Review';
import ProtectedRoute from '@/smallcomponents/ProtectedRoute';
import { getFriendReviews } from '@/backend/reviews';
import ReviewForm from '@/smallcomponents/ReviewForm';
import { useAuth } from '../../backend/auth.js';
import { getUser } from '@/backend/users';

const FeedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!user) {
          return;
        }
        const userData = await getUser(user.uid);
        const reviews_data = await getFriendReviews(user.uid);
        setReviews(reviews_data);
        setUserData({ ...userData, uid: user.uid });
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (error) return <div>Error loading reviews: {error}</div>;

  return (
    <ProtectedRoute>
      <Background>
        <SongsCarousel />
        {/* Reviews from Friends */}
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
            style={{
              color: '#fff',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Reviews from Friends
          </Typography>

          {/* Individual Reviews */}
          {loading &&
            Array.from({ length: 2 }).map((_, index) => (
              <ReviewContainer>
                <Skeleton
                  variant="rectangular"
                  key={`skeleton-${index}`}
                  width="100%"
                  height="100%"
                />
              </ReviewContainer>
            ))}
          {loading || reviews.length > 0 ? (
            reviews.map((review) => <Review review={review} />)
          ) : (
            <Typography
              variant="body1"
              style={{
                color: '#b3b3b3',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              No reviews yet.
            </Typography>
          )}
        </Box>
        <ReviewForm userData={userData}></ReviewForm>
      </Background>
    </ProtectedRoute>
  );
};

export default FeedPage;
