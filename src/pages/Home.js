import React, { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

const HomeDesktop = lazy(() => import(/* webpackChunkName: "home-desktop" */ './HomeDesktop'));
const HomeMobile = lazy(() => import(/* webpackChunkName: "home-mobile" */ './HomeMobile'));

const Fallback = () => <div className="min-h-screen bg-black" aria-hidden="true" />;

export const Home = () => {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<Fallback />}>
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
    </Suspense>
  );
};
