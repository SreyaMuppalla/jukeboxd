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
  ReviewSubContainer,
} from '../styles/StyledComponents';
import albumpic from '../images/albumpic.jpg'; // Import the album image
import pfp from '../images/pfp.jpg'; // Add a placeholder profile pic
import Link from 'next/link';
import Image from 'next/image';

//AlbumCover, song_id and ArtistName need to be updated to render correctly.
// Currently default and null.
const Review = ({ review }) => {
  const album_ref = '/album-page/' + review.album_id;
  const song_ref = '/song-page/' + review.song_id;
  const artist_ref = '/artist-page/' + review.artists[0].id;
  const profile_ref = '/profile-page/' + review.user_id;
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
        <Link href={album_ref}>
          <Image
            src={review.images[0].url || albumpic}
            alt="Album Cover"
            width={100}
            height={100}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              '&:hover': { textDecoration: 'underline' },
            }}
          />
        </Link>
      </AlbumCover>

      {/* Song and Artist Info */}
      <SongInfo>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: '#fff',
            cursor: 'pointer',
            width: '100%',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            textOverflow: 'ellipsis',
            maxHeight: '4.5em',
            lineHeight: '1.5em',
            '& a': { textDecoration: 'none', color: 'inherit' }, // Ensures no default underline
            '& a:hover': { textDecoration: 'underline' }, // Underline on hover
          }}
        >
          <Link href={review.type === 'song' ? song_ref : album_ref}>
            {review.type === 'song'
              ? review.song_name
              : review.album_name || 'Song/Album Name'}
          </Link>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: '#d3d3d3',
            cursor: 'pointer',
            '& a': { textDecoration: 'none', color: 'inherit' },
            '& a:hover': { textDecoration: 'underline' },
          }}
        >
          <Link href={artist_ref}>
            {review.artists[0].name || 'Artist Name'}
          </Link>
        </Typography>
      </SongInfo>

      <ReviewSubContainer>
        {/* User Info */}
        <UserInfo>
          <ProfilePic
            style={{ cursor: 'pointer' }} // Pointer cursor
          >
            <Link href={profile_ref}>
              <Image
                src={review.user_pfp || pfp}
                alt="User Profile"
                width={50}
                height={50}
                style={{ width: '100%', height: '100%', borderRadius: '50%', minWidth: 25, minHeight: 25 }}
              />
            </Link>
          </ProfilePic>
          <Typography
            variant="subtitle1"
            style={{
              color: '#fff',
              marginLeft: '8px',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }} // Pointer cursor
          >
            <Link href={profile_ref}>{review.username || 'Username'}</Link>
          </Typography>
          <RatingContainer>
            <Rating name="read-only" value={review.rating} readOnly />
          </RatingContainer>
          <Typography
            variant="subtitle2"
            style={{ color: '#fff', cursor: 'pointer' }}
          >
            {review.created_at?.seconds
              ? new Date(review.created_at.seconds * 1000).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )
              : 'Unknown Date'}
          </Typography>
        </UserInfo>

        {/* Review Text */}
        <ReviewText>{review.review_text || 'Review Text'}</ReviewText>
        {/* Likes & Dislikes */}
        <Box display="flex" alignItems="center" justifyContent="end" mt={1}>
          <IconButton onClick={handleLike} sx={{ color: '#1DB954' }}>
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="body2" color="white" mx={1}>
            {likes}
          </Typography>
          <IconButton onClick={handleDislike} sx={{ color: '#D9534F' }}>
            <ThumbDownIcon />
          </IconButton>
          <Typography variant="body2" color="white" mx={1}>
            {dislikes}
          </Typography>
        </Box>
      </ReviewSubContainer>
    </ReviewContainer>
  );
};

export default Review;
