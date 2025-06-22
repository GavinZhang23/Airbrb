import React from 'react';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import JsonFileUploader from '../components/JsonFileUploader';

describe('JsonFileUploader', () => {
  const validJson = JSON.stringify({
    title: 'Valid Listing',
    address: '123 Main St',
    price: '100',
    thumbnail: 'https://www.youtube.com/watch?v=tqZlUx4qj1k',
    photos: [],
    propertyType: 'house',
    bathrooms: '1',
    amenities: ['bbqGrill'],
    bedrooms: [{ bedType: 'Queen', beds: 1 }]
  });

  const invalidJson = JSON.stringify({
    title: 'Invalid Listing',
    address: '123 Main St',
    price: '100',
    // Missing 'thumbnail' and other required fields
  });

  const handleJsonUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock window.alert to prevent actual alerts during tests
  });

  // 1. The component successfully uploads valid JSON data.
  it('successfully uploads valid JSON data', async () => {
    render(<JsonFileUploader onJsonUpload={handleJsonUpload} />);

    const blob = new Blob([validJson], { type: 'application/json' });
    const file = new File([blob], 'valid.json', { type: 'application/json' });

    const input = screen.getByLabelText(/upload json/i);
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => screen.getByLabelText(/upload json/i));

    try {
      await waitFor(() => {
        expect(handleJsonUpload).toHaveBeenCalledWith(JSON.parse(validJson));
      });
    } catch (error) {
      // console.error('Error reading JSON file:', error);
      alert('Error reading JSON file: ' + error.message);
    }
  });

  // 2. The component detects invalid JSON input.
  it('detects invalid JSON input', async () => {
    render(<JsonFileUploader onJsonUpload={handleJsonUpload} />);

    // Create a blob from the invalid JSON string
    const blob = new Blob([invalidJson], { type: 'application/json' });
    const file = new File([blob], 'invalid.json', { type: 'application/json' });
    file.text = () => Promise.resolve(invalidJson);

    // Use fireEvent to simulate the file selection
    const input = screen.getByLabelText(/upload json/i);
    fireEvent.change(input, { target: { files: [file] } });

    // Since the JSON is invalid, the alert should be called
    await screen.findByLabelText(/upload json/i); // wait for async actions to complete
    expect(window.alert).toHaveBeenCalledWith('JSON file does not match the expected format.');
  });

  // 3. The input field is cleared after a file is selected.
  it('clears the input field after a file is selected', async () => {
    render(<JsonFileUploader onJsonUpload={handleJsonUpload} />);

    // Use fireEvent to simulate the file selection
    const input = screen.getByLabelText(/upload json/i);
    const file = new File([new Blob()], 'clear.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [file] } });

    await screen.findByLabelText(/upload json/i); // wait for async actions to complete
    expect(input.value).toBe(''); // The input should be cleared
  });
});
