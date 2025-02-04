// header
// trending songs carousal
// reviews from friends
// write a review
import React from "react";
import { Background } from "../styles/StyledComponents";
import Header from "../bigcomponents/Header";
import SongsCarousel from "../bigcomponents/SongsCarousal";
import Review from "../bigcomponents/Review";

const FeedPage = () => {
    return (
        <Background>
            <Header />
            <SongsCarousel />
            <Review />
        </Background>
      );
};

export default FeedPage;
