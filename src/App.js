import React, { useState, useEffect, lazy, Suspense } from 'react';
import  {NavBar}  from "./components/NavBar";
import { Footer } from "./components/Footer";
import MouseFollower from './components/MouseFollower';
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";

const Events = lazy(() =>
  import(/* webpackPrefetch: true */ "./components/Events").then((m) => ({ default: m.Events }))
);
const TeamPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/TeamPage").then((m) => ({ default: m.TeamPage }))
);
const ResearchPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/ResearchPage").then((m) => ({ default: m.ResearchPage }))
);

const RouteFallback = () => <div className="min-h-screen bg-dark" aria-hidden="true" />;

function App() {
  return (
    <div className="relative min-h-screen text-white selection:bg-secondary selection:text-white">
      <MouseFollower />

      <div className="relative z-10">
        <ScrollToTop />
        <NavBar />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/research" element={<ResearchPage />} />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>

      <ScrollToTopButton />
    </div>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Temporarily disable smooth scroll during route transitions
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 p-3 rounded-full bg-white text-black shadow-lg shadow-white/20 transition-[opacity,transform,box-shadow] duration-300 hover:scale-110 hover:shadow-white/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:ring-offset-black min-h-[48px] min-w-[48px] flex items-center justify-center ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default App;