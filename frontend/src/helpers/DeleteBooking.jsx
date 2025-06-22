const deleteBooking = async (booking, token) => {
  const response = await fetch(`http://localhost:5005/bookings/${parseInt(booking.id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    alert('Failed to delete booking');
    return false;
  }
  return true;
}

export default deleteBooking;
