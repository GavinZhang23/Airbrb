import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import 'chart.js/auto';
import fetchAllBookings from '../helpers/FetchAllBookings';
import fetchAllListingDetails from '../helpers/FetchAllListingDetails';
import daysBetweenDates from '../helpers/DaysBetween';

const ProfitGraph = ({ token, user }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Daily Profit ($)',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await fetchAllBookings(token); // fetch all bookings
        const listingData = await fetchAllListingDetails(token); // fetch all listings
        // Filter out listings that belong to the user
        const userListing = listingData.filter(listing => listing.owner === user);
        const userListingIds = userListing.map(listing => listing.id);
        let bookedListingIds = new Set(bookingData.bookings.map(booking => booking.listingId));
        // transfer bookedListingIds from Set to Array
        bookedListingIds = [...bookedListingIds];
        // Filter out relevant listings
        const relevantListings = bookedListingIds.filter(booking =>
          userListingIds.includes(parseInt(booking)));
        // Filter out all accepted bookings
        const acceptedBookings = bookingData.bookings.filter(booking => booking.status === 'accepted' && relevantListings.includes(booking.listingId));

        const profitsByDate = {};
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        acceptedBookings.forEach(booking => {
          // Count all days that the listing has been booked
          const startDate = new Date(booking.dateRange.start);
          const endDate = new Date(booking.dateRange.end);
          const dayCount = daysBetweenDates(startDate, endDate);

          for (let day = 0; day < dayCount; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + day);

            // Only consider the dates within the last 30 days
            if (currentDate >= thirtyDaysAgo && currentDate <= new Date()) {
              const dateStr = currentDate.toISOString().split('T')[0];
              // Calculate daily income
              const dailyIncome = booking.totalPrice / dayCount;
              profitsByDate[dateStr] = (profitsByDate[dateStr] || 0) + dailyIncome;
            }
          }
        });

        // Convert profitsByDate to chartData
        const chartLabels = Object.keys(profitsByDate).sort();
        const chartDataPoints = chartLabels.map(date => profitsByDate[date]);
        setChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Total Profit per Day ($)',
            data: chartDataPoints,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        maxHeight: '800px',
        width: '80%',
        maxWidth: '1200px',
        marginBottom: '70px',
        margin: 'auto',
        boxSizing: 'border-box'
      }}>
      <Typography variant="h6" align="center" gutterBottom>
        Profit for the Past 30 Days
      </Typography>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Profit ($)'
              }
            }
          }
        }}
      />
    </Box>
  );
};

export default ProfitGraph;
