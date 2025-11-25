import { render, screen } from '@testing-library/react';
import App from './App';

test('renders World Clock header', () => {
  render(<App />);
  const headerElement = screen.getByText(/World Clock/i);
  expect(headerElement).toBeInTheDocument();
});
