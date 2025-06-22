// You need to accessing the listing data like data.bookings
const fetchAllBookings = async (token) => {
  const response = await fetch('http://localhost:5005/bookings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    alert(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  // console.log('all bookings', data);
  return data;
}

export default fetchAllBookings;
