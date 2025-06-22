import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BedIcon from '@mui/icons-material/Bed';
import { Box } from '@mui/material';

const BedroomCard = (props) => {
  return (
    <Card sx={{ width: '100%', boxSizing: 'border-box' }}>
      <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start', height: '100%', '&:last-child': { paddingBottom: '10px', paddingTop: '10px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BedIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" component="div">
            {props.bedroom.beds} {props.bedroom.bedType} bed{props.bedroom.beds > 1 ? 's' : ''}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BedroomCard;
