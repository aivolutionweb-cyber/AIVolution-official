// src/App.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import  {NavBar}  from "./components/NavBar";
import { CinematicHero } from "./components/CinematicHero";
import { Skills } from "./components/Skills";
import { EventHighlights } from "./components/EventHighlights";
import { Footer } from "./components/Footer";
import MouseFollower from './components/MouseFollower';
import { Routes, Route, useLocation } from "react-router-dom";
import { Sponsors } from "./components/Sponsors";
import { Faculty } from "./components/Faculty";
import { Team } from "./components/Team";
import { Preloader } from "./components/Preloader";

// Secondary routes are code-split so the homepage bundle doesn't carry the
// Supabase client, registration modal or animate.css. `webpackPrefetch`
// makes the browser fetch these chunks during idle time after first paint,
// so navigation is still instant.
const Events = lazy(() =>
  import(/* webpackPrefetch: true */ "./components/Events").then((m) => ({ default: m.Events }))
);
const TeamPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/TeamPage").then((m) => ({ default: m.TeamPage }))
);
const ResearchPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/ResearchPage").then((m) => ({ default: m.ResearchPage }))
);

// Full-height black placeholder so a route chunk loading never flashes the
// footer up into the viewport.
const RouteFallback = () => <div className="min-h-screen bg-dark" aria-hidden="true" />;

const InteractiveHoverText = () => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--x", `${x}px`);
    e.currentTarget.style.setProperty("--y", `${y}px`);
  };

  return (
    <div 
      className="w-full flex justify-center items-center overflow-hidden select-none bg-black py-10 px-2 cursor-default relative group"
      onMouseMove={handleMouseMove}
    >
      <h1 
        className="font-display font-extrabold text-[12vw] sm:text-[9vw] leading-[0.85] tracking-tighter whitespace-nowrap"
        style={{
          background: "radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%), #f97316 0%, white 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          transition: "transform 0.5s ease-out",
        }}
      >
        AIVOLUTIONS
      </h1>
      {/* Absolute overlay that fades to white when not hovering to hide the effect when mouse leaves */}
      <h1 
        className="font-display font-extrabold text-[12vw] sm:text-[9vw] leading-[0.85] tracking-tighter whitespace-nowrap absolute text-white opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"
      >
        AIVOLUTIONS
      </h1>
    </div>
  );
};

function App() {
  return (
    <div className="relative min-h-screen text-white selection:bg-secondary selection:text-white">
      
      {/* The System Boot Preloader */}
      <Preloader />

      {/* Mouse Follower stays on top */}
      <MouseFollower />

      {/* Main Content - Relative z-10 ensures it sits ABOVE the background */}
      <div className="relative z-10">
        <ScrollToTop />
        <NavBar />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={
              <>
                <CinematicHero />
                <Skills />
                <EventHighlights />
                <Sponsors />
                <Faculty />
                <Team />
                <InteractiveHoverText />
              </>
            } />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/research" element={<ResearchPage />} />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // `html { scroll-behavior: smooth }` would otherwise animate this jump,
    // so a route change visibly scrolls up from wherever the user was.
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