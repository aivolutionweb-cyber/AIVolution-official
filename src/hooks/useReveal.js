import { useEffect } from 'react';

// Scroll-reveal for the mobile homepage. Every element carrying the `reveal`
// class (see index.css) starts faded/offset and gets `is-visible` the first
// time it enters the viewport; the CSS transition does the rest on the
// compositor. One shared IntersectionObserver serves the whole page, each
// element is unobserved after it reveals, and nothing runs on scroll.
//
// `--reveal-i` on an element staggers its delay (80ms per step).

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer = null;
const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      // Bottom edge: fire once ~8% of the viewport has passed under the
      // element, so nothing pops in exactly at the fold. Top edge: extend
      // the root far upwards so anything a fast flick scrolls *past* in a
      // single frame (never intersecting the viewport itself) still counts
      // as seen and reveals, instead of staying invisible above the fold.
      { rootMargin: '10000px 0px -8% 0px', threshold: 0.08 }
    );
  }
  return observer;
};

export const useReveal = (rootRef) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const els = Array.from(root.querySelectorAll('.reveal'));

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const io = getObserver();
    els.forEach((el) => io.observe(el));
    return () => els.forEach((el) => io.unobserve(el));
  }, [rootRef]);
};
