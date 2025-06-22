import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import RatingBreakdown from './RatingBreakdown';
import extractVideoIDFromURL from '../helpers/ExtractVideoIDFromURL';

const LandingListingCard = (props) => {
  const navigate = useNavigate();
  const { listing } = props;
  const isRatingAvailable = listing.reviews.length > 0;
  const isThumbnailUrl = typeof listing.thumbnail === 'string' && listing.thumbnail.startsWith('http');
  const youtubeUrl = isThumbnailUrl ? `https://img.youtube.com/vi/${extractVideoIDFromURL(listing.thumbnail)}/0.jpg` : '';
  const handleListingClick = (listingId, startDate, endDate) => {
    navigate(`/listing/${listingId}`, { state: { startDate, endDate } });
  };

  return (
    <Card name="card" sx={{ maxWidth: 345 }} onClick={() => handleListingClick(listing.id, props.startDate, props.endDate)}>
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ height: 140 }}
          image={isThumbnailUrl ? youtubeUrl : listing.thumbnail}
          title={`Thumbnail for listing ${listing.title}`}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography gutterBottom variant="h5" component="div">
              {listing.title}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
                <Tooltip
                  sx={{ zIndex: 1000 }}
                  title={
                  <div onClick={(e) => e.stopPropagation()}>
                    <RatingBreakdown
                    reviews={listing.reviews}
                    listingId={listing.id}/>
                  </div>
                  }
                  placement="bottom"
                  arrow
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon fontSize='1rem'/>
                    {isRatingAvailable
                      ? <Typography variant="body2" component="span">{listing.reviewsAverage}</Typography>
                      : <Typography variant="body2" color="text.secondary">New</Typography>
                    }
                  </Box>
                </Tooltip>
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            component="div"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {listing.address}
          </Typography>
          <Typography variant="body1" color="text.primary">
            🛏️ {listing.metadata.bedrooms.length} &nbsp; 🛁 {listing.metadata.bathrooms}
          </Typography>

          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {`$${listing.price} / Night`}
          </Typography>
          {isRatingAvailable && (
            <Typography variant="body2" color="text.secondary">
              {`${listing.reviews.length} review${listing.reviews.length === 1 ? '' : 's'}`}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LandingListingCard;
