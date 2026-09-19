import React, { useEffect, useId, useMemo, useRef } from 'react';
import { Preloader } from './Preloader';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Two connected SVG paths form the front/back of a folded membrane. Desktop
// cycles through precomputed folds; mobile only transforms the mesh.
const createMembrane = (mobile, phase = 0) => {
  const rows = mobile ? 22 : 32;
  const columns = mobile ? 30 : 44;
  const steps = mobile ? 40 : 64;
  const paths = [[], []];
  const project = (latitude, longitude) => {
    // Every meridian must meet at the same smooth pole, regardless of phase.
    // The squared taper also removes longitude-dependent slopes at each cap.
    const poleTaper = Math.cos(latitude) ** 2;
    const fold = (Math.sin(longitude * 3 + latitude * 4 + phase) * 0.105
      + Math.cos(longitude * 5 - latitude * 3 - phase) * 0.06) * poleTaper;
    const radius = 119 * (1 + fold);
    const x = radius * Math.cos(latitude) * Math.cos(longitude);
    const y = radius * Math.sin(latitude) + Math.sin(longitude * 2 + latitude * 3 + phase) * 5 * poleTaper;
    const z = radius * Math.cos(latitude) * Math.sin(longitude);
    const perspective = 1 + z / 700;
    return `${(160 + (x * 0.97 - y * 0.24) * perspective).toFixed(1)} ${(160 + (y * 0.97 + x * 0.24) * perspective).toFixed(1)}`;
  };
  // Latitudes are split at the silhouette so the far surface stays faint.
  for (let row = 1; row < rows; row++) {
    const latitude = -Math.PI / 2 + Math.PI * row / rows;
    for (let side = 0; side < 2; side++) {
      for (let step = 0; step <= steps / 2; step++) {
        const longitude = side * Math.PI + Math.PI * 2 * step / steps;
        paths[side].push(`${step === 0 ? 'M' : 'L'}${project(latitude, longitude)}`);
      }
    }
  }
  // Meridians connect the strands into an actual continuous mesh.
  for (let column = 0; column < columns; column++) {
    const longitude = Math.PI * 2 * column / columns;
    const side = column < columns / 2 ? 0 : 1;
    for (let step = 0; step <= steps / 2; step++) {
      const latitude = -Math.PI / 2 + Math.PI * 2 * step / steps;
      paths[side].push(`${step === 0 ? 'M' : 'L'}${project(latitude, longitude)}`);
    }
  }
  return paths.map((segments) => segments.join(''));
};

export const LivingCore = ({ mobile = false }) => {
  const gradientId = useId();
  const membrane = useMemo(() => {
    const resting = createMembrane(mobile);
    const poses = mobile ? [resting] : Array.from({ length: 8 }, (_, i) =>
      i === 0 ? resting : createMembrane(false, Math.PI * 2 * i / 8));
    // Close the phase circle exactly: no jump, rewind, or finite intro playback.
    return { resting, cycles: [0, 1].map((side) =>
      [...poses, resting].map((pose) => pose[side]).join(';')) };
  }, [mobile]);
  const rootRef = useRef(null);
  const pointerRef = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const root = rootRef.current;
    let visible = true;
    const onVisibility = () => {
      const paused = !visible || document.hidden;
      root.classList.toggle('core-paused', paused);
      const surface = root.querySelector('.core-surface');
      if (paused) surface.pauseAnimations?.();
      else surface.unpauseAnimations?.();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      onVisibility();
    });
    observer.observe(root);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (mobile || reducedMotion || !finePointer) return undefined;
    const root = rootRef.current;
    const pointer = pointerRef.current;
    const hero = root.closest('[data-core-hero]');
    let bounds;
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const settle = () => {
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      pointer.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${-y * 0.25}deg) rotateY(${x * 0.25}deg)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.03) frame = requestAnimationFrame(settle);
      else frame = 0;
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(settle); };
    const reset = () => {
      bounds = null;
      targetX = targetY = 0;
      root.classList.remove('core-near');
      wake();
    };
    const move = (event) => {
      if (document.documentElement.classList.contains('is-booting')) return;
      // Read once per entry/scroll/resize, never on every animation frame.
      if (!bounds) bounds = root.getBoundingClientRect();
      const dx = event.clientX - bounds.left - bounds.width / 2;
      const dy = event.clientY - bounds.top - bounds.height / 2;
      const distance = Math.hypot(dx, dy);
      targetX = dx / Math.max(distance, 1) * Math.min(distance * 0.035, 12);
      targetY = dy / Math.max(distance, 1) * Math.min(distance * 0.035, 12);
      root.classList.toggle('core-near', distance < bounds.width * 0.7);
      wake();
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    window.addEventListener('resize', reset);
    window.addEventListener('scroll', reset, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      window.removeEventListener('resize', reset);
      window.removeEventListener('scroll', reset);
      pointer.style.transform = '';
      root.classList.remove('core-near');
    };
  }, [mobile, reducedMotion, finePointer]);

  return (
    <Preloader>
      <div ref={rootRef} className={`living-core ${mobile ? 'living-core--mobile' : ''}`} aria-hidden="true">
        <div ref={pointerRef} className="core-pointer">
          <div className="core-breath">
            <div className="core-atmosphere" />
            <div className="core-proximity" />
            <div className="core-volume">
              <svg className="core-surface" viewBox="0 0 320 320" fill="none">
                <defs>
                  <linearGradient id={`${gradientId}-mesh`} x1="0.15" y1="0" x2="0.85" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#ffe0a3" />
                    <stop offset="0.32" stopColor="#f99a3c" />
                    <stop offset="0.65" stopColor="#c35e4b" />
                    <stop offset="1" stopColor="#ffd08b" />
                  </linearGradient>
                </defs>
                {[1, 0].map((side) => (
                  <path key={side} className={`core-mesh-path core-mesh-path--${side}`} strokeLinecap="round" strokeLinejoin="round" d={membrane.resting[side]} stroke={`url(#${gradientId}-mesh)`}
                    strokeWidth={mobile ? 0.85 : 0.65} opacity={side === 0 ? 0.78 : 0.2}>
                    {!mobile && !reducedMotion && <animate attributeName="d" dur="11s" repeatCount="indefinite"
                      values={membrane.cycles[side]} calcMode="linear" />}
                  </path>
                ))}
              </svg>
            </div>
            {[0, 1, ...(mobile ? [] : [2])].map((layer) => (
              <div className={`core-orbit core-orbit--${layer}`} key={layer}>
                <div className="core-precession">
                  <div className="core-orbit-spin">
                    <svg viewBox="0 0 320 320" fill="none">
                      {layer === 0 && <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                        <stop offset="0" stopColor="#9a3412" />
                        <stop offset="0.42" stopColor="#f97316" />
                        <stop offset="0.64" stopColor="#fff6df" />
                        <stop offset="1" stopColor="#ffd6a0" />
                      </linearGradient></defs>}
                      <path className="core-material" style={layer === 0 ? { stroke: `url(#${gradientId})` } : undefined} pathLength="1" d={[
                        'M 160,36 C 239,19 289,101 274,174 C 267,247 198,286 125,270 C 59,261 26,201 43,133 C 54,73 94,49 160,36 Z',
                        'M 165,48 C 233,51 253,84 247,153 C 242,211 188,274 129,260 C 72,251 57,191 74,128 C 87,81 124,45 165,48 Z',
                        'M 161,22 C 218,39 287,72 294,146 C 303,213 226,261 155,283 C 86,299 26,243 29,176 C 32,108 104,7 161,22 Z',
                      ][layer]} />
                    </svg>
                    <i className="core-traveller" />
                  </div>
                </div>
              </div>
            ))}
            <div className="core-seed" />
            <div className="core-dust">
              {Array.from({ length: mobile ? 3 : 6 }, (_, i) => (
                <i key={i} style={{ '--particle': i, '--angle': `${i * 137.5}deg` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Preloader>
  );
};
