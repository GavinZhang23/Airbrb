// You need to accessing the listing data like data.listing
const fetchListingInfo = async (token, listingId) => {
  // Fetch the listing data from the backend
  const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    alert('Error fetching listing');
    return;
  }
  const data = await response.json();
  return data;
}

export default fetchListingInfo;
