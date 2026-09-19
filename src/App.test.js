import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Pretend the viewport matches (or doesn't) the mobile media query used by
// hooks/useMediaQuery, which decides which homepage tree gets rendered.
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
  // Skip the boot preloader so the page content renders immediately.
  window.sessionStorage.setItem('aiv:booted', '1');
});

test('renders the navigation and the mobile homepage', async () => {
  mockViewport(true);
  renderApp();
  expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  // The homepage tree is lazy-loaded; wait for its hero copy to appear.
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
