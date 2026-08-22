import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const EventHighlights = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const cylinderRef = useRef(null);

  const events = [
    { title: "Preparation Mantra", date: "Sep 15, 2024", img: "https://picsum.photos/seed/ev1/400/300" },
    { title: "Algosphere", date: "Oct 12, 2024", img: null },
    { title: "Enterprise App Suite", date: "Nov 5, 2024", img: "https://picsum.photos/seed/ev3/400/300" },
    { title: "Orientation 2024", date: "Dec 1, 2024", img: null },
    { title: "CODEX Hackathon", date: "Jan 20, 2025", img: "https://picsum.photos/seed/ev5/400/300" },
    { title: "Eklavya Techfest", date: "Apr 23-24, 2025", img: null },
    { title: "Hack Horizon", date: "Apr 11-12, 2025", img: "https://picsum.photos/seed/ev7/400/300" },
    { title: "NPTEL Workshop", date: "Jan 22, 2026", img: null },
    { title: "RanchiHacks", date: "Jan 17-18, 2026", img: "https://picsum.photos/seed/ev9/400/300" },
    { title: "Martinovation", date: "Nov 3-7, 2025", img: null },
  ];

  const radius = 400; 
  // The vertical step between each card to create the DNA/Helix spiral effect
  const yStep = 50; 
  const totalY = events.length * yStep;

  useGSAP(() => {
    // Rotate the entire cylinder as the user scrolls, AND move it vertically
    // to keep the active card in the center of the screen
    gsap.to(cylinderRef.current, {
      rotationY: -360,
      y: -totalY,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000", // Scrolling distance
        scrub: 1, // Smooth scrubbing
        pin: true,
        anticipatePin: 1,
      }
    });
  }, { scope: wrapperRef }); // Scope is the outer wrapper so cleanup targets the pin-spacer correctly

  return (
    <div ref={wrapperRef} className="events-gsap-wrapper">
        <section ref={containerRef} className="h-screen w-full bg-black relative overflow-hidden flex items-center justify-center border-b border-gridline" style={{ perspective: '2000px' }}>
          
          {/* 3D Stage */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Background Typography (Positioned entirely in the background) */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ transform: `translateZ(-800px)` }}
            >
              <h2 className="text-[25vw] md:text-[8vw] font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-[#f97316] via-[#ea580c] to-black tracking-widest whitespace-nowrap leading-none drop-shadow-2xl">
                EVENTS
              </h2>
            </div>
            
            {/* 3D Helix Container */}
            <div 
              ref={cylinderRef} 
              className="relative w-[220px] h-[360px] md:w-[280px] md:h-[480px]"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: `translateZ(-${radius}px)`
              }}
            >
            {events.map((evt, i) => {
              const angle = (360 / events.length) * i;
              // Calculate the Y offset for the helix
              const yOffset = i * yStep;
              
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end pb-6 md:pb-8"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                    backfaceVisibility: 'hidden', // hides cards when they spin to the back
                  }}
                >
                  
                  {/* Event photos temporarily removed per user request */}

                  {/* Glass Text Card */}
                  <div className="w-full h-[220px] md:h-[300px] bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 border-t-[#f97316] border-t-2 rounded-xl flex flex-col justify-center items-center text-center p-4 md:p-6 shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10 hover:border-t-[#ea580c] transition-colors">
                    {/* Optional small top accent line inside */}
                    <div className="w-8 md:w-10 h-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full mb-3 md:mb-4"></div>
                    <h3 className="text-lg md:text-2xl font-display font-bold text-white mb-2 md:mb-3 leading-tight">{evt.title}</h3>
                    <p className="font-mono text-[10px] md:text-[12px] text-gray-400 tracking-widest uppercase">{evt.date}</p>
                  </div>

                </div>
              );
            })}
          </div>

          </div>
        </section>
    </div>
  );
};