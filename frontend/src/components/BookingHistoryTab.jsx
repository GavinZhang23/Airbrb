import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import daysBetweenDates from '../helpers/DaysBetween';
import capitalizeFirstLetter from '../helpers/CapitalizeFirstLetter';

const BookingHistoryTab = ({ historyBookings }) => {
  console.log('history bookings:', historyBookings)
  return (
    <List>
      {historyBookings.map((booking) => (
        <ListItem key={booking.id} divider>
        <ListItemText
          primary={`Requested by: ${booking.owner}`}
          secondary={
            <>
              <Typography component="span" variant="body2" display="block">
                {`Booked from ${format(new Date(booking.dateRange.start), 'yyyy-MM-dd')} 
                  to ${format(new Date(booking.dateRange.end), 'yyyy-MM-dd')}. 
                  (${daysBetweenDates(booking.dateRange.start, booking.dateRange.end)} 
                  day${daysBetweenDates(booking.dateRange.start, booking.dateRange.end) > 1 ? 's' : ''})`}
              </Typography>
              <Typography component="span" variant="body2" display="block">
                {`Revenue: $${booking.totalPrice}`}
              </Typography>
            </>
          }
        />
          <Typography>
            {capitalizeFirstLetter(booking.status)}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}

export default BookingHistoryTab;
