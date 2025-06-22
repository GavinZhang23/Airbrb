import { React, useState, useEffect } from 'react';
import HostedListingCard from '../components/HostedListingCard';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import fetchAllListings from '../helpers/FetchAllListings';
import CenterCircularProgress from '../components/CenterCircularProgress';
// import ProfitGraph from './ProfitGraph';

const HostedListing = (props) => {
  const navigate = useNavigate();
  // The hosted listings state is used to store the listings fetched from the backend
  // It includes all the listings that the user is hosting
  const [hostedListings, setHostedListings] = useState([]);
  // The loading state is used to display a loading spinner while the listings data is being fetched
  const [loading, setLoading] = useState(true);

  // This useEffect is used to fetch all the listings data from the backend
  // when the component is initialized, and when the token is updated (means the user logged in or logged out)
  useEffect(() => {
    // Define the function that fetching the user's listings from the backend
    const fetchHostedListings = async () => {
      // Set the loading state to true to display the loading spinner
      // We don't want to display the listings before the data is fetched
      // That will cause an error because the listings is an empty array before the data is fetched
      setLoading(true);
      if (!props.token) {
        setLoading(false);
        return;
      }
      try {
        // we are using the fetchAllListings helper function to fetch all the listings
        const data = await fetchAllListings(props.token);
        // Only set the listing if the user is the host
        const myListings = data.listings.filter(listing => listing.owner === props.user);
        setHostedListings(myListings);
        // console.log('All my listings', myListings);
      } catch (error) {
        console.error('Fetch error:', error.message);
      } finally {
        // Set the loading state to false to hide the loading spinner
        setLoading(false);
      }
    };
    // Call the fetchHostedListings function，and it will fetch the listings data from the backend
    fetchHostedListings();
  }, [props.token]);

  // The handler for the delete button
  const handleDelete = (listingId) => {
    console.log('Delete listing', listingId);
    // Update the state of the hosted listings
    // As the hosted listings is updated, the component will be re-rendered
    // The listing with the listingId will be removed from the hosted listings
    // This function is passed to the HostedListingCard component, so the HostedListingCard component can call this function
    setHostedListings(currentListings => currentListings.filter(listing => listing.id !== listingId));
  };

  const handleCardOnClick = async (listingId) => {
    navigate(`/booking-history/${listingId}`);
  };

  // If the loading state is true, we display the loading spinner
  if (loading) {
    return (
      <CenterCircularProgress />
    );
  }

  // If the loading state is false, we display the hosted listings
  return (
      <Container sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <Typography sx={{
          paddingTop: '30px',
          paddingBottom: '16px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
        }}
        variant="h3" gutterBottom>
          Welcome Back!
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '24px',
        }}>
          <Button variant="contained" color="primary" size="medium" sx={{
            fontSize: { md: '1rem', xs: '1rem' },
            padding: { md: '8px 20px', xs: '8px 16px' },
            marginRight: 2
          }} onClick={() => navigate('/hosted-listing/profit-graph')}>
            Check your profit
          </Button>
          <Button variant="contained" color="primary" size="medium" sx={{
            fontSize: { md: '1rem', xs: '1rem' },
            padding: { md: '8px 20px', xs: '8px 16px' }
          }} name="createListing" onClick={() => navigate('/hosted-listing/add-listing')}>
            create listing
          </Button>
        </Box>
        <hr />
        <Grid container spacing={2} justifyContent="start" sx={{ my: 2 }}>
        {
          // Loop through the nodelist hostedListings and render a HostedListingCard for each listing
          hostedListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
            <HostedListingCard
              listing={listing} token={props.token} onDelete={handleDelete} onClick={handleCardOnClick}
            />
            </Grid>
          ))
        }
        </Grid>
      </Container>
  );
}

export default HostedListing;
