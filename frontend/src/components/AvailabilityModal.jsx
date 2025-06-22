import React, { useState } from 'react';
import {
  Button,
  Box,
  Modal,
  TextField,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import mergeOverlappingRanges from '../helpers/MergeOverlappingRanges';

const AvailabilityModal = ({ isOpen, onClose, onPublish }) => {
  const [dateRanges, setDateRanges] = useState([{ start: '', end: '' }]);

  // set modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const handleDateChange = (index, field, value) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index][field] = value;
    // define start date and end date
    const startDate = field === 'start' ? new Date(value) : new Date(newDateRanges[index].start);
    const endDate = field === 'end' ? new Date(value) : new Date(newDateRanges[index].end);

    if (startDate.getTime() > endDate.getTime()) {
      // if start date is later than end date, alert the user
      alert('Start date must be before end date.');
    } else {
      setDateRanges(newDateRanges);
    }
  };

  const onPublishHandler = () => {
    // merge overlapping ranges and then publish
    const mergedRanges = mergeOverlappingRanges(dateRanges);
    if (mergedRanges[0].start === '' || mergedRanges[0].end === '') {
      alert('You must select a valid date range.');
      return;
    }
    onPublish(mergedRanges);
  };

  // add a new date range
  const addDateRange = () => {
    setDateRanges([...dateRanges, { start: '', end: '' }]);
  };
  // remove an exsisting date range
  const removeDateRange = (index) => {
    // filter the date ranges and remove the one at the given index
    // push other date ranges into the new array
    setDateRanges(dateRanges.filter((_, idx) => idx !== index));
  };

  return (
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={modalStyle}>
          <h2>Choose Available Dates</h2>
          {dateRanges.map((range, index) => (
            <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={range.start}
                onChange={(e) => handleDateChange(index, 'start', e.target.value)}
                sx={{ mr: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={range.end}
                onChange={(e) => handleDateChange(index, 'end', e.target.value)}
                sx={{ mr: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {index > 0 && (
                <IconButton onClick={() => removeDateRange(index)} color="error">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={addDateRange}>
            Add Date Range
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" name="publishAvailability" onClick={onPublishHandler}>
              Publish
            </Button>
          </Box>
        </Box>
      </Modal>
  );
}

export default AvailabilityModal;
