import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

import { format } from 'date-fns';
import daysBetweenDates from '../helpers/DaysBetween';

const BookingRequestsTab = ({ bookings, handleBookingAccept, handleBookingDecline }) => {
  return (
        <List>
          {bookings.map((booking) => (
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
              <DialogActions>
                <Button color="primary" onClick={() => handleBookingAccept(booking.id)}>Accept</Button>
                <Button color="secondary" onClick={() => handleBookingDecline(booking.id)}>Decline</Button>
              </DialogActions>
            </ListItem>
          ))}
        </List>
  );
}

export default BookingRequestsTab;
