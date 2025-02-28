"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Typography, TextField } from "@mui/material";
import { useAuth } from "../../backend/auth.js";
import Image from "next/image";

import {
    Title,
    SignInButton,
    LoginBackground,
    FormContainer,
    InputField,
    ToggleText,
} from "../../styles/StyledComponents";
import jkbxlogo from "../../images/jkbxlogo.png"; // Add a placeholder profile pic

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

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

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

        console.log("Sign-in attempt:", email, password);
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
                <Image
                    src={jkbxlogo}
                    alt="LOGO"
                    style={{ width: "10%", height: "30%", borderRadius: "8px" }}
                />
                <Title variant="h2">jukeboxd</Title>

                {/* Error message */}
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSignIn}>
                    <InputField
                        label="Email"
                        placeholder="Email"
                        type="email"
                        color="success"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <InputField
                        label="Password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <SignInButton type="submit">
                        {isSigningUp ? "Sign Up" : "Sign In"}
                    </SignInButton>
                </form>

                <Button sx={{ color: "white" }} onClick={toggleSignUp}>
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
