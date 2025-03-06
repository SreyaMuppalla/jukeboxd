// album cover
// text box for song name
// text box for artist name
// username and pfp
// stars
// date reviewed
// review
// upvotes/downvotes
// extension to comments
import React, { useState } from 'react';
import { Box, Typography, Rating, IconButton } from '@mui/material'; // Material UI components
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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

//AlbumCover, song_id and ArtistName need to be updated to render correctly. 
// Currently default and null. 
const Review = ({albumCover, song_id, ArtistName, userProfilePic, userName, rating, review_text}) => {
  console.log(userName, rating, review_text)
  //TODO: pull in backend for initial setting of likes and dislikes (replace useState(0))
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
      setLiked(true);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
      setDisliked(true);
    }
  };

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
              width={150}
              height={150}
              style={{ borderRadius: '50%' }}
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
      {/* Likes & Dislikes */}
      <Box display="flex" alignItems="center" mt={1}>
        <IconButton onClick={handleLike} sx = {{color: "#1DB954"}}>
          <ThumbUpIcon />
        </IconButton>
        <Typography variant="body2" color="white" mx={1}>{likes}</Typography>
        <IconButton onClick={handleDislike} sx = {{color: "#D9534F"}}>
          <ThumbDownIcon />
        </IconButton>
        <Typography variant="body2" color="white" mx={1}>{dislikes}</Typography>
      </Box>

    </ReviewContainer>

    
  );
};

export default Review;
