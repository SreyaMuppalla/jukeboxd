"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { 
    Button, 
    Typography, 
    Avatar, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions 
} from "@mui/material";
import { useAuth } from "../../backend/auth.js";
import Image from "next/image";

import {
    Title,
    SignInButton,
    LoginBackground,
    FormContainer,
    InputField,
} from "../../styles/StyledComponents";
import { getUser } from "@/backend/users.js";
import jkbxlogo from "../../images/jkbxlogo.png";

const LoginPage = () => {
    const router = useRouter();
    const { 
        user, 
        signInWithGoogle, 
        signInWithEmail, 
        signUp,  
    } = useAuth();
    // Default to Sign In mode
    const [isSigningUp, setIsSigningUp] = useState(false);

    // Signin state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Signup state
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        profilePicture: "",
        user_bio: ""
    });

    const [error, setError] = useState("");
    const [profilePreview, setProfilePreview] = useState(null);
    const [usernameError, setUsernameError] = useState("");
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            router.push("/feed");
        }
    }, [user, router]);

    // Handle signin
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
    };

    // Handle input changes for signup
    const handleSignupInputChange = (e) => {
        const { name, value, files } = e.target;

        // Handle file upload for profile picture
        if (name === "profilePicture" && files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignupData(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            setSignupData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Check username availability
    const validateUsername = async () => {
        if (!signupData.username) {
            setUsernameError("Username is required");
            return false;
        }

        try {
            const isAvailable = await getUser(signupData.username);
            
            if (!isAvailable) {
                setIsUsernameModalOpen(true);
                return false;
            }
            
            setUsernameError("");
            return true;
        } catch (error) {
            setUsernameError("Error checking username availability");
            return false;
        }
    };

    // Handle signup submission
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        
        // Validate required fields
        if (!signupData.username || !signupData.email || !signupData.password) {
            setError("Please fill in all required fields");
            return;
        }

        // Validate username availability
        const isUsernameValid = await validateUsername();
        if (!isUsernameValid) return;

        try {
            // Signup with extended user data
            const res = await signUp(signupData.email, signupData.password);
            if (!res) {
                throw new Error("Error creating account");
            }
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    // Toggle between signup and login
    const toggleSignUp = () => {
        setIsSigningUp((prev) => !prev);
        
        // Reset forms
        if (isSigningUp) {
            // Switching to Sign In - reset signup form
            setSignupData({
                username: "",
                email: "",
                password: "",
                profilePicture: "",
                user_bio: ""
            });
            setProfilePreview(null);
        } else {
            // Switching to Sign Up - reset signin form
            setEmail("");
            setPassword("");
        }
        
        setError("");
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

                {/* Username Availability Modal */}
                <Dialog 
                    open={isUsernameModalOpen}
                    onClose={() => setIsUsernameModalOpen(false)}
                >
                    <DialogTitle>Username Unavailable</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The username "{signupData.username}" is already taken. 
                            If this is your username, please sign in. Otherwise, 
                            choose a different username.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsUsernameModalOpen(false)}>
                            Choose Another Username
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsUsernameModalOpen(false);
                                setIsSigningUp(false);
                            }}
                            color="primary"
                        >
                            Go to Sign In
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Error message */}
                {error && <Typography color="error">{error}</Typography>}

                {/* Conditional Rendering: Sign In vs Sign Up */}
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
                    </form>
                ) : (
                    <form onSubmit={handleSignUp}>
                        {/* Username Field (Unique and Cannot Change) */}
                        <InputField
                            name="username"
                            label="Username (Cannot be changed later)"
                            placeholder="Choose your unique username"
                            value={signupData.username}
                            onChange={handleSignupInputChange}
                            error={!!usernameError}
                            helperText={usernameError}
                            required
                        />

                        <InputField
                            name="email"
                            label="Email"
                            placeholder="email"
                            type="email"
                            value={signupData.email}
                            onChange={handleSignupInputChange}
                            required
                        />

                        <InputField
                            name="password"
                            label="Password"
                            placeholder="password"
                            type="password"
                            value={signupData.password}
                            onChange={handleSignupInputChange}
                            required
                        />

                        {/* Profile Picture Upload */}
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-picture-upload"
                            type="file"
                            name="profilePicture"
                            onChange={handleSignupInputChange}
                        />
                        <label htmlFor="profile-picture-upload">
                            <Button 
                                variant="contained" 
                                component="span"
                                color="primary"
                            >
                                Upload Profile Picture
                            </Button>
                        </label>
                        {profilePreview && (
                            <Avatar 
                                src={profilePreview} 
                                alt="Profile Preview" 
                                sx={{ width: 100, height: 100, margin: 'auto' }} 
                            />
                        )}

                        {/* User Bio */}
                        <InputField
                            name="user_bio"
                            label="Bio"
                            multiline
                            rows={4}
                            placeholder="Tell us about yourself (optional)"
                            value={signupData.user_bio}
                            onChange={handleSignupInputChange}
                        />

                        <SignInButton type="submit">
                            Create Account
                        </SignInButton>
                    </form>
                )}

                <Button onClick={toggleSignUp}>
                    {!isSigningUp 
                        ? "Don't have an account? Sign Up" 
                        : "Already have an account? Sign In"}
                </Button>

                <SignInButton onClick={signInWithGoogle}>
                    Sign In with Google
                </SignInButton>
            </FormContainer>
        </LoginBackground>
    );
};

export default LoginPage;