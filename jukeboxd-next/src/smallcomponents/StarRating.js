import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const StarRating = ({ rating }) => {
    const MAX_STARS = 5;

    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75; // Show half star if between 0.25 and 0.75
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {/* Full Stars */}
            {Array.from({ length: fullStars }).map((_, index) => (
                <StarIcon key={`full-${index}`} style={{ color: "#FFD700" }} />
            ))}

            {/* Half Star (only if rating is close to .5) */}
            {hasHalfStar && <StarHalfIcon style={{ color: "#FFD700" }} />}

            {/* Empty Stars to make 5 total */}
            {Array.from({ length: emptyStars }).map((_, index) => (
                <StarOutlineIcon
                    key={`empty-${index}`}
                    style={{ color: "#FFD700" }}
                />
            ))}
        </div>
    );
};

export default StarRating;
