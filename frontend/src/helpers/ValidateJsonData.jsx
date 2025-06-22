import amenitiesOptions from './AmenitiesOptions';
const validateJsonData = (data) => {
  const requiredFields = [
    'title',
    'address',
    'price',
    'thumbnail',
    'photos',
    'propertyType',
    'bathrooms',
    'amenities',
    'bedrooms'
  ];

  const bedTypes = ['Single', 'Double', 'Queen', 'King'];
  const propertyTypes = ['house', 'apartment', 'boat', 'cabin', 'castle'];
  const amenitiesKeys = amenitiesOptions.map(option => option.key);
  // Check if all required fields are present
  const hasAllFields = requiredFields.every(field => field in data);

  if (hasAllFields) {
    // check if all bedrooms are valid
    const bedroomsValid = data.bedrooms.every(bedroom =>
      bedTypes.includes(bedroom.bedType) && Number.isInteger(Number(bedroom.beds)) && bedroom.beds > 0
    );
    // Validate propertyType and amenities
    const propertyTypeValid = propertyTypes.includes(data.propertyType);

    const amenitiesValid = data.amenities.every(amenity => amenitiesKeys.includes(amenity));

    console.log('bedroomsValid', bedroomsValid);
    console.log('propertyTypeValid', propertyTypeValid);
    console.log('amenitiesValid', amenitiesValid);
    // If all fields are valid, return true
    return bedroomsValid && propertyTypeValid && amenitiesValid;
  }

  return false;
};

export default validateJsonData;
