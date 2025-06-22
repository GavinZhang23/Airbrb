import React, { useState, useEffect } from 'react';
import {
  Grid,
  Divider,
  Typography,
  Container,
} from '@mui/material';
import LandingListingCard from '../components/LandingListingCard';
import fetchAllListingDetails from '../helpers/FetchAllListingDetails';
import fetchAllBookings from '../helpers/FetchAllBookings';
import LandingFilter from '../components/LandingFilter';
import CenterCircularProgress from '../components/CenterCircularProgress';
const Landing = (props) => {
  // State for storing listings
  const [listings, setListings] = useState([]);

  // Filtered listings
  const [filteredListings, setFilteredListings] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // State for storing booking status
  const [bookingStatus, setBookingStatus] = useState([]);

  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    minBedrooms: '',
    maxBedrooms: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: Infinity,
    sliderMax: 1000,
    sortByRating: 'none',
  });

  // Fetch all bookings on component mount
  useEffect(() => {
    if (props.token) {
      const fetchBookings = async () => {
        try {
          const data = await fetchAllBookings(props.token);
          setBookingStatus(data.bookings);
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
      };
      fetchBookings();
    }
  }, [props.token]);

  // Determine the booking status for a specific listing
  const getBookingStatusForListing = (listing) => {
    const userBooking = bookingStatus.find(booking => booking.owner === props.user && booking.listingId === listing.id);
    return userBooking ? userBooking.status : 'none';
  };

  // Function to fetch and sort listings
  const fetchAndSortListings = async () => {
    setLoading(true);
    try {
      let data = await fetchAllListingDetails();
      // Filter out listing that is only published
      data = data.filter(listing => listing.published);
      // Sort listings based on booking status and title
      const orderedListings = data.sort((a, b) => {
        const statusA = getBookingStatusForListing(a);
        const statusB = getBookingStatusForListing(b);

        // Compare based on booking status
        const statusOrder = { accepted: 1, pending: 2, none: 3 };
        if (statusOrder[statusA] !== statusOrder[statusB]) {
          return statusOrder[statusA] - statusOrder[statusB];
        }
        // If statuses are the same, compare based on title
        return a.title.localeCompare(b.title);
      });
      setListings(orderedListings);
      setFilteredListings(orderedListings);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch and sort listings once booking statuses are loaded
  useEffect(() => {
    fetchAndSortListings();
  }, [bookingStatus]);

  // Set maxPrice to the highest price from listings and update Slider max if necessary
  useEffect(() => {
    if (listings.length > 0) {
      const maxListingPrice = Math.max(...listings.map(listing => listing.price));
      // Update the filters state
      setFilters(prevFilters => ({
        ...prevFilters,
        maxPrice: maxListingPrice,
        // Update the Slider range if the max price from listings exceeds the current Slider max
        sliderMax: maxListingPrice > prevFilters.sliderMax ? maxListingPrice : prevFilters.sliderMax
      }));
    }
  }, [listings]);

  // Handle changes in filter fields
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Update handleFilterChange for slider
  const handleSliderChange = (event, newValue) => {
    setFilters({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  // Add function to handle review rating sort change
  const handleRatingSortChange = (event) => {
    setFilters({ ...filters, sortByRating: event.target.value });
  };

  // Function to apply filters (not yet implemented)
  const applyFilters = () => {
    let filteredListings = listings;

    // Filter by the text (if search input is provided)
    if (filters.search) {
      filteredListings = filteredListings.filter(
        listing =>
          listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          listing.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by the number of bedrooms (if provided)
    if (filters.minBedrooms && filters.maxBedrooms) {
      if (filters.minBedrooms <= filters.maxBedrooms) {
        filteredListings = filteredListings.filter(
          listing => listing.metadata.bedrooms.length >= filters.minBedrooms && listing.metadata.bedrooms.length <= filters.maxBedrooms
        );
      } else {
        alert('Min bedrooms cannot be greater than max bedrooms');
        filters.minBedrooms = '';
        filters.maxBedrooms = '';
      }
    } else if (filters.minBedrooms) {
      alert('Please provide max bedrooms');
      filters.minBedrooms = '';
    } else if (filters.maxBedrooms) {
      alert('Please provide min bedrooms');
      filters.maxBedrooms = '';
    }

    // Filter by the date (if both start and end dates are provided)
    if (filters.startDate && filters.endDate) {
      if (filters.startDate < filters.endDate) {
        const userStartDate = new Date(filters.startDate);
        const userEndDate = new Date(filters.endDate);
        filteredListings = filteredListings.filter(listing => {
          // Check if there's any availability slot that contains the user's date range
          return listing.availability.some(slot => {
            const slotStartDate = new Date(slot.start);
            const slotEndDate = new Date(slot.end);
            return userStartDate >= slotStartDate && userEndDate <= slotEndDate;
          });
        });
      } else {
        alert('Start date cannot be greater than end date');
        filters.startDate = '';
        filters.endDate = '';
      }
    } else if (filters.startDate) {
      alert('Please provide end date');
      filters.startDate = '';
    } else if (filters.endDate) {
      alert('Please provide start date');
      filters.endDate = '';
    }

    // Filter by the price (if maxPrice is defined)
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(
        listing => listing.price >= filters.minPrice && listing.price <= filters.maxPrice);
    }

    // Order by rating (if sortByRating is defined)
    filteredListings.sort((a, b) => {
      // Convert the reviewsAverage to a number
      const ratingA = parseFloat(a.reviewsAverage) || 0;
      const ratingB = parseFloat(b.reviewsAverage) || 0;

      if (filters.sortByRating === 'highest') {
        // Sort by rating from high to low
        return ratingB - ratingA;
      } else if (filters.sortByRating === 'lowest') {
        // Sort by rating from low to high
        return ratingA - ratingB;
      } else {
        // No sorting
        return 0;
      }
    });

    // Update the listings to show
    setFilteredListings(filteredListings);
  };

  if (loading) {
    return (
      <CenterCircularProgress />
    );
  }

  return (
    <Container sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
      {/* Page title */}
      <Typography
        variant='h3'
        gutterBottom
        sx={{
          paddingTop: '24px',
          paddingBottom: '12px',
          fontWeight: 'bold',
        }}
      >
        Discover Properties
      </Typography>

      {/* Filter */}
      <LandingFilter
        handleFilterChange={handleFilterChange}
        handleSliderChange={handleSliderChange}
        handleRatingSortChange={handleRatingSortChange}
        applyFilters={applyFilters}
        filters={filters}
      />

      {/* Divider */}
      <Grid container >
        <Grid item xs={12}>
          <Divider sx={{ my: 1, width: '100%', p: '4px' }} />
        </Grid>
      </Grid>

      {/* Listings section */}
      <Grid container spacing={2} justifyContent="start" sx={{ my: 2 }}>
        {loading
          ? (
          <CenterCircularProgress />
            )
          : (
              filteredListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
              {/* Consider do we really need this handleRemove */}
              <LandingListingCard listing={listing} startDate={filters.startDate} endDate={filters.endDate} />
            </Grid>
              ))
            )}
      </Grid>
    </Container>
  );
};

export default Landing;
