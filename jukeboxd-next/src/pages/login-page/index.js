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
import jkbxlogo from "../../images/jkbxlogo.png";
import { checkUser, createUser } from "@/backend/users.js";

const LoginPage = () => {
    const router = useRouter();
    const { user, signInWithGoogle, signInWithEmail, signUp } = useAuth();

    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // New loading state

    // 1. Prevent useEffect from redirecting during the sign-up process
    useEffect(() => {
        if (user && !loading) {
            router.push("/feed");
        }
    }, [user, router, loading]);

    // 2. Handle sign-in for existing users
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true); // Set loading during sign-in process
            await signInWithEmail(email, password);
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false); // Clear loading after sign-in
        }

        console.log("Sign-in attempt:", email, password);
    };

    // 3. Handle sign-up for new users
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true); // Set loading during sign-up process
            // Wait for user to be created and information saved to Firebase
            await signUp(username, email, password, null, bio);
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false); // Clear loading after sign-up
        }

        console.log("Sign-Up attempt:", email, password);
    };

const handleGoogleSignIn = async () => {
  setError('');
  setLoading(true);

  try {
    const result = await signInWithGoogle();
    const user = result.user;
    console.log(result);

    if (!user) {
      throw new Error('Google Sign-In failed.');
    }

    // Check if user exists in Firebase database
    const userExist = await checkUser(user.uid);
    console.log(userExist);

    if (!userExist) {
      // Create a new user in Firestore
      await createUser(user.uid, user.displayName, user.email, user.photoURL, "");
    }

    router.push('/feed'); // Redirect to feed after sign-in
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


    // Toggle between Sign In and Sign Up modes
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
                    // 4. Sign-in form for existing users
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

                        <SignInButton type="submit" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </SignInButton>
                    </form>
                ) : (
                    // 5. Sign-up form for new users
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

                        <SignInButton type="submit" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </SignInButton>
                    </form>
                )}

                <Button sx={{ color: "white" }} onClick={toggleSignUp}>
                    {isSigningUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Button>

                <SignInButton onClick={handleGoogleSignIn} disabled={loading}>
                    Sign In with Google
                </SignInButton>
            </FormContainer>
        </LoginBackground>
    );
};

export default LoginPage;
