"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    const { user, signInWithGoogle, signInWithEmail, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            router.push("/feed");
        }
    }, [user, router]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (isSigningUp) {
                await signUp(email, password);
            } else {
                await signInWithEmail(email, password);
                router.push("/feed");
            }
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    const toggleSignUp = () => {
        setIsSigningUp((prev) => !prev);
        setEmail(""); // Reset email
        setPassword(""); // Reset password
        setError(""); // Clear any previous errors
    };

    return (
        <LoginBackground>
            <FormContainer>
                <Title variant="h2">jukeboxd</Title>

                {/* Error message */}
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSignIn}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" variant="contained" fullWidth>
                        {isSigningUp ? "Sign Up" : "Sign In"}
                    </Button>
                </form>

                <Button onClick={toggleSignUp}>
                    {isSigningUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Button>

                <SignInButton onClick={signInWithGoogle}>
                    Sign In with Google
                </SignInButton>
            </FormContainer>
        </LoginBackground>
    );
};

export default LoginPage;
