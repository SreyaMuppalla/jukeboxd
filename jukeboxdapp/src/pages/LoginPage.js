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

import {
    Title,
    SignInButton,
    LoginBackground,
    FormContainer,
} from "../styles/StyledComponents";

const LoginPage = () => {
    const navigate = useNavigate();
    const { currentUser, signInWithGoogle, logout } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/feed");
        }
    }, [currentUser, navigate]);

    return (
        <LoginBackground>
            <FormContainer>
                <Title variant="h2">jukeboxd</Title>
                {currentUser ? (
                    <SignInButton onClick={logout}>Log Out</SignInButton>
                ) : (
                    <SignInButton onClick={signInWithGoogle}>
                        Sign In with Google
                    </SignInButton>
                )}
            </FormContainer>
        </LoginBackground>
    );
};

export default LoginPage;
