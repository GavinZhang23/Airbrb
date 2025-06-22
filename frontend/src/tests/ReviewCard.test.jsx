import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewCard from '../components/ReviewCard';

describe('<ReviewCard />', () => {
  it('renders without crashing', () => {
    render(<ReviewCard review="Nice product!" rating={4} />);
    expect(screen.getByText('Nice product!')).toBeInTheDocument();
  });

  it('displays the correct rating', () => {
    const testRating = 3;
    render(<ReviewCard review="Great!" rating={testRating} />);
    const rating = screen.getByLabelText(`${testRating} Stars`);
    expect(rating).toBeInTheDocument(); // This checks if the element is in the document
    expect(rating).toHaveAttribute('aria-label', `${testRating} Stars`);
  });

  it('displays the correct review text', () => {
    const testReview = 'Love this product!';
    render(<ReviewCard review={testReview} rating={5} />);
    expect(screen.getByText(testReview)).toBeInTheDocument();
  });

  it('has a read-only rating component', () => {
    const testRating = 4;
    render(<ReviewCard review="Good product" rating={testRating} />);
    const rating = screen.getByLabelText(`${testRating} Stars`);
    // Check if it has the correct class indicating it's read-only
    expect(rating).toHaveClass('MuiRating-readOnly');
  });
});
