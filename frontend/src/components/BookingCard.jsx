import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import daysBetweenDates from '../helpers/DaysBetween';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AlertMessage from './AlertMessage';
import dayjs from 'dayjs';
import fetchAllBookings from '../helpers/FetchAllBookings';
const BookingCard = (props) => {
  let { startDate, endDate, listing, token, listingId, setBookingStatus } = props;
  // Local state to manage the start and end dates entered by the user
  const [startDateReserve, setStartDateReserve] = useState(null);
  const [endDateReserve, setEndDateReserve] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pricePerStay, setPricePerStay] = useState(daysBetweenDates(startDate, endDate) * listing.price);

  useEffect(() => {
    startDate = startDate !== '' ? dayjs(new Date(startDate)).format('YYYY-MM-DD') : null;
    endDate = endDate !== '' ? dayjs(new Date(endDate)).format('YYYY-MM-DD') : null;
    setStartDateReserve(startDate);
    setEndDateReserve(endDate);
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  // Generate an array of all dates that are available for booking
  const availableDates = listing.availability.flatMap(({ start, end }) => {
    const dates = [];
    let currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      if (isNaN(currentDate)) {
        console.error('Invalid date encountered:', currentDate);
      } else {
        dates.push(formattedDate);
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dates;
  });

  const makeReservation = async () => {
    const formattedStartDate = dayjs(startDateReserve).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(endDateReserve).format('YYYY-MM-DD');
    const response = await fetch(`http://localhost:5005/bookings/new/${listingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        dateRange: { start: formattedStartDate, end: formattedEndDate },
        totalPrice: daysBetweenDates(startDateReserve, endDateReserve) * listing.price
      })
    });
    if (response.error) {
      alert(response.error);
    } else if (response.status === 400) {
      alert('Invalid booking request.');
      console.error(response);
    } else {
      setOpenSnackbar(true);
      // Fetch all bookings again to update the booking status
      const allBookings = await fetchAllBookings(props.token);
      const userBookings = allBookings.bookings.filter(booking => booking.owner === props.user && booking.listingId === listingId);
      setBookingStatus(userBookings);
    }
  }

  // Function to handle booking confirmation
  const handleBookingSubmit = () => {
    if (!daysBetweenDates(startDateReserve, endDateReserve)) {
      alert('Start date must be before end date.');
      setStartDateReserve(undefined);
      setEndDateReserve(undefined);
      return;
    }
    if (listing.owner === props.user) {
      alert('You cannot book your own listing.');
      setStartDateReserve(undefined);
      setEndDateReserve(undefined);
      return;
    }
    // Send booking request to server
    makeReservation();
  };

  return (
    <>
    <Card>
      <CardContent>
        <Box>
          <Typography variant="h6" color="primary.main" mb={2}>
            { startDate && endDate
              ? `Price per stay: $${pricePerStay}`
              : `Price per night: $${listing.price}`}
          </Typography>
          {/* Check-in date picker */}
          <Box mb={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                name="startDate"
                label="Check-in"
                value={startDateReserve ? dayjs(startDateReserve) : null}
                format="DD/MM/YYYY"
                onChange={(newDate) => {
                  const dayjsDate = newDate ? dayjs(newDate) : null;
                  setStartDateReserve(dayjsDate);
                  if (startDateReserve) {
                    if (daysBetweenDates(startDateReserve, newDate) > 0) {
                      setPricePerStay(daysBetweenDates(startDateReserve, newDate) * listing.price);
                    } else {
                      setPricePerStay(0);
                    }
                  }
                }}
                shouldDisableDate={date => {
                  // Check if date is valid before formatting
                  if (!date || !dayjs.isDayjs(date)) return true;
                  const formattedDate = date.format('YYYY-MM-DD');
                  return !availableDates.includes(formattedDate);
                }}/>
            </LocalizationProvider>
          </Box>
          {/* Check-out date picker */}
          <Box mb={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                name="endDate"
                label="Check-out"
                value={endDateReserve ? dayjs(endDateReserve) : null}
                format="DD/MM/YYYY"
                onChange={(newDate) => {
                  const dayjsDate = newDate ? dayjs(newDate) : null;
                  setEndDateReserve(dayjsDate);
                  if (startDateReserve) {
                    if (daysBetweenDates(startDateReserve, newDate) > 0) {
                      setPricePerStay(daysBetweenDates(startDateReserve, newDate) * listing.price);
                    } else {
                      setPricePerStay(0);
                    }
                  }
                }}
                shouldDisableDate={date => {
                  // Check if date is valid before formatting
                  if (!date || !dayjs.isDayjs(date)) return true;
                  const formattedDate = date.format('YYYY-MM-DD');
                  return !availableDates.includes(formattedDate);
                }}/>
            </LocalizationProvider>
            <Typography variant="body1" color="text.secondary" mt={2}>
              Total Cost: ${daysBetweenDates(startDateReserve, endDateReserve) <= 0
              ? 0
              : daysBetweenDates(startDateReserve, endDateReserve) * listing.price}
            </Typography>
          </Box>
          {/* Reservation button */}
          <Button
            variant="contained"
            color="primary"
            name="reserve"
            onClick={handleBookingSubmit}
            disabled={daysBetweenDates(startDateReserve, endDateReserve) <= 0}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Reserve
          </Button>
        </Box>
      </CardContent>
    </Card>
    <AlertMessage
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        message="Booking successful!"
        severity="success"
      />
    </>
  );
}

export default BookingCard;
