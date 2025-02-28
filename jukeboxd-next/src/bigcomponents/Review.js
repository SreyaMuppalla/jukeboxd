// album cover
// text box for song name
// text box for artist name
// username and pfp
// stars
// date reviewed
// review
// upvotes/downvotes
// extension to comments
import React from 'react';
import { Box, Typography, Rating } from '@mui/material'; // Material UI components
import {
  ReviewContainer,
  AlbumCover,
  SongInfo,
  UserInfo,
  ProfilePic,
  RatingContainer,
  ReviewText,
} from '../styles/StyledComponents';
import albumpic from '../images/albumpic.jpg'; // Import the album image
import pfp from '../images/pfp.jpg'; // Add a placeholder profile pic
import Link from 'next/link';
import Image from 'next/image';

const Review = ({albumCover, song_id, ArtistName, userProfilePic, userName, rating, review_text}) => {
  console.log(userName, rating, review_text)
  return (
    <ReviewContainer>
      {/* Album Cover */}
      <AlbumCover
        style={{ cursor: 'pointer' }} // Pointer cursor for clickable elements
      >
        <Link href="/album-page">
          <Image
            src={albumCover || albumpic}
            alt="Album Cover"
            style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          />
        </Link>
      </AlbumCover>

      {/* Song and Artist Info */}
      <SongInfo>
        <Typography
          variant="h6"
          style={{ color: '#fff', marginBottom: '4px', cursor: 'pointer' }} // Pointer cursor
        >
          <Link href="/song-page">{song_id || "Song Name"}</Link>
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: '#d3d3d3', cursor: 'pointer' }} // Pointer cursor
        >
          <Link href="artist-page">{ArtistName || "Artist Name"}</Link>
        </Typography>
      </SongInfo>

      {/* User Info */}
      <UserInfo>
        <ProfilePic
          style={{ cursor: 'pointer' }} // Pointer cursor
        >
          <Link href="/profile-page">
            <Image
              src={userProfilePic || pfp}
              alt="User Profile"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </Link>
        </ProfilePic>
        <Typography
          variant="subtitle2"
          style={{ color: '#fff', marginLeft: '8px', cursor: 'pointer' }} // Pointer cursor
        >
          <Link href="/profile-page">{userName || "Username"}</Link>
        </Typography>
        <RatingContainer>
          <Rating name="read-only" value={rating} readOnly />
        </RatingContainer>
      </UserInfo>

      {/* Review Text */}
      <ReviewText>
        {review_text || "Review Text"}
      </ReviewText>
    </ReviewContainer>
  );
};

export default Review;
