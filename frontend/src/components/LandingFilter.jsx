import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Slider,
  Button,
  Typography,
  Grid,
} from '@mui/material';

const LandingFilter = (props) => {
  const { handleFilterChange, handleSliderChange, handleRatingSortChange, applyFilters, filters } = props;
  return (
      <Grid container spacing={2} justifyContent="start">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: '20px',
              boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Search input */}
            <TextField
              label="Search"
              variant="outlined"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              sx={{ borderRadius: '20px' }}
            />
            {/* Bedroom filters */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Min Bedrooms"
                type="number"
                name="minBedrooms"
                value={filters.minBedrooms}
                onChange={handleFilterChange}
              />
              <TextField
                label="Max Bedrooms"
                type="number"
                name="maxBedrooms"
                value={filters.maxBedrooms}
                onChange={handleFilterChange}
              />
            </Box>
            {/* Date filters */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            {/* Price range slider with current range display */}
            <Typography variant="overline" sx={{ fontSize: '1.2rem', lineHeight: '1rem', mt: 1 }}>
              Price Range: ${filters.minPrice} - ${filters.maxPrice}
            </Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={filters.sliderMax}
            />
            {/* Review Ratings Sorting */}
            <FormControl fullWidth>
              <InputLabel id="rating-sort-label">Sort by Rating</InputLabel>
              <Select
                labelId="rating-sort-label"
                id="rating-sort-select"
                value={filters.sortByRating}
                label="Sort by Rating"
                onChange={handleRatingSortChange}
              >
                <MenuItem value={'none'}>None</MenuItem>
                <MenuItem value={'highest'}>Highest to Lowest</MenuItem>
                <MenuItem value={'lowest'}>Lowest to Highest</MenuItem>
              </Select>
            </FormControl>
            {/* Search button */}
            <Button variant="contained" onClick={applyFilters}>
              Search
            </Button>
          </Box>
        </Grid>
      </Grid>
  );
}

export default LandingFilter;
