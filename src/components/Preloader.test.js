import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Preloader } from './Preloader';

const renderCore = () => render(<div data-core-intro><Preloader><div data-testid="core" /></Preloader></div>);

beforeEach(() => {
  jest.useFakeTimers();
  sessionStorage.clear();
  document.body.style.overflow = 'auto';
  window.matchMedia = (query) => ({
    matches: false, media: query, addEventListener() {}, removeEventListener() {},
  });
});
afterEach(() => jest.useRealTimers());

test('genesis releases scrolling after 3.8s without replacing the core and skips on revisit', () => {
  const { unmount } = renderCore();
  const core = screen.getByTestId('core');
  expect(screen.getByRole('status')).toHaveTextContent('Initializing AIvolutions');
  expect(document.body.style.overflow).toBe('hidden');
  act(() => jest.advanceTimersByTime(3200));
  expect(screen.getByRole('status')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(600));
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByTestId('core')).toBe(core);
  expect(document.body.style.overflow).toBe('auto');
  expect(sessionStorage.getItem('aiv:booted')).toBe('1');
  unmount();
  renderCore();
  expect(screen.queryByRole('status')).toBeNull();
});

test('reduced motion shows the completed core immediately without locking scroll', () => {
  window.matchMedia = (query) => ({
    matches: query.includes('reduced-motion'), media: query, addEventListener() {}, removeEventListener() {},
  });
  renderCore();
  expect(screen.getByTestId('core')).toBeInTheDocument();
  expect(screen.queryByRole('status')).toBeNull();
  expect(document.body.style.overflow).toBe('auto');
});

test('unmount during genesis restores scroll and clears its timer', () => {
  const { unmount } = renderCore();
  unmount();
  expect(document.body.style.overflow).toBe('auto');
  expect(document.documentElement).not.toHaveClass('is-booting');
  act(() => jest.advanceTimersByTime(3800));
  expect(sessionStorage.getItem('aiv:booted')).toBeNull();
});

test('keyboard navigation can finish genesis immediately', () => {
  renderCore();
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' })));
  expect(screen.queryByRole('status')).toBeNull();
  expect(document.body.style.overflow).toBe('auto');
  expect(sessionStorage.getItem('aiv:booted')).toBe('1');
});
