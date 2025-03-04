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

    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
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
            await signInWithEmail(email, password);
            router.push("/feed");
        } catch (error) {
            setError(error.message);
            console.error(error);
        }

        console.log("Sign-in attempt:", email, password);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            await signUp(username, email, password, bio);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }

        console.log("Sign-Up attempt:", email, password);
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
                {!isSigningUp ? (
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
                        Sign In
                    </SignInButton>
                </form>) :
                (
                    <form onSubmit={handleSignUp}>
                    <InputField
                        label="Username"
                        placeholder="Username"
                        type="text"
                        color="success"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
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
                    <InputField
                        label="Bio"
                        placeholder="Bio"
                        type="text"
                        color="success"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />

                    <SignInButton type="submit">
                        Sign Up
                    </SignInButton>
                </form>
                )}

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
