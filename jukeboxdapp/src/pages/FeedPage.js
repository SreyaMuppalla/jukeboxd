import React from "react";
import { Box, Typography } from "@mui/material";
import { Background } from "../styles/StyledComponents";
import Header from "../bigcomponents/Header";
import SongsCarousel from "../bigcomponents/SongsCarousal";
import Review from "../bigcomponents/Review";

const FeedPage = () => {
  return (
    <Background>
      <SongsCarousel />
      {/* Reviews from Friends */}
      <Box
        style={{
          marginTop: "32px",
          padding: "16px",
          borderRadius: "16px",
          width: "90%",
          margin: "32px auto",
          display: "flex",
          flexDirection: "column",
          gap:"16px"
        }}
      >
        {/* Reviews Section Header */}
        <Typography
          variant="h5"
          style={{ color: "#fff", marginBottom: "16px", textAlign: "center" }}
        >
          Reviews from Friends
        </Typography>

        {/* Individual Reviews */}
        <Review />
        <Review />
        <Review />
      </Box>
    </Background>
  );
};

export default FeedPage;
