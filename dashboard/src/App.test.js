import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pseudo-navbar', () => {
  render(<App />);
  const element = screen.getByText(/PerfAnalytics Dashboard/);
  expect(element).toBeInTheDocument();
});
