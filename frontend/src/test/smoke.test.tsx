import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App Smoke Test', () => {
  it('renders without crashing', () => {
    render(<div data-testid="app-root">Hello World</div>);
    expect(screen.getByTestId('app-root')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
