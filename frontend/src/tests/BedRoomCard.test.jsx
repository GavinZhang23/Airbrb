import React from 'react';
import { render, screen } from '@testing-library/react';
import BedroomCard from '../components/BedRoomCard';

describe('<BedroomCard />', () => {
  it('renders without crashing', () => {
    render(<BedroomCard bedroom={{ beds: 1, bedType: 'single' }} />);
    expect(screen.getByText(/bed/i)).toBeInTheDocument();
  });

  it('displays the correct number of beds and bed type', () => {
    render(<BedroomCard bedroom={{ beds: 2, bedType: 'double' }} />);
    expect(screen.getByText(/2 double beds/i)).toBeInTheDocument();
  });

  it('renders the bed icon', () => {
    render(<BedroomCard bedroom={{ beds: 1, bedType: 'single' }} />);
    expect(screen.getByTestId('BedIcon')).toBeInTheDocument();
  });

  it('uses the correct singular or plural form of bed', () => {
    const { rerender } = render(<BedroomCard bedroom={{ beds: 1, bedType: 'single' }} />);
    expect(screen.getByText(/1 single bed/i)).toBeInTheDocument();
    rerender(<BedroomCard bedroom={{ beds: 3, bedType: 'single' }} />);
    expect(screen.getByText(/3 single beds/i)).toBeInTheDocument();
  });

  it('has the correct styles applied to the card', () => {
    const { container } = render(<BedroomCard bedroom={{ beds: 1, bedType: 'single' }} />);
    const card = container.firstChild;
    expect(card).toHaveStyle({ width: '100%', boxSizing: 'border-box' });
  });
});
