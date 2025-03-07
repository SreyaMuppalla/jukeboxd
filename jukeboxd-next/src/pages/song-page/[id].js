import React, { useState, useEffect } from "react";
import { Box, Rating, Typography, Button, Tab, Tabs } from "@mui/material";
import { Bookmark } from "@mui/icons-material";
import {
    Background,
    AlbumContainer,
    AlbumInfoContainer,
    AlbumDetails,
    ReviewsSection,
} from "../../styles/StyledComponents";
import Review from "../../bigcomponents/Review";
import Link from "next/link";
import { fetchSongData } from "../../utils/apiCalls"; // Import your API controller
import { useRouter } from "next/router"; // Import Next.js useRouter
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import StarRating from "@/smallcomponents/StarRating";
import { getReviews } from "@/backend/reviews";
import { getUser, BookmarkSong, removeSongBookmark } from "@/backend/users";
import unknownArtwork from "@/images/unknown_artwork.jpg";
import Image from "next/image";
import { useAuth } from "@/backend/auth";
import { useAtom } from "jotai";
import { currItem } from "@/states/currItem";
import ReviewForm from "@/smallcomponents/ReviewForm";

const SongPage = () => {
    const router = useRouter();
    const { id: songId } = router.query; // Correctly get the albumId from the dynamic route
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const [error, setError] = useState(null);
    const [songDetails, setSongDetails] = useState({
        name: "",
        artists: [{ id: "", name: "" }],
        album: { id: "", name: "" },
        images: [{}, { url: unknownArtwork }],
    });
    const [reviews, setReviews] = useState([]);
    const [token, _] = useAtom(currItem); // Access token state
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false); // Fetch reviews on component mount

    const [selectedTab, setSelectedTab] = useState(0);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!user) return;
                const data = await getUser(user.uid);
                const reviews_data = await getReviews(songId, "song");
                setReviews(reviews_data);
                setIsBookmarked(
                    data.bookmarkedSongs?.includes(songId) || false
                );
                setUserData({ ...data, uid: user.uid });
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError(err.message);
            }
        };

        fetchReviews();
    }, [songId, user]);

    // Fetch song data when songId is available
    useEffect(() => {
        const getSongData = async () => {
            try {
                if (songId) {
                    const details = await fetchSongData(songId);
                    const reviews_data = await getReviews(songId, "song");
                    setReviews(reviews_data);
                    setSongDetails(details);
                }
            } catch (error) {
                console.error("Error fetching song data:", error);
                setError("Failed to fetch song details.");
            } finally {
                setLoading(false);
            }
        };

        if (songId) {
            getSongData();
        }
    }, [songId, token]); // Trigger useEffect whenever songId changes

    const handleBookmark = async () => {
        if (!songId) return;
        if (!user) return;

        setBookmarkLoading(true);

        if (isBookmarked) {
            try {
                await removeSongBookmark(user.uid, songId);
                setIsBookmarked(false);
            } catch (error) {
                console.error("Error removing bookmark:", error);
                setError("Failed to remove bookmark.");
            } finally {
                setBookmarkLoading(false);
            }
        } else {
            try {
                await BookmarkSong(user.uid, songId);
                setIsBookmarked(true);
            } catch (error) {
                console.error("Error bookmarking song:", error);
                setError("Failed to bookmark song.");
            } finally {
                setBookmarkLoading(false);
            }
        }
    };

    if (error) {
        return (
            <Typography variant="h5" style={{ color: "#ff4d4d" }}>
                {error}
            </Typography>
        ); // Display error if any
    }

    if (loading) return <div>Loading...</div>;

    return (
        <ProtectedRoute>
            <Background>
                <AlbumContainer>
                    {/* Song Info Section */}
                    <AlbumInfoContainer>
                        {/* Album Cover */}
                        <Image
                            src={songDetails.images[1]?.url}
                            alt={songDetails.name + " Album Cover"}
                            width={200}
                            height={200}
                            style={{ borderRadius: "8px" }}
                        />

                        {/* Right side with details and bookmark */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            flex="1"
                            alignItems="flex-start"
                        >
                            <AlbumDetails>
                                {/* Song Title */}
                                <Typography
                                    variant="h3"
                                    style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        marginBottom: "8px",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {songDetails.name}
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
                                    <Link
                                        href={`/album-page/${songDetails.album.id}`}
                                        passHref
                                        style={{
                                            color: "#b3b3b3",
                                            textDecoration: "none",
                                            transition: "color 0.3s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color =
                                                "#fff";
                                            e.currentTarget.style.textDecoration =
                                                "underline";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                "#b3b3b3";
                                            e.currentTarget.style.textDecoration =
                                                "none";
                                        }}
                                    >
                                        {songDetails.album.name}
                                    </Link>
                                </Typography>

                                {/* Artist Names */}
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: "#b3b3b3",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {songDetails.artists.map(
                                        (artist, index) => (
                                            <span key={artist.id}>
                                                <Link
                                                    href={`/artist-page/${artist.id}`}
                                                    passHref
                                                    style={{
                                                        color: "#b3b3b3",
                                                        textDecoration: "none",
                                                        transition:
                                                            "color 0.3s",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.color =
                                                            "#fff";
                                                        e.currentTarget.style.textDecoration =
                                                            "underline";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.color =
                                                            "#b3b3b3";
                                                        e.currentTarget.style.textDecoration =
                                                            "none";
                                                    }}
                                                >
                                                    {artist.name}
                                                </Link>
                                                {index <
                                                    songDetails.artists.length -
                                                        1 && ", "}
                                            </span>
                                        )
                                    )}
                                </Typography>

                                {/* Static Rating */}
                                <StarRating rating={3.2} />
                            </AlbumDetails>

                            {/* Bookmark Button (to the far right) */}
                            <Button
                                onClick={handleBookmark}
                                disabled={bookmarkLoading}
                                variant="contained"
                                sx={{
                                    backgroundColor: isBookmarked
                                        ? "#1DB954"
                                        : "#333",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: isBookmarked
                                            ? "#1ed760"
                                            : "#444",
                                    },
                                    minWidth: "120px",
                                    height: "40px",
                                    borderRadius: "20px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <Bookmark />
                                {isBookmarked ? "Bookmarked" : "Bookmark"}
                            </Button>
                        </Box>
                    </AlbumInfoContainer>

                    {/* Reviews Section */}
                    <Box marginTop="32px" width="100%">
                        <ReviewsSection
                            style={{
                                marginTop: "32px",
                                padding: "16px",
                                backgroundColor: "#333",
                                borderRadius: "16px",
                                width: "100%",
                                margin: "32px auto",
                            }}
                        >
                            <Tabs
                                value={selectedTab}
                                onChange={(event, newValue) =>
                                    setSelectedTab(newValue)
                                }
                                centered
                                textColor="inherit"
                                TabIndicatorProps={{
                                    style: { backgroundColor: "#1db954" },
                                }}
                            >
                                <Tab
                                    label="Recent Reviews"
                                    sx={{
                                        color: "white",
                                        fontFamily: "Inter",
                                        textTransform: "none", // Optional: Prevent uppercase transformation
                                        fontSize: "16px",
                                    }}
                                />
                            </Tabs>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Review review={review} />
                                ))
                            ) : (
                                <>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: "#b3b3b3",
                                            textAlign: "center",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        No reviews yet.
                                    </Typography>
                                </>
                            )}
                        </ReviewsSection>
                    </Box>
                </AlbumContainer>
                <ReviewForm userData={userData}></ReviewForm>
            </Background>
        </ProtectedRoute>
    );
};

export default SongPage;
