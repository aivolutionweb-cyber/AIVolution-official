import { createPortal } from 'react-dom';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const SESSION_KEY = 'aiv:booted';
const hasBooted = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
};
export const Preloader = ({ children }) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [phase, setPhase] = useState(() => hasBooted() || reducedMotion ? 'skipped' : 'forming');
  const rootRef = useRef(null);
  const [veilHost, setVeilHost] = useState(null);
  const forming = phase === 'forming' && !reducedMotion;

  useLayoutEffect(() => {
    if (reducedMotion && phase === 'forming') setPhase('skipped');
  }, [reducedMotion, phase]);

  useLayoutEffect(() => {
    if (!forming) return undefined;
    setVeilHost(rootRef.current.closest('[data-core-intro]'));
    const previousOverflow = document.body.style.overflow;
    const html = document.documentElement;
    html.classList.add('is-booting');
    document.body.style.overflow = 'hidden';
    const place = () => {
      const bounds = rootRef.current.getBoundingClientRect();
      rootRef.current.style.setProperty('--genesis-y', `${window.innerHeight / 2 - bounds.top - bounds.height / 2}px`);
    };
    place();
    const finish = (skipped = false) => {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* Storage is optional. */ }
      setPhase(skipped ? 'skipped' : 'settled');
    };
    const timer = window.setTimeout(() => finish(), 3800);
    const onKey = (event) => {
      if (event.key === 'Tab' || event.key === 'Escape') finish(true);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
      document.body.style.overflow = previousOverflow;
      html.classList.remove('is-booting');
    };
  }, [forming]);

  return (
    <div ref={rootRef} className={`core-system ${phase !== 'skipped' && !reducedMotion ? 'core-system--introduced' : ''}`}>
      {forming && veilHost && createPortal(<div className="genesis-screen"><p role="status">Initializing AIvolutions</p></div>, veilHost)}
      <div className="core-placement">{children}</div>
    </div>
  );
};
