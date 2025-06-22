import React from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ReviewCard = (props) => {
  return (
    <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2, mb: 2, boxShadow: 3 }}>
      <Rating name="read-only" value={props.rating} readOnly sx={{ mb: 1 }}/>
      <Typography variant="body1" color="text.secondary" ml={1} gutterBottom>
        {props.review}
      </Typography>
    </Box>
  );
}

export default ReviewCard;
