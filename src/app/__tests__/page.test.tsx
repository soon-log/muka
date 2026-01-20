import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from '../page';

describe('Home', () => {
  it('renders MUKA heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'MUKA' })).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Home />);
    expect(screen.getByText('음악으로 마음을 전해요')).toBeInTheDocument();
  });
});
