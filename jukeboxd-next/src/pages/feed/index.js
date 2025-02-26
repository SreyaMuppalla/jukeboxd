import React from "react";
import { Box, Typography } from "@mui/material";
import { Background } from "../../styles/StyledComponents";
import SongsCarousel from "../../bigcomponents/SongsCarousal";
import Review from "../../bigcomponents/Review";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";

const FeedPage = () => {
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
                    <Review />
                    <Review />
                    <Review />
                </Box>
            </Background>
        </ProtectedRoute>
    );
};

export default FeedPage;
