import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Typography } from "@mui/material";

const StarRating = ({ rating }) => {
    const MAX_STARS = 5;

    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75; // Show half star if between 0.25 and 0.75
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    // State to manage hover effect
    const [isHovered, setIsHovered] = useState(false);

    // Handle mouse enter and leave
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            style={{ display: "flex", gap: "2px", alignItems: "center" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
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

            {/* Show Rating on Hover */}
            {isHovered && (
                <Typography
                    variant="body2"
                    style={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        marginLeft: "8px",
                    }}
                >
                    {rating.toFixed(1)} / 5
                </Typography>
            )}
        </div>
    );
};

export default StarRating;
