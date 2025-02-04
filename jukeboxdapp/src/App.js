import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import PersonalProfilePage from "./pages/PersonalProfilePage";
import ProfilePage from "./pages/ProfilePage";
import SongPage from "./pages/SongPage";
import AlbumPage from "./pages/AlbumPage";
import ArtistPage from "./pages/ArtistPage";

const App = () => {
  return (
    <div>
      <AlbumPage />
    </div>
  );
};

export default App;