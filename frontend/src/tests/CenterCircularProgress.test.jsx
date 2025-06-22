import React from 'react';
import { render, screen } from '@testing-library/react';
import CenterCircularProgress from '../components/CenterCircularProgress';

describe('<CenterCircularProgress />', () => {
  // Test to check if the CircularProgress component is rendered
  it('renders a CircularProgress component', () => {
    render(<CenterCircularProgress />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  // Test to verify that the CircularProgress is centered in the Box
  it('centers CircularProgress in the Box', () => {
    const { container } = render(<CenterCircularProgress />);
    const box = container.firstChild;
    expect(box).toHaveStyle('display: flex');
    expect(box).toHaveStyle('justifyContent: center');
    expect(box).toHaveStyle('alignItems: center');
  });

  // Test to ensure that the Box has a minimum height of 200px
  it('has a minHeight of 200px for the Box', () => {
    const { container } = render(<CenterCircularProgress />);
    const box = container.firstChild;
    expect(box).toHaveStyle('minHeight: 200px');
  });
});
