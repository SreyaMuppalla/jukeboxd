import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Typography } from "@mui/material"; // Import the Material UI Button
import { HeaderBackground, ButtonContainer } from "../styles/StyledComponents"; // Keep your styled header background
import SearchBar from "../smallcomponents/SearchBar";
import jkbxlogo from "../images/jkbxlogo.png"; // Add a placeholder profile pic
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";

const Header = () => {
    const router = useRouter(); // Get current pathname
    const pathname = router.pathname;

    // Determine if we are on the feed or profile page
    const isFeedPage = pathname === "/feed";
    const isProfilePage = pathname === "/profile";

    return (
        <ProtectedRoute>
            <HeaderBackground>
                {/* Logo */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center", // Vertically align the logo and text
                        gap: "16px", // Add space between logo and text
                    }}
                    >
                    <Image
                        src={jkbxlogo}
                        alt="LOGO"
                        style={{
                        width: "55px", // Fixed width
                        height: "55px", // Fixed height
                        borderRadius: "4px",
                        }}
                    />
                    <Typography
                        style={{
                        color: "#FFFFFF",
                        fontFamily: "Inter",
                        fontSize: "40px",
                        fontWeight: "bold",
                        }}
                    >
                        jukeboxd
                    </Typography>
                    </Box>
                <SearchBar type = "header"/>

                {/* Navigation Buttons */}
                <ButtonContainer>
                    <Button
                        variant="contained"
                        sx={{
                        marginRight: 2,
                        borderRadius: "50px",
                        height: "52px",
                        width: "90px",
                        backgroundColor: isFeedPage ? "#1DB954" : "#535353",
                        "&:hover": { backgroundColor: isFeedPage ? "#1AAE4E" : "#444444" },
                        textTransform: "none",
                        }}
                    >
                        <Link href="/feed" passHref>
                        <Typography
                            style={{
                            color: "#FFFFFF",
                            fontFamily: "Inter",
                            fontSize: "24px",
                            fontWeight: "bold",
                            }}
                        >
                            Feed
                        </Typography>
                        </Link>
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                        borderRadius: "50px",
                        height: "52px",
                        width: "154px",
                        backgroundColor: isProfilePage ? "#1DB954" : "#535353",
                        "&:hover": { backgroundColor: isProfilePage ? "#1AAE4E" : "#444444" },
                        textTransform: "none",
                        }}
                    >
                        <Link href="/profile" passHref>
                        <Typography
                            style={{
                            color: "#FFFFFF",
                            fontFamily: "Inter",
                            fontSize: "24px",
                            fontWeight: "bold",
                            }}
                        >
                            My Profile
                        </Typography>
                        </Link>
                    </Button>
                </ButtonContainer>
            </HeaderBackground>
        </ProtectedRoute>
    );
};

export default Header;
