import fetchAllListings from './FetchAllListings';
import fetchListingInfo from './FetchListingInfo';

const fetchAllListingDetails = async (token) => {
  try {
    const data = await fetchAllListings(token);
    const listings = data.listings;
    const listingDetails = [];
    for (const listing of listings) {
      const listingDetail = await fetchListingInfo(token, listing.id);
      // Add id for data.listing
      listingDetail.listing.id = listing.id;
      listingDetail.listing.reviewsAverage = (listingDetail.listing.reviews
        .reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length).toFixed(1)
      listingDetails.push(listingDetail.listing);
    }
    // console.log('listing Details', listingDetails)
    return listingDetails;
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

export default fetchAllListingDetails;
