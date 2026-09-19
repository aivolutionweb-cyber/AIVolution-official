import { useEffect, useState } from 'react';

// True while the referenced element intersects the viewport (plus
// `rootMargin`). Used to pause decorative CSS animations that are scrolled
// out of view so they don't keep the compositor busy for the whole page.
export const useInView = (ref, rootMargin = '0px') => {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
};
