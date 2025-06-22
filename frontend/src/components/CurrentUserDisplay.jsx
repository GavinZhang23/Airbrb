import React from 'react';
import Box from '@mui/material/Box';

const CurrentUserDisplay = ({ user }) => {
  console.log('Current User:', user);
  return (
    <Box
      sx={{
        flexGrow: 0,
        fontWeight: 500,
        fontSize: { md: '1rem', xs: '1rem' },
        my: 1,
        color: 'inherit'
      }}
    >
      {`Hello, ${user}!`}
    </Box>
  );
}

export default CurrentUserDisplay;
