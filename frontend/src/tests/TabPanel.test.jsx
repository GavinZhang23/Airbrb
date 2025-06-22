import React from 'react';
import { render, screen } from '@testing-library/react';
import TabPanel from '../components/TabPanel';

describe('<TabPanel />', () => {
  // 1. renders the children when value equals index: make sure that the children are rendered when value equals index.
  it('renders the children when value equals index', () => {
    render(
      <TabPanel value={0} index={0}>
        <div>Test Content</div>
      </TabPanel>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  // 2. does not render the children when value does not equal index: make sure that the children are not rendered when value does not equal index.
  it('does not render the children when value does not equal index', () => {
    render(
      <TabPanel value={1} index={0}>
        <div>Test Content</div>
      </TabPanel>
    );
    expect(screen.queryByText('Test Content')).toBeNull();
  });

  // 3. has the correct role, id, and aria-labelledby attributes: make sure that the role, id, and aria-labelledby attributes are set correctly.
  it('has the correct role, id, and aria-labelledby attributes', () => {
    const index = 0;
    render(
      <TabPanel value={index} index={index}>
        <div>Test Content</div>
      </TabPanel>
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', `simple-tabpanel-${index}`);
    expect(panel).toHaveAttribute('aria-labelledby', `simple-tab-${index}`);
  });
});
