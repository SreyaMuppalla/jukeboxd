import { useState } from 'react';
import {
  Button,
  Drawer,
  TextField,
  Typography,
  Box,
  Fab,
  Rating,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { currSong } from '@/states/currSong';
import { addReview } from '@/backend/firebase_api';

export default function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedSong, setSelectedSong] = useAtom(currSong);
  console.log(selectedSong);

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    let reviewObj = {
      review_id: 'review3',
      user_id: 'test',
      song_id: selectedSong.name,
      rating: rating,
      review_text: review,
      likes: 0,
      dislikes: 0,
      created_at: new Date(),
    };

    addReview(reviewObj).then(() => {
      setReview(''); // Clear review after submitting
      setRating(5); // Reset rating after submission
      setLoading(false);
      setOpen(false);
      setSuccessMessage(true); // Show success message
      setSelectedSong(null); // Invalidate selected song after submission
    });
  };

  const handleRemoveSong = () => {
    setSelectedSong(null);
  };

  const isFormValid = selectedSong && review.trim() !== '' && rating !== null;

  return (
    <div>
      {/* Floating Action Button */}
      <Fab
        onClick={() => toggleDrawer(!open)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        +
      </Fab>

      {/* Drawer for Review */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        onClose={() => toggleDrawer(false)}
        sx={{
          width: '600px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '500px',
            padding: '20px',
            boxSizing: 'border-box',
            height: '650px',
            bottom: '10vh',
            right: '20px',
            top: 'unset',
            borderRadius: '20px',
            backgroundColor: '#535353',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        }}
      >
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: 'white', position: 'sticky' }}
          >
            Write a Review
          </Typography>
        </Box>

        <SearchBar />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap={2}
          className="mx-5"
        >
          {/* Selected Song */}
          {selectedSong && (
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                backgroundColor: '#444',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <Image
                src={selectedSong.image}
                alt={selectedSong.name}
                width={50}
                height={50}
              />
              <Typography sx={{ color: 'white', flexGrow: 1, padding: 0 }}>
                {selectedSong.name}
              </Typography>
              <IconButton onClick={handleRemoveSong} sx={{ color: 'white' }}>
                x
              </IconButton>
            </Box>
          )}
          {/* Rating */}
          <Rating
            size="large"
            value={rating}
            onChange={handleRatingChange}
            sx={{
              alignSelf: 'flex-start',
              fontSize: '3rem',
              '& .MuiRating-iconEmpty': {
                color: 'white',
              },
              '& .MuiRating-iconFilled': {
                fontSize: 'inherit',
              },
            }}
            disabled={!selectedSong} // Disable if no song is selected
          />

          {/* Review TextField */}
          <TextField
            multiline
            rows={9}
            fullWidth
            value={review}
            variant="filled"
            onChange={handleReviewChange}
            sx={{
              marginBottom: 2,
              marginTop: 2,
              backgroundColor: '#b3b3b3',
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiFilledInput-root': {
                backgroundColor: '#b3b3b3',
                '&:hover': {
                  backgroundColor: '#a3a3a3',
                },
                '&.Mui-focused': {
                  backgroundColor: '#b3b3b3',
                },
              },
            }}
            disabled={!selectedSong} // Disable if no song is selected
          />
        </Box>
        {/* Post Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || loading} // Disable button based on form validity or loading state
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? 'Posting...' : '+ Post'}
          </Button>
        </Box>
      </Drawer>

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(false)}>
          Review posted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
