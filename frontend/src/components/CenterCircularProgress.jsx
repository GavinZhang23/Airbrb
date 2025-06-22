import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const CenterCircularProgress = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
}

export default CenterCircularProgress;
