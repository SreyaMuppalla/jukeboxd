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
import Image from "next/image";
import { fetchArtistData, fetchArtistTopSongs } from '../../utils/apiCalls'; // API calls
import { useRouter } from 'next/router';
import Link from "next/link"; // Import Link from Next.js
import ProtectedRoute from "@/smallcomponents/ProtectedRoute";
import UnknownArtwork from '@/images/unknown_artwork.jpg';

const ArtistPage = () => {
  const router = useRouter();
  const { id: artistId } = router.query; // Get artistId from the dynamic route

  const [artistDetails, setArtistDetails] = useState({
    name: "",
    images: [{ url: UnknownArtwork }],
  });
  const [topSongs, setTopSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (artistId) {
      const getArtistData = async () => {
        try {
          setError(null); // Reset any previous errors

          // Fetch artist details
          const details = await fetchArtistData(artistId);
          setArtistDetails(details);

          // Fetch top songs
          const songs = await fetchArtistTopSongs(artistId);
          setTopSongs(songs);
          console.log(songs)

        } catch (error) {
          console.error('Error fetching artist data or top songs:', error);
          setError('Failed to fetch artist details or top songs.');
        }
      };

      getArtistData();
    }
  }, [artistId]);

  if (error) {
    return <Typography variant="h5" style={{ color: '#ff4d4d' }}>{error}</Typography>; // Display any error
  }

  return (
    <ProtectedRoute>
      <Background>
        <ProfileContainer>
          {/* Profile Info Section */}
          <ProfileInfo>
            <ProfilePicContainer>
              <img
                src={artistDetails.images?.[0]?.url || '../../images/default-image.jpg'}
                alt="Artist"
                style={{ width: "150px", height: "150px", borderRadius: "50%", marginRight: "16px" }}
              />
            </ProfilePicContainer>
            <ProfileDetailsContainer>
              <ProfileDetails>
                <Typography variant="h4" style={{ color: "#fff", marginBottom: "8px" }}>
                  {artistDetails.name}
                </Typography>
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
            <Typography
              variant="h5"
              style={{
                color: "#fff",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Top Songs
            </Typography>

            {topSongs.map((song, index) => (
            <TopSongItem key={index}>
              {/* Album Cover */}
                  <Image
                    src={song.images[1]?.url || UnknownArtwork}
                    alt={`Album cover for ${song.name}`}
                    width={150} // Set the width (adjust size as necessary)
                    height={150} // Set the height (adjust size as necessary)
                    style={{ borderRadius: "8px", cursor: "pointer" }}
                    onClick={() => (window.location.href = `/album-page/${song.album.id}`)} // Navigate to AlbumPage with album id
                  />

                  {/* Song Details */}
                  <SongDetailsRow>
                    <SongDetailsText>
                      {/* Song Name with Link */}
                      <Link href={`/song-page/${song.id}`} passHref>
                        <Typography
                          className="song-name"
                          style={{
                            textDecoration: 'none',
                            color: '#fff', // Default color
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';
                            e.target.style.color = '#fff'; // Change color on hover
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';
                            e.target.style.color = '#ccc'; // Reset color
                          }}
                        >
                          {song.name}
                        </Typography>
                      </Link>

                      {/* Album Name with Link */}
                      <Link href={`/album-page/${song.album.id}`} passHref>
                        <Typography
                          className="album-name"
                          style={{
                            textDecoration: 'none',
                            color: '#ccc', // Default color
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';
                            e.target.style.color = '#fff'; // Change color on hover
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';
                            e.target.style.color = '#ccc'; // Reset color
                          }}
                        >
                          {song.album.name}
                        </Typography>
                      </Link>
                </SongDetailsText>
                  {/* Stars */}
                  <Rating
                    name="read-only"
                    value={song.stars}
                    precision={0.5}
                    readOnly
                  />
                </SongDetailsRow>
              </TopSongItem>
            ))}
          </Box>
        </ProfileContainer>
      </Background>
    </ProtectedRoute>
  );
};

export default ArtistPage;
