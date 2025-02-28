import React, {useState, useEffect} from "react";
import { Box, Typography } from "@mui/material";
import {
    Background,
    AlbumContainer,
    AlbumInfoContainer,
    AlbumDetails,
    ReviewsSection,
    AlbumCover,
} from "../../styles/StyledComponents";
import Review from "../../bigcomponents/Review";
import albumpic from "../../images/albumpic.jpg"; // Import the album cover image
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import {getSongReviews} from '@/backend/reviews';

const SongPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [song_reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Replace 'user1' with the actual user ID
        const songId = 'song1';
        const reviews_data = await getSongReviews(songId);
        console.log(reviews_data)
        setReviews(reviews_data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;
    return (
        <ProtectedRoute>
            <Background>
                <AlbumContainer>
                    {/* Song Info Section */}
                    <AlbumInfoContainer>
                        {/* Album Cover */}
                        <AlbumCover
                            style={{ cursor: "pointer" }} // Pointer cursor for clickable elements
                        >
                            <Link href="/album-page">
                                <Image
                                    src={albumpic}
                                    alt="Album Cover"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "16px",
                                        marginRight: "16px",
                                    }}
                                />
                            </Link>
                        </AlbumCover>
                        <AlbumDetails>
                            {/* Song Title */}
                            <Typography
                                variant="h3"
                                style={{ color: "#fff", marginBottom: "8px" }}
                            >
                                Song Title
                            </Typography>
                            {/* Album Name */}
                            <Typography
                                variant="h5"
                                style={{
                                    color: "#b3b3b3",
                                    marginBottom: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                <Link href="/album-page">Album Name</Link>
                            </Typography>
                            {/* Artist Name */}
                            <Typography
                                variant="h6"
                                style={{
                                    color: "#b3b3b3",
                                    marginBottom: "16px",
                                    cursor: "pointer",
                                }}
                            >
                                <Link href="/artist-page">Artist Name</Link>
                            </Typography>
                            {/* Rating (Stars Placeholder) */}
                            <Typography
                                variant="h6"
                                style={{ color: "#1db954" }}
                            >
                                ★★★★★
                            </Typography>
                        </AlbumDetails>
                    </AlbumInfoContainer>

                    {/* Reviews Section */}
                    <Box marginTop="32px" width="100%">
                        <ReviewsSection>
                            <Typography
                                variant="h5"
                                style={{ color: "#fff", marginBottom: "16px" }}
                            >
                                Reviews:
                            </Typography>
                            {song_reviews.length > 0 ? (
                                song_reviews.map((review) => (
                                <Review userName={review.user_id} rating= {review.rating} review_text={review.review_text} songName={review.song_id} />
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
                        </ReviewsSection>
                    </Box>
                </AlbumContainer>
            </Background>
        </ProtectedRoute>
    );
};

export default SongPage;
