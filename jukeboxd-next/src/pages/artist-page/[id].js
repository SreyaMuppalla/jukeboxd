import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating } from "@mui/material";
import {
  Background,
  ProfileContainer,
  ProfileInfo,
  ProfilePicContainer,
  ProfileDetailsContainer,
  ProfileDetails,
  TopSongItem,
  SongDetailsRow,
  SongDetailsText,
} from "../../styles/StyledComponents";
import albumpic from "../../images/albumpic.jpg"; // Import album image
import Image from "next/image";
import { useSpotify } from '../../context/SpotifyContext'; // Import the useSpotify hook
import { SpotifyAPIController } from '../../utils/SpotifyAPIController'; // Import your API controller
import { useRouter } from 'next/router';

const ArtistPage = () => {
  const topSongs = [
    { albumCover: albumpic, songName: "Song 1", albumName: "Album 1", year: "2020", stars: 5 },
    { albumCover: albumpic, songName: "Song 2", albumName: "Album 2", year: "2019", stars: 4 },
    { albumCover: albumpic, songName: "Song 3", albumName: "Album 3", year: "2021", stars: 4.5 },
    { albumCover: albumpic, songName: "Song 4", albumName: "Album 4", year: "2018", stars: 5 },
    { albumCover: albumpic, songName: "Song 5", albumName: "Album 5", year: "2022", stars: 3.5 },
  ];

  const router = useRouter();
  const { id: artistId } = router.query; // Get artistId from the dynamic route
  const { token, error: tokenError } = useSpotify(); // Use token from SpotifyContext
  const [loading, setLoading] = useState(true);
  const [artistDetails, setArtistDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (artistId && token) {
      const fetchArtistData = async () => {
        try {
          setLoading(true); // Start loading
          setError(null); // Reset any previous errors

          // Fetch artist details
          const details = await SpotifyAPIController.getArtistsDetails(token, artistId);
          setArtistDetails(details);
        } catch (error) {
          console.error('Error fetching artist data:', error);
          setError('Failed to fetch artist details.');
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchArtistData();
    }
  }, [artistId, token]);

  if (loading) {
    return <Typography variant="h5" style={{ color: '#fff' }}>Loading...</Typography>;
  }

  if (tokenError || error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{tokenError || error}</Typography>; // Display any error
  }

  if (!artistDetails) {
    return <Typography variant="h5" style={{ color: '#fff' }}>No artist details available.</Typography>; // Fallback if no artist data is found
  }

  return (
    <Background>
      <ProfileContainer>
        {/* Profile Info Section */}
        <ProfileInfo>
          <ProfilePicContainer>
            <img
              src={artistDetails.images?.[0] ? artistDetails.images[0].url : '../../images/default-image.jpg'}
              alt="Artist"
              style={{ width: "150px", height: "150px", borderRadius: "50%", marginRight: "16px" }}
            />
          </ProfilePicContainer>
          <ProfileDetailsContainer>
            <ProfileDetails>
              <Typography variant="h4" style={{ color: "#fff", marginBottom: "8px" }}>
                {artistDetails.name}
              </Typography>
              <Rating name="read-only" value={5} readOnly />
            </ProfileDetails>
          </ProfileDetailsContainer>
        </ProfileInfo>

        {/* Top Rated Songs Section */}
        <Box
          style={{
            marginTop: "32px",
            padding: "16px",
            backgroundColor: "#333",
            borderRadius: "16px",
            width: "90%",
            margin: "32px auto",
          }}
        >
          <Typography variant="h5" style={{ color: "#fff", marginBottom: "16px", textAlign: "center" }}>
            Top Rated Songs
          </Typography>

          {topSongs.map((song, index) => (
            <TopSongItem key={index}>
              {/* Album Cover */}
              <Image
                src={song.albumCover}
                alt={`Album cover for ${song.songName}`}
                onClick={() => (window.location.href = "/album-page")} // Navigate to AlbumPage
              />

              {/* Song Details */}
              <SongDetailsRow>
                <SongDetailsText>
                  <Typography
                    className="song-name"
                    onClick={() => (window.location.href = "/song-page")} // Navigate to SongPage
                  >
                    {song.songName}
                  </Typography>
                  <Typography
                    className="album-name"
                    onClick={() => (window.location.href = "/album-page")} // Navigate to AlbumPage
                  >
                    {song.albumName}
                  </Typography>
                  <Typography className="year">{song.year}</Typography>
                </SongDetailsText>

                {/* Stars */}
                <Rating name="read-only" value={song.stars} precision={0.5} readOnly />
              </SongDetailsRow>
            </TopSongItem>
          ))}
        </Box>
      </ProfileContainer>
    </Background>
  );
};

export default ArtistPage;
