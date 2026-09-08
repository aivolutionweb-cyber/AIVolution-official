// src/App.js
import React, { useState, useEffect } from 'react';
import  {NavBar}  from "./components/NavBar";
import { CinematicHero } from "./components/CinematicHero";
import { Skills } from "./components/Skills";
import { EventHighlights } from "./components/EventHighlights";
import { Footer } from "./components/Footer";
import MouseFollower from './components/MouseFollower';
import { Routes, Route, useLocation } from "react-router-dom";
import { Events } from "./components/Events";
import { Sponsors } from "./components/Sponsors";
import { Faculty } from "./components/Faculty";
import { Team } from "./components/Team";
import { TeamPage } from "./pages/TeamPage";
import { Preloader } from "./components/Preloader";

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

        <Routes>
          <Route path="/" element={
            <>
              <CinematicHero />
              <Skills />
              <EventHighlights />
              <Sponsors />
              <Faculty />
              <Team />
              <div className="w-full flex justify-center items-center overflow-hidden select-none pointer-events-none bg-black">
                <h1 className="font-display font-extrabold text-[9vw] leading-[0.75] text-white tracking-tighter whitespace-nowrap">
                  AIVOLUTIONS
                </h1>
              </div>
            </>
          } />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/events" element={<Events />} />
        </Routes>
        
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
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
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
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white text-black shadow-lg shadow-white/20 transition-all duration-300 hover:scale-110 hover:shadow-white/40 active:scale-95 ${
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