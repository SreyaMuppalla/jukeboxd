import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Background } from "../../styles/StyledComponents";
import SongsCarousel from "../../bigcomponents/SongsCarousal";
import Review from "../../bigcomponents/Review";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import { getFriendReviews } from '@/backend/reviews';
import ReviewForm from '@/smallcomponents/ReviewForm'
import { useAuth } from "../../backend/auth.js";

const FeedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const {user} = useAuth()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!user) {
            return;
        }
        const reviews_data = await getFriendReviews(user.uid);
        setReviews(reviews_data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;

  return (
    <ProtectedRoute>
      <Background>
        <SongsCarousel />
        {/* Reviews from Friends */}
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
            Reviews from Friends
          </Typography>

          {/* Individual Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Review
                key={review.user_id} // Added key prop for list rendering
                userName={review.user_id}
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
        <ReviewForm></ReviewForm>
      </Background>
    </ProtectedRoute>
  );
};

export default FeedPage;
