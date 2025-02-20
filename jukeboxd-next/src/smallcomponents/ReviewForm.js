import { useState } from 'react';
import {
  Button,
  Drawer,
  TextField,
  Typography,
  Box,
  Fab,
  IconButton,
  Rating,
} from '@mui/material';
import SearchBar from './SearchBar';

export default function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    console.log("User's review:", review);
    setReview(''); // Clear review after submitting
    toggleDrawer(false); // Close the drawer
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
            width: '400px',
            padding: '20px',
            boxSizing: 'border-box',
            height: '600px',
            bottom: '15vh', // Set bottom position
            right: '50px',
            top: 'unset', // Unset top to allow bottom to work
            borderRadius: '20px',
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" gutterBottom>
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
          <Rating size="large" sx={{ alignSelf: 'flex-start' }} />
        </Box>

        <Box>
          <TextField
            label="Your review"
            multiline
            rows={12}
            fullWidth
            value={review}
            onChange={handleReviewChange}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              + Post
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
