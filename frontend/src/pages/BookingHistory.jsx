import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Container,
  Typography,
} from '@mui/material';
import fetchAllBookings from '../helpers/FetchAllBookings';
import CenterCircularProgress from '../components/CenterCircularProgress';
import TabPanel from '../components/TabPanel';
import BookingRequestsTab from '../components/BookingRequestsTab';
import BookingHistoryTab from '../components/BookingHistoryTab';
import ListingInformationTab from '../components/ListingInformationTab';
import { useParams } from 'react-router-dom';

const BookingHistory = (props) => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  // pendingBookings + historyBookings = bookings
  // historyBookings = acceptedBookings + declinedBookings
  const [pendingBookings, setPendingBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);

  // Get listing ID from URL
  const listingId = useParams().id;

  useEffect(async () => {
    setLoading(true);
    if (!props.token) {
      setLoading(false);
      return;
    }
    try {
      const allBookings = await fetchAllBookings(props.token);
      setPendingBookings(allBookings.bookings.filter((booking) => booking.listingId === listingId && booking.status === 'pending'));
      setHistoryBookings(allBookings.bookings.filter((booking) => booking.listingId === listingId && booking.status !== 'pending'));
      console.log('All bookings:', allBookings.bookings.filter((booking) => booking.listingId === listingId && booking.status !== 'pending'));
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      // Set the loading state to false to hide the loading spinner
      setLoading(false);
    }
  }, [props.token]);

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleBookingAccept = (bookingId) => {
    const acceptBooking = async (bookingId) => {
      const response = await fetch(`http://localhost:5005/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      });
      if (response.error) {
        alert(response.error);
      } else if (!response.ok) {
        alert('Failed to accept booking');
        console.log(response);
      } else {
        const unprocessedBooking = pendingBookings.filter((booking) => booking.id !== bookingId);
        const processedBooking = pendingBookings.filter((booking) => booking.id === bookingId);
        // result = Array.filter(A => A.attr1 === sth)
        //
        // result = []
        // for(let i = 0; i < A.length; i++) {
        // if(A[i].attr1 === sth) {
        //  result.append(A[i])
        // }
        setPendingBookings(unprocessedBooking);
        processedBooking[0].status = 'accepted'
        console.log(`Accepted booking with ID: ${bookingId}`);
        setHistoryBookings(historyBookings.concat(processedBooking));
      }
    }
    acceptBooking(bookingId);
  };

  const handleBookingDecline = (bookingId) => {
    const declineBooking = async (bookingId) => {
      const response = await fetch(`http://localhost:5005/bookings/decline/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      });
      if (response.error) {
        alert(response.error);
      } else if (!response.ok) {
        alert('Failed to decline booking');
        console.log(response);
      } else {
        const unprocessedBooking = pendingBookings.filter((booking) => booking.id !== bookingId);
        const processedBooking = pendingBookings.filter((booking) => booking.id === bookingId);
        setPendingBookings(unprocessedBooking);
        processedBooking[0].status = 'declined'
        console.log(`Declined booking with ID: ${bookingId}`);
        setHistoryBookings(historyBookings.concat(processedBooking));
      }
    }
    declineBooking(bookingId);
  };

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };
  if (loading) {
    return <CenterCircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant='h4' mt={3} mb={3}>Manage Your Listing</Typography>
      <Tabs value={tabValue} onChange={handleChange} aria-label="Listing Management Tabs">
        <Tab label="Booking Requests" {...a11yProps(0)} />
        <Tab label="Booking History" {...a11yProps(1)} />
        <Tab label="Listing Information" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {/* Booking Requests */}
        <BookingRequestsTab bookings={pendingBookings} handleBookingAccept={handleBookingAccept} handleBookingDecline={handleBookingDecline} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Booking History */}
        <BookingHistoryTab historyBookings={historyBookings} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Listing Information */}
        <ListingInformationTab historyBookings={historyBookings} token={props.token} listingId={listingId} />
      </TabPanel>
    </Container>
  );
};

export default BookingHistory;
