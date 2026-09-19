import { useEffect, useState } from 'react';

// Below the `lg` breakpoint the homepage swaps its pinned / 3D desktop
// sections for purpose-built mobile layouts. Phones and portrait tablets get
// the lighter tree; anything wider keeps the desktop experience untouched.
export const MOBILE_QUERY = '(max-width: 1023px)';

const canMatch = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const getMatch = (query) => (canMatch() ? window.matchMedia(query).matches : false);

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => getMatch(query));

  useEffect(() => {
    if (!canMatch()) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    // Safari < 14 only has the deprecated addListener API.
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);

  return matches;
};

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
