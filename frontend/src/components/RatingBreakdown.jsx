import React, { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Rating,
  Modal,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReviewsSegmentation from './ReviewsSegmentation';

const RatingBreakdown = ({ reviews, listingId }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, { rating }) => acc + rating, 0) / totalReviews;
  const [reviewRating, setReviewRating] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const reviewCounts = Array.from({ length: 5 }, (_, i) =>
    reviews.filter((r) => r.rating === 5 - i).length
  );

  const reviewPercentages = reviewCounts.map((count) =>
    totalReviews > 0 ? Number(((count / totalReviews) * 100).toFixed(0)) : 0
  );

  const handleRatingBarClick = (rating, event) => {
    // Prevent the click from reaching the card
    event.stopPropagation();

    // Pop up the reviews with the selected rating
    setReviewRating(rating);
    setModalOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating value={averageRating} precision={0.1} readOnly />
        <Typography sx={{ ml: 1 }}>{`${averageRating.toFixed(1)} out of 5`}</Typography>
      </Box>
      <Typography variant="body2">{`${totalReviews} global ratings`}</Typography>
      {reviewCounts.map((count, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', mt: 1, cursor: 'pointer' }}
          onClick={(event) => handleRatingBarClick(5 - index, event)}
        >
          <Typography variant="body2" sx={{ width: '50px' }}>{`${5 - index} star`}</Typography>
          <Box sx={{ flexGrow: 1, mx: 1 }}>
            <LinearProgress
              variant="determinate"
              value={reviewPercentages[index]}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Typography variant="body2">{`${reviewPercentages[index]}%`.padEnd(4)} {`${count} reviews`}</Typography>
        </Box>
      ))}
      {/* Show the reviews with the selected rating */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} sx={{ zIndex: 9999 }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          // position: 'relative',
        }}>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>

          <ReviewsSegmentation
            reviews={reviews}
            listingId={listingId}
            reviewRating={reviewRating}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default RatingBreakdown;
