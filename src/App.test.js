import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockViewport = (isMobile) => {
  window.matchMedia = (query) => ({
    matches: query.includes('max-width') ? isMobile : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
};

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

beforeEach(() => {
  window.sessionStorage.setItem('aiv:booted', '1');
});

test('renders the navigation and the mobile homepage', async () => {
  mockViewport(true);
  renderApp();
  expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  expect(await screen.findByText(/of Intelligence\./i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /explore events/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /core directives/i })).toBeInTheDocument();
});

test('renders the desktop homepage', async () => {
  mockViewport(false);
  renderApp();
  expect(await screen.findByText(/of Intelligence\./i)).toBeInTheDocument();
  expect(screen.getByText(/scroll down to sequence/i)).toBeInTheDocument();
});
