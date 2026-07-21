import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function App() {
  return <div>Hello</div>;
}

describe('App', () => {
  it('renders', () => {
    render(<App />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
