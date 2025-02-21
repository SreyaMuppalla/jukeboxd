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

export default function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedSong, setSelectedSong] = useState({});

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  }

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate an async submission
    setTimeout(() => {
      console.log("User's review:", review);
      setReview(''); // Clear review after submitting
      setRating(5);
      setLoading(false);
      setOpen(false);
      setSuccessMessage(true); // Show success message
    }, 2000);
  };

  const handleRemoveSong = () => {
    setSong(null);
  };

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
            overflowY: 'auto', // Enables scrolling
            scrollbarWidth: 'none', // Hides scrollbar in Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Hides scrollbar in Chrome/Safari
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

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap={2}
          className="mx-5"
        >
          <SearchBar />

          {/* Selected Song */}
          {selectedSong && (
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                backgroundColor: '#444',
                padding: '1px',
                borderRadius: '8px',
              }}
            >
              <Image
                href={selectedSong.image}
                alt={selectedSong.name}
                width={25}
                height={10}
              />
              <Typography sx={{ color: 'white', flexGrow: 1, padding: 0 }}>
                {selectedSong.name}
              </Typography>
              <IconButton onClick={handleRemoveSong} sx={{ color: 'white' }}>
                x
              </IconButton>
            </Box>
          )}

          <Rating
            size="large"
            defaultValue={rating}
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
          />
        </Box>

        <Box>
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
          />

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? 'Posting...' : '+ Post'}
            </Button>
          </Box>
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
