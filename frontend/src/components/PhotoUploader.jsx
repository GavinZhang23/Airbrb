import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, TextField } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import extractVideoIDFromURL from '../helpers/ExtractVideoIDFromURL';
const PhotoUploader = ({
  onPhotosChange,
  onThumbnailChange,
  initialThumbnail,
  initialPhotos,
}) => {
  const [photos, setPhotos] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const isThumbnailUrl = typeof thumbnail === 'string' && thumbnail.startsWith('http');

  useEffect(() => {
    const loadThumbnail = async () => {
      if (initialThumbnail) {
        if (typeof initialThumbnail === 'string' && initialThumbnail.startsWith('http')) {
          const videoId = extractVideoIDFromURL(initialThumbnail);
          setThumbnailPreview(`https://img.youtube.com/vi/${videoId}/0.jpg`);
        } else {
          setThumbnailPreview(getImageUrl(initialThumbnail));
        }
        setThumbnail(initialThumbnail);
      }
    }
    loadThumbnail();
  }, [initialThumbnail, initialPhotos]);

  const getImageUrl = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  // Function to handle adding a new thumbnail
  const handleAddThumbnail = (e) => {
    const newPhoto = e.target.files[0];
    setThumbnail(newPhoto);
    setThumbnailPreview(getImageUrl(newPhoto));
    onThumbnailChange(newPhoto);
  };

  // Function to handle adding a new photo
  const handleAddPhoto = (e) => {
    const newPhoto = e.target.files[0];
    if (newPhoto) {
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos);
    }
  };

  // Function to handle removing a new photo
  const handleRemovePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  // Function to handle YouTube URL input
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    const videoId = extractVideoIDFromURL(url);
    setThumbnail(url);
    setThumbnailPreview(`https://img.youtube.com/vi/${videoId}/0.jpg`);
    onThumbnailChange(url);
  };

  return (
    <Grid container spacing={3}>
      {/* Thumbnail Section */}
      <Grid item xs={12}>
        <Typography variant="h6">Thumbnail (Required)</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={thumbnailPreview
              ? (
                  <img src={thumbnailPreview} alt="📷" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                )
              : (
                <AddAPhotoIcon style={{ marginRight: '10px' }} /> // Default icon if no image is available)
                )
            }
          >
          Upload Thumbnail
          <input type="file" hidden name="thumbnail" onChange={handleAddThumbnail} />
        </Button>
      </Grid>

      {/* YouTube URL Input */}
      {
        <Grid item xs={12}>
          <TextField
            name="youtubeUrl"
            label="YouTube URL"
            value={isThumbnailUrl ? thumbnail : ''}
            onChange={handleYoutubeUrlChange}
            fullWidth
          />
        </Grid>
      }

      {/* Photos Section */}
      <Grid item xs={12}>
        <Typography variant="h6">Photos</Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item key={index}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemovePhoto(index)}
                style={{ textTransform: 'none', justifyContent: 'start', padding: '6px 10px', width: '100%', display: 'flex', alignItems: 'center' }}
              >
                <img src={getImageUrl(photo)} alt={`Photo ${index}`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                <DeleteIcon style={{ cursor: 'pointer' }} />
              </Button>
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddAPhotoIcon />}
              style={{ textTransform: 'none', justifyContent: 'start', padding: '6px 10px', width: '100%', display: 'flex', alignItems: 'center' }}
            >
              Add Photo
              <input type="file" hidden onChange={handleAddPhoto} />
            </Button>
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
};

export default PhotoUploader;
