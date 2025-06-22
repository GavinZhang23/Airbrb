# Testing
## Components tested
1. For the AlertMessage component, I tested:
    - The component renders correctly
    - The Snackbar opens when the open prop is true.
    - The Snackbar closes when the open prop is false.
    - The Snackbar closes after the specified autoHideDuration.
    - The Snackbar displays the correct message and severity.
2. For the BedRoom component, I tested:
    - The component renders without crashing
    - The component displays the correct number of beds and bed type
    - The component renders the bed icon
    - The component uses the correct singular or plural form of bed
    - The component has the correct styles applied to the card
    - The Snackbar calls the handleClose function when it's supposed to close.
3. For the CenterCircularProgress component, I tested:
    - The component renders without crashing
    - The component centers CircularProgress in the Box
    - The component has a minHeight of 200px for the Box
4. For the ReviewCard component, I tested:
    - The component renders without crashing
    - The component renders the correct data
    - The component displays the correct review text
    - The component has a read-only rating component
5. For the TabPanel component, I tested:
    - The component renders the children when value equals index: make sure that the children are rendered when value equals index.
    - The component  does not render the children when value does not equal index: make sure that the children are not rendered when value does not equal index.
    - The component  has the correct role, id, and aria-labelledby attributes: make sure that the role, id, and aria-labelledby attributes are set correctly.

6. For the JsonFileUploader component, I tested:
    - The component successfully uploads valid JSON data.
    - The component detects invalid JSON input.
    - The input field is cleared after a file is selected.
## UI Testing
1. ??