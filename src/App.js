import React, { useState, useEffect, lazy, Suspense } from 'react';
import  {NavBar}  from "./components/NavBar";
import { Footer } from "./components/Footer";
import MouseFollower from './components/MouseFollower';
import { Preloader } from "./components/Preloader";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import "./styles/notebook.css";
import { ScrollTrigger } from "./lib/gsap";

const Events = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/EventsPage").then((m) => ({ default: m.EventsPage }))
);
const TeamPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/TeamPage").then((m) => ({ default: m.TeamPage }))
);
const ResearchPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/ResearchPage").then((m) => ({ default: m.ResearchPage }))
);
const CodexPage = lazy(() =>
  import(/* webpackPrefetch: true */ "./pages/CodexPage").then((m) => ({ default: m.CodexPage }))
);

// The 3D merch tee in the bottom-right corner of the main pages. Loaded separately so three.js
// doesn't slow down the first paint.
const TeeFloatingWidget = lazy(() =>
  import("./components/tee/TeeFloatingWidget").then((m) => ({ default: m.TeeFloatingWidget }))
);

const RouteFallback = ({ paper }) => <div className={`min-h-screen ${paper ? "bg-paper" : "bg-dark"}`} aria-hidden="true" />;

function App() {
  const location = useLocation();
  const isImmersive = location.pathname === "/team" || location.pathname === "/events";
  const variant = "paper";
  return (
    <div className={`relative min-h-screen ${variant === "paper" ? "text-ink bg-paper" : "text-white"}`}>
      <Preloader />
      <MouseFollower />

      <div className="relative z-10">
        <ScrollToTop />
        {!isImmersive && <NavBar variant={variant} />}

        <Suspense fallback={<RouteFallback paper={variant === "paper"} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/codex" element={<CodexPage />} />
            <Route path="/research" element={<ResearchPage />} />
          </Routes>
        </Suspense>

        {!isImmersive && <Footer variant={variant} />}

        {/* bottom-right on the main pages (not the immersive /team and /events pages, nor /codex);
            the Preloader (z-index 9990) covers it while it plays */}
        {!isImmersive && location.pathname !== "/codex" && (
          <Suspense fallback={null}>
            <TeeFloatingWidget />
          </Suspense>
        )}
      </div>

      {!isImmersive && <ScrollToTopButton paper={variant === "paper"} />}
    </div>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // New route → start at the top. ScrollTrigger remembers the last scroll position and
    // restores it on its next refresh, so that memory is cleared first (GSAP's SPA advice);
    // the jump is instant so the page's smooth-scroll setting doesn't animate it.
    ScrollTrigger.clearScrollMemory("manual");
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    root.style.scrollBehavior = prev;
  }, [pathname]);
  return null;
};

const ScrollToTopButton = ({ paper = false }) => {
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
      className={`fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-50 p-3 rounded-full ${paper ? "bg-ink text-paper shadow-black/20" : "bg-white text-black shadow-white/20 hover:shadow-white/40"} shadow-lg transition-[opacity,transform,box-shadow] duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 focus-visible:ring-offset-black min-h-[48px] min-w-[48px] flex items-center justify-center ${
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