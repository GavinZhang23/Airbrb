// You need to accessing the listing data like data.listings
const fetchAllListings = async () => {
  const response = await fetch('http://localhost:5005/listings', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    alert(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export default fetchAllListings;
