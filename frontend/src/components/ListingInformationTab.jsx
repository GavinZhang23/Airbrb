import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import daysBetweenDates from '../helpers/DaysBetween';
import fetchListingInfo from '../helpers/FetchListingInfo';

const ListingInformationTab = ({ historyBookings, token, listingId }) => {
  // calculate duration since listing published
  const [onlineDuration, setOnlineDuration] = useState(0);
  const [postedDate, setPostedDate] = useState('');
  useEffect(async () => {
    const response = await fetchListingInfo(token, listingId);
    const postedDate = new Date(response.listing.postedOn);
    const onlineDuration = daysBetweenDates(postedDate, new Date());
    // check if listing is published
    // if not, set postedDate to empty string
    if (response.listing.postedOn) {
      setPostedDate(postedDate.toLocaleDateString());
    } else {
      setPostedDate('');
    }
    setOnlineDuration(onlineDuration);
  }, [token]);

  // calculate total days booked
  const acceptedBooking = historyBookings.filter((booking) => booking.status === 'accepted');
  const totalDayNumbers = acceptedBooking.map(booking => daysBetweenDates(booking.dateRange.start, booking.dateRange.end));
  const daysBooked = totalDayNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // calculate total revenue
  const totalRevenue = acceptedBooking.map(booking => booking.totalPrice);
  const profitMade = totalRevenue.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
      <Grid item xs={12} md={4}>
        <Card raised>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Online Duration
            </Typography>
            {postedDate === ''
              ? (
                <Typography variant="h4">
                  Not published
                </Typography>
                )
              : (
                <>
                  <Typography variant="h4">
                    {onlineDuration} days
                  </Typography>
                  <Typography variant="h6">
                    since {postedDate}
                  </Typography>
                </>
                )
            }
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card raised>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Days Booked This Year
            </Typography>
            <Typography variant="h4">
              {daysBooked} days
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card raised>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Profit This Year
            </Typography>
            <Typography variant="h4">
              ${profitMade}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ListingInformationTab;
