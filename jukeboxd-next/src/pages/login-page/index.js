// pages/login.js

import { useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import { useAuth } from "../../utils/auth.js"; // Assuming your auth hook is still in the same location
import { Button, Typography } from "@mui/material"; // Adjust imports as needed

import {
    Title,
    SignInButton,
    LoginBackground,
    FormContainer,
} from "../../styles/StyledComponents";

const LoginPage = () => {
    const router = useRouter(); // Use Next.js router
    const { currentUser, signInWithGoogle, logout } = useAuth();

    useEffect(() => {
        if (currentUser) {
            router.push("/feed"); // Use Next.js router to navigate
        }
    }, [currentUser, router]);

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
