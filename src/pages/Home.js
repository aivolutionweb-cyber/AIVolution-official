import React, { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

// The two homepage trees are separate chunks so a phone never downloads
// GSAP, ScrollTrigger or react-multi-carousel (they're only used by the
// desktop sections), and desktop never carries the mobile components.
const HomeDesktop = lazy(() => import(/* webpackChunkName: "home-desktop" */ './HomeDesktop'));
const HomeMobile = lazy(() => import(/* webpackChunkName: "home-mobile" */ './HomeMobile'));

// Full-height black placeholder so the chunk loading never flashes the
// footer up into the viewport.
const Fallback = () => <div className="min-h-screen bg-black" aria-hidden="true" />;

export const Home = () => {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<Fallback />}>
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
    </Suspense>
  );
};
