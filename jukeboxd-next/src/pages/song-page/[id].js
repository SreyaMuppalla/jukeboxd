import React, { useState, useEffect } from "react";
import { Box, Rating, Typography, Button, Tab, Tabs, Skeleton } from "@mui/material";
import { Bookmark } from "@mui/icons-material";
import {
    Background,
    AlbumContainer,
    AlbumInfoContainer,
    AlbumDetails,
    ReviewsSection,
    ReviewContainer,
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
import spotifyTokenService from "@/states/spotifyTokenManager";

const SongPage = () => {
    const router = useRouter();
    const { id: songId } = router.query; // Correctly get the albumId from the dynamic route
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [selectedItem, setSelectedItem] = useAtom(currItem); // auto change currently selected song on load

    const [error, setError] = useState(null);
    const [songDetails, setSongDetails] = useState({
        name: "",
        artists: [{ id: "", name: "" }],
        album: { id: "", name: "" },
        images: [{}, { url: unknownArtwork }],
    });
    const [reviews, setReviews] = useState([]);
    const token = spotifyTokenService; // Access token state
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
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching song data:", error);
                setError("Failed to fetch song details.");
            } finally {
                // setLoading(false);
            }
        };

        if (songId) {
            getSongData();
        }
    }, [songId, token]); // Trigger useEffect whenever songId changes

    useEffect(() => {
        // Prefill review form
        const newSelectedItem = {
            ...songDetails,
            album_id: songDetails.album.id,
            album_name: songDetails.album.name,
            song_id: songDetails.id,
            song_name: songDetails.name,
            review_type: "song",
        };

        // Only update Jotai atom if the value has changed
        setSelectedItem((prevItem) =>
            JSON.stringify(prevItem) !== JSON.stringify(newSelectedItem)
                ? newSelectedItem
                : prevItem
        );
    }, [songId, songDetails]);

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
                let artist = songDetails.artists[0]
                let song_artist = artist instanceof Map 
                ? Array.from(artist.values())[0] || "Unknown Artist" // Get first artist from Map
                : Array.isArray(artist) 
                    ? artist[0]?.name || "Unknown Artist" // Handle array case
                    : artist?.name || "Unknown Artist" // Handle object case
                console.log({song_artist});
                await BookmarkSong(user.uid, songId, songDetails.name, song_artist);
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

    return (
        <ProtectedRoute>
            <Background>
                <AlbumContainer>
                    {/* Song Info Section */}
                    <AlbumInfoContainer>
                        {/* Album Cover */}
                        {loading ? 
                        <Skeleton variant="rectangular" width={200} height={200}/> 
                        : <Image
                            src={songDetails.images[1]?.url}
                            alt={songDetails.name + " Album Cover"}
                            width={200}
                            height={200}
                            style={{ borderRadius: "8px" }}
                        />
                        }
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
                                    {loading ? <Skeleton width={400}/> : songDetails.name}
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
                                        {loading ? <Skeleton width={300}/> : songDetails.album.name}
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
                                    {loading ? <Skeleton width={300}/> : songDetails.artists.map(
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

                                <Box display="flex" alignItems="center" gap={1}>
                                    <StarRating rating={songDetails.num_reviews > 0 ? songDetails.review_score / songDetails.num_reviews : 0} />
                                    <Typography variant="body1" style={{ color: '#d3d3d3', marginLeft: '8px' }}>
                                            ({songDetails.num_reviews} Reviews)
                                    </Typography>
                                </Box>   
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
                                left
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
                            {!loading && reviews.length > 0 ? (
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
