import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from '../page';

describe('Home', () => {
  it('renders muka heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'muka' })).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Home />);
    expect(screen.getByText('음악으로 마음을 전해요')).toBeInTheDocument();
  });

  it('renders CTA link to question selection', () => {
    render(<Home />);
    const ctaLink = screen.getByRole('link', { name: /시작하기/i });
    expect(ctaLink).toHaveAttribute('href', '/q');
  });
});
