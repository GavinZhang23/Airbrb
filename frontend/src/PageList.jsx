import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import HostedListing from './pages/HostedListing';
import Landing from './pages/Landing';
import Navigator from './components/Navigator';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import ListingDetail from './pages/ListingDetail';
import BookingHistory from './pages/BookingHistory';
import ProfitGraph from './pages/ProfitGraph';

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  // Set token from local storage
  React.useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      setToken(checkToken);
      setUser(localStorage.getItem('user'));
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    console.log('Logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <Navigator token={token} setToken={setToken} user={user} logout={handleLogout} />
      <Routes>
        {/* TODO: Clean the setToken and setUser if the routes don't need them, do this at final step */}
        <Route path="/" element={<Landing token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/landing" element={<Landing token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/register" element={<Register token={token} user={user} setToken={setToken} setUser={setUser} />} />
        <Route path="/login" element={<Login token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/hosted-listing" element={<HostedListing token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/hosted-listing/add-listing" element={<AddListing token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/hosted-listing/profit-graph/" element={<ProfitGraph token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        {/* somePath/:id where :id changes with const listingId = useParams().id; */}
        <Route path="/hosted-listing/edit-listing/:id" element={<EditListing token={token} user={user} setToken={setToken} setUser={setUser}/>} />
        <Route path="/listing/:id" element={<ListingDetail token={token} user={user} setToken={setToken} setUser={setUser} startDate='' endDate=''/>} />
        <Route path="/booking-history/:id" element={<BookingHistory token={token} user={user} setToken={setToken} setUser={setUser}/>} />
      </Routes>
    </>
  );
}

export default PageList;
