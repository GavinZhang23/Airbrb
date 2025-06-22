import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Divider,
  CardContent,
  Button,
  TextField,
  Rating,
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import fetchListingInfo from '../helpers/FetchListingInfo';
import fetchAllBookings from '../helpers/FetchAllBookings';
import CenterCircularProgress from '../components/CenterCircularProgress';
import capitalizeFirstLetter from '../helpers/CapitalizeFirstLetter';
import BedroomCard from '../components/BedRoomCard';
import amenitiesOptions from '../helpers/AmenitiesOptions';
import BookingCard from '../components/BookingCard';
import deleteBooking from '../helpers/DeleteBooking';
import getReviewAverage from '../helpers/GetReviewAverage';
import reviewLeftWing from '../assets/reviewLeftWing.jpg';
import reviewRightWing from '../assets/reviewRightWing.jpg';
import ReviewCard from '../components/ReviewCard';
import ImageCarousel from '../components/ImageCarousel';

const ListingDetail = (props) => {
  const { id: listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { startDate, endDate } = location.state || { startDate: '', endDate: '' };
  const [acceptedBookingId, setAcceptedBookingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!props.token) {
        return;
      }
      setLoading(true);
      try {
        const data = await fetchListingInfo(props.token, listingId);
        data.listing.listingId = listingId;
        data.listing.reviewsAverage = getReviewAverage(data.listing.reviews);
        setListing(data.listing);
        // Fetch all the bookings
        const allBookings = await fetchAllBookings(props.token);
        // Find the booking that user has made for this listing
        const userBookings = allBookings.bookings.filter(booking => booking.owner === props.user && booking.listingId === listingId);
        // Find the booking that are accepted
        const acceptedBooking = userBookings.find(booking => booking.status === 'accepted');
        if (acceptedBooking) {
          setAcceptedBookingId(acceptedBooking.id);
        }
        setBookingStatus(userBookings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.token, listingId, props.user]);

  if (loading) {
    return <CenterCircularProgress />;
  }

  if (!listing) {
    return <Typography>No listing details available.</Typography>;
  }

  const findAmenityLabel = (amenityKey) => {
    const amenity = amenitiesOptions.find((option) => option.key === amenityKey);
    return amenity ? amenity.label : 'Label not found';
  };

  const handleDeleteBooking = async (booking) => {
    console.log('Delete booking:', booking);
    const response = await deleteBooking(booking, props.token)
    if (response) {
      const updatedBookingStatus = bookingStatus.filter((bookingStatus) => bookingStatus.id !== booking.id)
      setBookingStatus(updatedBookingStatus);
      if (acceptedBookingId === booking.id) {
        // Find the booking that are accepted
        const acceptedBooking = updatedBookingStatus.find(booking => booking.status === 'accepted');
        if (acceptedBooking) {
          // If there is an accepted booking, set the acceptedBookingId to the new accepted booking
          setAcceptedBookingId(acceptedBooking.id)
          console.log('New accepted booking:', acceptedBooking);
        } else {
          // If there is no accepted booking, set the acceptedBookingId to null
          setAcceptedBookingId(null);
        }
      }
    }
  }

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleSubmitReview = () => {
    setReview('');
    setRating(0);
    setShowReviewForm(false);
    const publishReview = async () => {
      try {
        const reviewContent = {
          rating,
          review,
        }
        const response = await fetch(`http://localhost:5005/listings/${listingId}/review/${acceptedBookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify({
            review: reviewContent,
          }),
        });
        if (response.error) {
          alert(response.error);
        } else if (!response.ok) {
          alert('Failed to publish review');
          console.log(response);
          return;
        }
        setListing({
          ...listing,
          reviews: [...listing.reviews, reviewContent],
          reviewsAverage: getReviewAverage([...listing.reviews, reviewContent]),
        });
      } catch (err) {
        console.log(err);
      }
    }
    publishReview();
  };
  const images = [listing.thumbnail, ...listing.metadata.photos];

  return (
    <Container maxWidth="md" sx={{
      mt: 2,
    }}>
    {/* Image display with carousel */}
    <ImageCarousel images={images}/>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Listing Details */}
          <Box mt={2}>
            {/* Listing Details */}
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: '600' }} gutterBottom>{listing.title}</Typography>
            <Typography variant="h6" gutterBottom>{listing.address}</Typography>
            <Divider sx={{ mt: 2, mb: 2, }}/>
            <Typography variant='h5' mt={2}>{capitalizeFirstLetter(listing.metadata.propertyType)}</Typography>
            <Typography variant='h6' mt={2} mb={1}>{listing.metadata.bedrooms.length} Bedroom{listing.metadata.bedrooms.length > 1 ? 's' : ''} & {listing.metadata.bathrooms} Bathroom{listing.metadata.bathrooms > 1 ? 's' : ''}</Typography>
            <Grid container spacing={2}>
            {listing.metadata.bedrooms.map((bedroom, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <BedroomCard bedroom={bedroom} />
              </Grid>
            ))}
            </Grid>
            <Typography variant='subtitle1' mt={2} mb={1}></Typography>
            <Divider sx={{ mt: 2, mb: 2, }}/>
            {/* Amenities */}
            <Typography variant='h5' mt={2}>Amenities</Typography>
            <Grid container spacing={2}>
            {listing.metadata.amenities.length === 0
              ? <Grid item xs={12} sm={12} >
               <Typography variant='subtitle1'>No amenities available.</Typography>
              </Grid>
              : (listing.metadata.amenities.map((amenity, index) => (
              <Grid item xs={12} sm={3} key={index}>
                <Typography variant='subtitle1' mt={1} mb={1} key={index}>{findAmenityLabel(amenity)}</Typography>
              </Grid>
                )))
            }
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }}/>
            {/* Booking States */}
            <Typography variant='h5' mt={2} mb={1}>Booking Status</Typography>
            {bookingStatus.length > 0
              ? (bookingStatus.map((booking, index) => (
                // booking.status === 'accepted' :
                <Card key={index} sx={{ maxWidth: 'fit-content', padding: '4px 10px', mb: 1 }}>
                  <CardContent sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    padding: '0px 0px',
                    m: 0,
                    '&:last-child': { paddingBottom: 0 }
                  }}>
                    <Typography variant='caption' mt={1} mb={1} >
                      You booked from {booking.dateRange.start} to {booking.dateRange.end}. Status: {booking.status}<br />
                    </Typography>
                    <Button
                      size="small"
                      variant='outlined'
                      color='primary'
                      ms={2}
                      sx={{ fontSize: '0.6rem', marginLeft: 2 }}
                      onClick={() => handleDeleteBooking(booking)}>Delete</Button>
                  </CardContent>
                </Card>
                )))
              : <Typography variant='subtitle1' mt={2} mb={1}>Not booked</Typography>}
          </Box>
        </Grid>
        {/* Card Area */}
        <Grid item xs={12} md={4}>
          {/* Price and Booking Status */}
          <BookingCard
            startDate={startDate}
            endDate={endDate}
            listing={listing}
            token={props.token}
            listingId={listingId}
            user={props.user}
            setBookingStatus={setBookingStatus}/>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }}/>
      {/* Reviews and Rating */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <img src={reviewLeftWing} alt='reviewPatternLeft' style={{
          width: '50px',
          height: 'auto',
          paddingTop: '14px',
        }} />
        <Typography variant='h3' mt={2} fontWeight={600} ml={2} mr={2}>{listing.reviewsAverage === 0
          ? '-/5'
          : listing.reviewsAverage}</Typography>
        <img src={reviewRightWing} alt='reviewPatternRight' style={{
          width: '50px',
          height: 'auto',
          paddingTop: '14px',
        }} />
      </Box>
      <Typography variant='h5' mt={2} mb={2}>Reviews({listing.reviews.length})</Typography>
      {listing.reviews.length === 0
        ? <Typography variant='subtitle1' mt={2} mb={1}>No reviews available.</Typography>
        : (listing.reviews.map((review, index) => (
            <ReviewCard key={index} review={review.review} rating={review.rating}/>
          )))
      }

      {acceptedBookingId !== null
        ? <Button variant='contained' sx={{ mt: 2, mb: 1 }} onClick={() => {
          setShowReviewForm(!showReviewForm)
        }}>
        {!showReviewForm
          ? <>Add Review</>
          : <>Cancel</>}
        </Button>
        : <></>
      }

      {showReviewForm && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={handleRatingChange}
            sx={{ mt: 1 }}
            size="large"
          />
          <TextField
            label="Review"
            placeholder="Your feeling is important for us"
            multiline
            rows={4}
            value={review}
            onChange={handleReviewChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant='outlined' sx={{ mt: 2, fontSize: '1.0rem' }} onClick={handleSubmitReview}>Submit Review</Button>
        </Box>
      )}
    </Container>
  );
};

export default ListingDetail;
