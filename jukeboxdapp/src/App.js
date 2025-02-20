import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import PersonalProfilePage from "./pages/PersonalProfilePage";
import ProfilePage from "./pages/ProfilePage";
import SongPage from "./pages/SongPage";
import AlbumPage from "./pages/AlbumPage";
import ArtistPage from "./pages/ArtistPage";
import Header from "./bigcomponents/Header";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./firebase/auth";

const AppContent = () => {
    const location = useLocation();

    return (
        <>
            {/* Conditionally render Header */}
            {location.pathname !== "/" && <Header />}

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/profile" element={<PersonalProfilePage />} />
                <Route path="/album-page" element={<AlbumPage />} />
                <Route path="/song-page" element={<SongPage />} />
                <Route path="/artist-page" element={<ArtistPage />} />
                <Route path="/profile-page" element={<ProfilePage />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
