"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signInWithGoogle, logout } from "../../backend/auth.js";
import { Button, Typography, TextField } from "@mui/material";
import { useAuth } from "../../backend/auth.js";

import {
    Title,
    SignInButton,
    LoginBackground,
    FormContainer,
} from "../../styles/StyledComponents";

const LoginPage = () => {
    const router = useRouter(); // Use Next.js router
    const { user, signIn } = useAuth();

    useEffect(() => {
        if (user) {
            router.push("/feed");
        }
    }, [user, router]);

    return (
        <LoginBackground>
            <FormContainer>
                <Title variant="h2">jukeboxd</Title>
                <SignInButton onClick={signIn}>
                    Sign In with Google
                </SignInButton>
            </FormContainer>
        </LoginBackground>
    );
};

export default LoginPage;
