import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import BalconyRoundedIcon from '@mui/icons-material/BalconyRounded';
import MenuItem from '@mui/material/MenuItem';
import UserNameDisplay from './CurrentUserDisplay';

const Navigator = (props) => {
  // The pages that we want to display in the nav bar
  const pages = ['Landing'];

  // If the user is logged in, we want to display the hosted listing page
  if (props.token) {
    if (!pages.includes('Hosted Listing')) { pages.push('Hosted Listing'); }
  } else {
    if (pages.includes('Hosted Listing')) { pages.pop('Hosted Listing'); }
  }

  const navigate = useNavigate();

  // The anchorEl is used to control the small screen menu
  const [anchorElNav, setAnchorElNav] = useState(null);

  // The handler for open the small screen menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // The handler for close the small screen menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // The handler for the register button
  const handleRegister = () => {
    console.log('Register clicked');
    // navigate to the register page
    navigate('/register');
  }

  // The handler for the login button
  const handleLogin = () => {
    console.log('Login clicked');
    // navigate to the login page
    navigate('/login');
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Airbrb Icon */}
          <BalconyRoundedIcon sx={{ mr: 1, fontSize: '2.5rem', display: 'flex' }} />
          {/* Airbrb Tag */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: { xs: '1.5rem', md: '2rem' }, // Responsive font size
            }}
          >
            AIRBRB
          </Typography>

          {/* Small screen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} name="nav" onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/${page.toLowerCase().replace(' ', '-')}`);
                }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Large screen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start' }}>
            {/* For each page, we create a button that navigate to the page */}
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  navigate(`/${page.toLowerCase().replace(' ', '-')}`);
                }}
                sx={{ my: 2, ml: 3, color: 'white', display: 'block', fontWeight: 500, fontSize: '1rem' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Logout Button Position */}
          {/* If there is no token, then show login/logout, otherwise, show dashboard */}
          {
            // Logic: props.token ? ( yes: show logout button and username) : ( no: show login/logout button)
            props.token
              ? (
                <>
                  <Box sx={{ mr: 3 }}>
                    {/* User Name Display */}
                    <UserNameDisplay user={props.user} />
                  </Box>
                  {/* Logout Button */}
                  <Box sx={{ flexGrow: 0 }}>
                    <Button
                      color="inherit"
                      name="logout"
                      onClick={props.logout}
                      sx={{
                        fontWeight: 500,
                        fontSize: { md: '1rem', xs: '1rem', my: 1 },
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </>
                )
              : (
                // Login/Register Button
                <Box sx={{ flexGrow: 0 }}>
                  {/* Login btn */}
                  <Button
                    color="inherit"
                    onClick={handleLogin}
                    sx={{
                      fontWeight: 500,
                      fontSize: { md: '1rem', xs: '1rem', my: 4 },
                    }}
                  >
                    Login
                  </Button>
                  {/* Register btn */}
                  <Button
                    color="inherit"
                    onClick={handleRegister}
                    sx={{
                      fontWeight: 500,
                      fontSize: { md: '1rem', xs: '1rem', my: 4 },
                    }}
                  >
                    Register
                  </Button>
                </Box>
                )
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigator;
