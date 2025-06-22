
import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertMessage from '../components/AlertMessage';

describe('AlertMessage', () => {
  const message = 'Test Alert Message';
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1.The component renders correctly.
  it('renders correctly', () => {
    render(<AlertMessage open={true} handleClose={handleClose} message={message} severity="success" />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // 2.The Snackbar opens when the open prop is true.
  it('is visible when open is true', () => {
    render(<AlertMessage open={true} handleClose={handleClose} message={message} severity="success" />);
    expect(screen.getByRole('alert')).toBeVisible();
  });

  // 3.The Snackbar does not render when the open prop is false.
  it('is not visible when open is false', () => {
    render(<AlertMessage open={false} handleClose={handleClose} message={message} severity="success" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // 4.The Snackbar closes after the specified autoHideDuration.
  it('closes after autoHideDuration', () => {
    jest.useFakeTimers();
    render(<AlertMessage open={true} handleClose={handleClose} message={message} severity="success" />);
    expect(handleClose).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1500);
    expect(handleClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  // 5.The Snackbar displays the correct message and severity.
  it('displays the correct message', () => {
    render(<AlertMessage open={true} handleClose={handleClose} message={message} severity="success" />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // 6.The Snackbar calls the handleClose function when it's supposed to close.
  it('displays the correct severity', () => {
    render(<AlertMessage open={true} handleClose={handleClose} message={message} severity="error" />);
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledError');
  });
});
