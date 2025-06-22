import React, { useEffect, useState } from 'react';
import fetchAllListings from '../helpers/FetchAllListings';
import ReviewCard from './ReviewCard';
import { Typography, Box } from '@mui/material';
import CenterCircularProgress from './CenterCircularProgress';

const ReviewsSegmentation = ({ listingId, reviewRating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all listings from backend
  useEffect(async () => {
    setLoading(true);
    const listings = await fetchAllListings();
    const listingsReviews = listings.listings.filter((listing) => listing.id === parseInt(listingId));
    const reviewsInRating = listingsReviews[0].reviews.filter((review) => parseInt(review.rating) === parseInt(reviewRating));
    setReviews(reviewsInRating);
    setLoading(false);
  }, []);

  if (loading) {
    return <CenterCircularProgress />;
  }

  return (
    <Box>
      <Typography
        variant='h4'
        gutterBottom
        sx={{
          paddingTop: '24px',
          paddingBottom: '12px',
          fontWeight: 'bold',
        }}
      >
        Reviews with {reviewRating} stars
      </Typography>
      {reviews.map((review, index) => (
        <ReviewCard key={index} rating={review.rating} review={review.review} />
      ))}
    </Box>
  );
}

export default ReviewsSegmentation;
