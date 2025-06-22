import React from 'react';
import { Button } from '@mui/material';
import validateJsonData from '../helpers/ValidateJsonData';
const JsonFileUploader = ({ onJsonUpload }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (validateJsonData(data)) {
        onJsonUpload(data);
      } else {
        alert('JSON file does not match the expected format.');
      }
    } catch (error) {
      alert('Error reading JSON file: ' + error.message);
    }

    // Clear the input field
    event.target.value = '';
  };

  return (
    <Button variant="contained" component="label">
      Upload JSON
      <input type="file" hidden onChange={handleFileChange} />
    </Button>
  );
};

export default JsonFileUploader;
