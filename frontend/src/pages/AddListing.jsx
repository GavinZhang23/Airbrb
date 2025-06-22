import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Checkbox,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fileToDataUrl from '../helpers/FileToDataUrl';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import amenitiesOptions from '../helpers/AmenitiesOptions';
import PhotoUploader from '../components/PhotoUploader';
import JsonFileUploader from '../components/JsonFileUploader';

const AddListing = (props) => {
  const navigate = useNavigate();

  // Listing info
  const [listingData, setListingData] = useState({
    title: '',
    address: '',
    price: '',
    thumbnail: '',
    photos: [],
    propertyType: '',
    bathrooms: '',
    bedrooms: [],
    amenities: [],
  });

  // Handle thumbnail change
  const handleThumbnailChange = (thumbnail) => {
    setListingData({ ...listingData, thumbnail });
  };

  const addBedroom = () => {
    setListingData({
      ...listingData,
      bedrooms: [...listingData.bedrooms, { beds: 1, bedType: 'Single' }],
    });
  };

  const removeBedroom = (index) => {
    setListingData({
      ...listingData,
      bedrooms: listingData.bedrooms.filter((_, i) => i !== index),
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    setListingData({ ...listingData, [e.target.name]: e.target.value });
  };

  // Handle bedroom change
  const handleBedroomChange = (index, field, value) => {
    const updatedBedrooms = listingData.bedrooms.map((bedroom, i) => {
      if (i === index) {
        return { ...bedroom, [field]: value };
      }
      return bedroom;
    });
    setListingData({
      ...listingData,
      bedrooms: updatedBedrooms,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the thumbnail to a data URL
    let thumbnailURL = listingData.thumbnail;
    if (listingData.thumbnail && listingData.thumbnail instanceof File) {
      thumbnailURL = await fileToDataUrl(listingData.thumbnail);
    }

    // Convert each photo in the listingData.photos to a data URL
    const photoURLs = await Promise.all(listingData.photos.map(async (photo) => {
      try {
        return await fileToDataUrl(photo);
      } catch (error) {
        alert(`Error processing photo ${photo.name}: ${error}`);
        throw error; // Stop the processing if any photo fails
      }
    })).catch(() => {
      // If any photo fails to process, stop the submission
      alert('Error processing photos');
      return null;
    });

    // Check if photo processing was successful
    if (!photoURLs) return;

    // Prepare the body with photo URLs
    const body = {
      title: listingData.title,
      address: listingData.address,
      price: listingData.price,
      thumbnail: thumbnailURL,
      metadata: {
        propertyType: listingData.propertyType,
        bathrooms: listingData.bathrooms,
        bedrooms: listingData.bedrooms,
        amenities: listingData.amenities,
        photos: photoURLs,
      },
    };

    // REST of the submission logic remains the same
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.error) {
      alert(response.error);
    } else {
      navigate('/hosted-listing')
    }
  };

  useEffect(() => {
    console.log(listingData);
  }, [listingData]);

  const handleJsonUpload = (jsonData) => {
    setListingData({ ...listingData, ...jsonData });
  };

  return (
    <Container maxWidth="md">
      {/* Welcome Title */}
      <Typography variant="h3" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        fontFamily: 'monospace',
        my: 4,
      }}
      >
        Create A New Listing
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Listing Title */}
        <Grid container spacing={3}>
          {/* Json File Upload */}
          <Grid item xs={12}>
            <JsonFileUploader onJsonUpload={handleJsonUpload} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Listing Title"
              name="title"
              value={listingData.title}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Listing Address */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Listing Address"
              name="address"
              value={listingData.address}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Listing Price */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Listing Price (per night)"
              name="price"
              type="number"
              value={listingData.price}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Listing Property Type */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                required
                value={listingData.propertyType}
                label="Property Type"
                name="propertyType"
                onChange={handleInputChange}
              >
                <MenuItem value={'house'}>House</MenuItem>
                <MenuItem value={'apartment'}>Apartment</MenuItem>
                <MenuItem value={'boat'}>Boat</MenuItem>
                <MenuItem value={'cabin'}>Cabin</MenuItem>
                <MenuItem value={'castle'}>Castle</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Listing bedrooms */}
          <Grid item xs={12}>
            <Button
              onClick={addBedroom}
              name="addBedroom"
              variant="outlined"
              startIcon={<AddIcon />}
            >
              Add Bedroom
            </Button>

            {listingData.bedrooms.map((bedroom, index) => (
              <Grid container spacing={2} key={index} sx={{ margin: '12px 0px' }}>
                {/* number of beds in each room */}
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Number of beds"
                    type="number"
                    value={bedroom.beds}
                    onChange={(e) => handleBedroomChange(index, 'beds', e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                {/* Type of bed in each room */}
                <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink={!!(bedroom.beds && bedroom.bedType)}>
                    Bed Type
                  </InputLabel>
                  <Select
                    value={bedroom.bedType}
                    name="selectBedType"
                    onChange={(e) => handleBedroomChange(index, 'bedType', e.target.value)}
                    label="Bed Type"
                    displayEmpty
                  >
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="King">King</MenuItem>
                    <MenuItem value="Queen">Queen</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
                {/* Delete this column */}
                <Grid item xs={3}>
                  <Button
                    onClick={() => removeBedroom(index)}
                    variant="outlined"
                    name="removeBedroom"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Listing bathrooms */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Number of bathrooms"
              name="bathrooms"
              type="number"
              value={listingData.bathrooms}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Listing amenities */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="amenities-checkboxes"
              options={amenitiesOptions}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Amenities" placeholder="Amenities" />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    key={option.key}
                    label={option.label}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      setListingData({
                        ...listingData,
                        amenities: listingData.amenities.filter((amenity) => amenity !== option.key),
                      });
                    }}
                  />
                ))
              }
              onChange={(event, newValue) => {
                setListingData({
                  ...listingData,
                  amenities: newValue.map((item) => item.key),
                });
              }}
              value={listingData.amenities.map((key) => amenitiesOptions.find((option) => option.key === key))}
            />
          </Grid>

          {/* Listing Thumbnail */}
          <Grid item xs={12}>
            <PhotoUploader
              onPhotosChange={(photos) => setListingData({ ...listingData, photos })}
              onThumbnailChange={handleThumbnailChange}
              initialThumbnail={listingData.thumbnail}
              initialPhotos={listingData.photos}
            />
          </Grid>

          {/* Submit button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              name="submit"
              color="primary"
              variant="contained"
              fullWidth
              sx={{
                padding: '12px 24px',
              }}
            >
              Create Listing
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddListing;
