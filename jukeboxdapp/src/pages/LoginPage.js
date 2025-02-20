import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth.js";
import {
    Button,
    Typography,
    Container,
    Card,
    CardContent,
} from "@mui/material";

const LoginPage = () => {
    const navigate = useNavigate();
    const { currentUser, signInWithGoogle, logout } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/feed");
        }
    }, [currentUser, navigate]);

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 10, p: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login Page
                    </Typography>
                    {currentUser ? (
                        <Button onClick={logout}>Log Out</Button>
                    ) : (
                        <Button onClick={signInWithGoogle}>
                            Sign In with Google
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;
