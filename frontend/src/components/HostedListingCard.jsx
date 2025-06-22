import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
  Typography,
  Box,
} from '@mui/material';

import fetchListingInfo from '../helpers/FetchListingInfo';
import capitalizeFirstLetter from '../helpers/CapitalizeFirstLetter';
import AvailabilityModal from './AvailabilityModal';
import CenterCircularProgress from './CenterCircularProgress';
import extractVideoIDFromURL from '../helpers/ExtractVideoIDFromURL';
// This component is used to display the single listing that the user is hosting
// It takes the token, listing, onDelete as props
const HostedListingCard = (props) => {
  // The listing state is used to store the listing data fetched from the backend
  // We are using the useState hook because the listing data is fetched asynchronously
  // and we want to update the component when the data is fetched
  const [listing, setListing] = useState({});
  // The loading state is used to display a loading spinner while the listing data is being fetched
  // When the 'loading' changed from true to false, the component will be re-rendered
  // For example, when data is fetching, the loading state is true, and the component goes into the if (loading) block
  // When the data is fetched, the loading state is set to false, the component is re-rendered,
  // and the component will return the card we want
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Determine whether modal is open or not
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isThumbnailUrl = typeof listing.thumbnail === 'string' && listing.thumbnail.startsWith('http');
  const youtubeUrl = isThumbnailUrl ? `https://img.youtube.com/vi/${extractVideoIDFromURL(listing.thumbnail)}/0.jpg` : '';
  // Fetch the listing data from the backend
  // The reason it's wrapped in a useEffect is that we want to fetch the listing data
  // when the component is initially rendered, the props.token and props.listing.id is changed
  useEffect(async () => {
    setLoading(true);
    try {
      const data = await fetchListingInfo(props.token, props.listing.id);
      setListing(data.listing);
    } catch (error) {
      console.error('Failed to fetch listing', error);
    } finally {
      setLoading(false);
    }
  }, [props.token, props.listing.id]);

  // The handler for the edit button
  const onEdit = () => {
    // navigate to the edit listing page
    navigate(`/hosted-listing/edit-listing/${props.listing.id}`);
  }

  // The handler for the delete button
  const onDelete = async () => {
    // Send a DELETE request to the backend to delete the listing
    const response = await fetch(`http://localhost:5005/listings/${props.listing.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    // If the response has an error, we alert the error
    // Otherwise, we call the onDelete function passed from the parent component
    // Similar case, when we update the state of the parent component, the component will be re-rendered
    // (so the whole hosted listing page will be re-rendered, and then you will find the listing is gone)
    // The onDelete function is passed from the parent component, and it is used to update the state of the parent component
    if (response.error) {
      alert(response.error);
    } else {
      props.onDelete(props.listing.id);
    }
  }

  // The handler for the publish button
  const onPublish = async (availability) => {
    const availabilityObject = { availability };
    // Send a PUT request to the backend to publish the listing
    const response = await fetch(`http://localhost:5005/listings/publish/${props.listing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(availabilityObject),
    });
    // If the response has an error, we alert the error
    // Also check whether the response is okay
    // If it is not okay, we do not publish the listing and alert the user
    if (response.error) {
      alert(response.error);
    } else if (!response.ok) {
      alert('Failed to publish listing. The listing might have been published already.');
    } else if (response.ok) {
      setListing({ ...listing, published: true });
      console.log('published successfully');
    }
  };

  const unpublish = async () => {
    // Send a PUT request to the backend to unpublish the listing
    const response = await fetch(`http://localhost:5005/listings/unpublish/${props.listing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    if (response.error) {
      alert(response.error);
    } else if (!response.ok) {
      alert('Unpublish listing failed.');
    } else if (response.ok) {
      setListing({ ...listing, published: false });
      console.log('unpublished successfully');
    }
  }

  // Handle publish listing after setting up dateRanges
  const handleModalPublish = (dateRanges) => {
    // Close the modal and publish the listing
    setIsModalOpen(false);
    onPublish(dateRanges);
  };

  // If the listing detailed info is still fetching, we return a loading spinner
  if (loading) {
    return (
      <CenterCircularProgress />
    );
  }

  // If the listing detailed info is fetched, we return the listing card
  return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={() => props.onClick(props.listing.id)}>
          {/* Card Image */}
          <CardMedia
            sx={{ height: 140 }}
            image={isThumbnailUrl ? youtubeUrl : listing.thumbnail}
            title={`Thumbnail for listing ${listing.title}`}
          />
          <CardContent>
          {/* Listing title */}
          <Typography gutterBottom variant="h5" component="div">
            {listing.title}
          </Typography>
          {/* Property Type */}
          <Typography variant="body1" color="text.primary" >
            {capitalizeFirstLetter(listing.metadata.propertyType)}
          </Typography>
          <Typography variant="body1" color="text.primary">
          🛏️{listing.metadata.bedrooms.length} &nbsp; 🛁{listing.metadata.bathrooms}
          </Typography>
          {/* Listing price */}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {`$${listing.price} / night`}
          </Typography>
          {/* Listing rate/review */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <Typography variant="body2" color="text.primary">
            {`Rating: ${
              listing.reviews.length === 0
                ? '-/5'
                : `${(listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length).toFixed(1)}/5`
            } (${listing.reviews.length} review${listing.reviews.length === 1 ? '' : 's'})`}
            </Typography>
          </Box>
          </CardContent>

        </CardActionArea>
        {/* Edit/Delete/Publish Listing btn */}
        <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant='outlined' name="editListing" color='primary' onClick={() => onEdit()}>Edit</Button>
          <Button variant='outlined' color='primary' onClick={() => onDelete()}>Delete</Button>
          <Button variant='outlined' name="publishing" color='primary' onClick={() => listing.published ? unpublish() : setIsModalOpen(true)}>
            {listing.published ? 'Unpublish' : 'Publish'}
          </Button>
          {/* Modal of Publishing Listing */}
          <AvailabilityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPublish={handleModalPublish}
          />
        </CardActions>
      </Card>
  );
};

export default HostedListingCard;
