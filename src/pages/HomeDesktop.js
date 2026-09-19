import React from 'react';
import { CinematicHero } from '../components/CinematicHero';
import { Skills } from '../components/Skills';
import { EventHighlights } from '../components/EventHighlights';
import { Sponsors } from '../components/Sponsors';
import { Faculty } from '../components/Faculty';
import { Team } from '../components/Team';

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

// Homepage for viewports >= 1024px: the pinned GSAP hero, horizontal
// department track, 3D event helix and sponsor ring. Unchanged from the
// original single-tree App.js; only moved here so it can be code-split
// away from the mobile homepage.
const HomeDesktop = () => (
  <>
    <CinematicHero />
    <Skills />
    <EventHighlights />
    <Sponsors />
    <Faculty />
    <Team />
    <InteractiveHoverText />
  </>
);

export default HomeDesktop;
