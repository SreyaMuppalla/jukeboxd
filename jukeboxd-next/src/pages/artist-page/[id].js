// header
// artist pic 
// artist name
// stars
// top rate songs
// write a review


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
import { SpotifyAPIController } from '../../utils/SpotifyAPIController'; // Import your API controller
import { useRouter } from 'next/router'; // Import Next.js useRouter

const ArtistPage = () => {
  const topSongs = [
    { albumCover: albumpic, songName: "Song 1", albumName: "Album 1", year: "2020", stars: 5 },
    { albumCover: albumpic, songName: "Song 2", albumName: "Album 2", year: "2019", stars: 4 },
    { albumCover: albumpic, songName: "Song 3", albumName: "Album 3", year: "2021", stars: 4.5 },
    { albumCover: albumpic, songName: "Song 4", albumName: "Album 4", year: "2018", stars: 5 },
    { albumCover: albumpic, songName: "Song 5", albumName: "Album 5", year: "2022", stars: 3.5 },
  ];

  const router = useRouter();
  const { id: artistId } = router.query; // Correctly get the albumId from the dynamic route

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [artistDetails, setArtistDetails] = useState(null);

  // Fetch token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await SpotifyAPIController.getToken();
        setToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch token.');
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (artistId && token) { // Ensure albumId and token are present before making API calls
      const fetchSongData = async () => {
        try {
          setLoading(true); // Start loading
          setError(null); // Reset any previous errors

          // Fetch album details and tracks
          const details = await SpotifyAPIController.getArtistsDetails(token, artistId);
          console.log(details)

          // Update state with the fetched data
          setArtistDetails(details);

        } catch (error) {
          console.error('Error fetching album data:', error);
          setError('Failed to fetch album details.');
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchSongData();
    }
  }, [artistId, token]); // Trigger useEffect whenever albumId or token changes

  if (loading) {
    return <Typography variant="h5" style={{ color: '#fff' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display error if any
  }

  if (!artistDetails) {
    return <Typography variant="h5" style={{ color: '#fff' }}>No album details available.</Typography>; // Fallback if no album data is found
  }


  return (
    <Background>
      <ProfileContainer>
        {/* Profile Info Section */}
        <ProfileInfo>
          <ProfilePicContainer>
          <img
            src={artistDetails.images?.[0] ? artistDetails.images[0].url : '../../images/default-image.jpg'} // Fallback to a default image if images[0] does not exist
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