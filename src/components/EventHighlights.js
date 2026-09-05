import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const EventHighlights = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const cylinderRef = useRef(null);
  const cardRefs = useRef([]);
  const hitboxRef = useRef(null);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const events = [
    { title: "Preparation Mantra", date: "Sep 15, 2024", img: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg" },
    { title: "Algosphere", date: "Oct 12, 2024", img: "/assets/events/algosphere/img.png" },
    { title: "Enterprise App Suite", date: "Nov 5, 2024", img: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%203.jpeg" },
    { title: "Orientation 2024", date: "Dec 1, 2024", img: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg" },
    { title: "CODEX Hackathon", date: "Jan 20, 2025", img: "/assets/events/codex_thumbnail.jpg" },
    { title: "Eklavya Techfest", date: "Apr 23-24, 2025", img: null },
    { title: "Hack Horizon", date: "Apr 11-12, 2025", img: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg" },
    { title: "NPTEL Workshop", date: "Jan 22, 2026", img: null },
    { title: "RanchiHacks", date: "Jan 17-18, 2026", img: null },
    { title: "Martinovation", date: "Nov 3-7, 2025", img: null },
  ];

  // Radius large enough that adjacent cards (36deg apart, ~280px wide)
  // clear each other horizontally (radius * sin(36deg) > card width),
  // so they no longer overlap/collide on screen.
  const radius = 480;
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
      onUpdate: function () {
        // Figure out which card is currently facing the camera.
        // `scrub: 1` means rotationY keeps easing toward its resting value for
        // a moment after scrolling stops, so a plain "closest wins" pick can
        // flap between two neighboring cards while it settles. A hysteresis
        // margin means a neighbor only takes over once it's clearly closer,
        // instead of at the slightest wobble.
        const HYSTERESIS = 5; // degrees
        const rotationYNow = gsap.getProperty(cylinderRef.current, "rotationY");
        const diffs = events.map((_, i) => {
          const angle = (360 / events.length) * i;
          const effective = ((angle + rotationYNow) % 360 + 360) % 360;
          return Math.min(effective, 360 - effective);
        });
        let nearest = activeIndexRef.current;
        let smallestDiff = diffs[nearest];
        diffs.forEach((diff, i) => {
          if (diff < smallestDiff - HYSTERESIS) {
            smallestDiff = diff;
            nearest = i;
          }
        });
        if (activeIndexRef.current !== nearest) {
          activeIndexRef.current = nearest;
          setActiveIndex(nearest);
          setIsHovered(false); // active card changed, old hover state no longer applies
        }
      },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 0,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: wrapperRef }); // Scope is the outer wrapper so cleanup targets the pin-spacer correctly

  // Keep a plain, non-3D-transformed hitbox glued to wherever the active card
  // actually renders on screen. Hit-testing pointer events through a chain of
  // nested `preserve-3d` transforms is unreliable across browsers once a card
  // carries its own rotateY (every card except the one at angle 0) — the
  // paint position is correct but the browser's pointer hit-test can miss it.
  // getBoundingClientRect() always reflects the true final on-screen geometry
  // regardless of that, so syncing a flat overlay to it sidesteps the bug
  // entirely instead of fighting it.
  useEffect(() => {
    let frameId;
    const syncHitbox = () => {
      const activeCard = cardRefs.current[activeIndexRef.current];
      const hitbox = hitboxRef.current;
      const section = containerRef.current;
      if (activeCard && hitbox && section) {
        // `section` carries inline `perspective`, which makes it the containing
        // block for any `position: fixed` descendant — so a fixed-position
        // hitbox would resolve against the section box, not the viewport,
        // while getBoundingClientRect() is always viewport-relative. Using
        // `position: absolute` against the section and subtracting its own
        // rect avoids that mismatch (and stays correct through GSAP's pin,
        // which toggles the section's own positioning during scroll).
        const sectionRect = section.getBoundingClientRect();
        const rect = activeCard.getBoundingClientRect();
        hitbox.style.width = `${rect.width}px`;
        hitbox.style.height = `${rect.height}px`;
        hitbox.style.transform = `translate(${rect.left - sectionRect.left}px, ${rect.top - sectionRect.top}px)`;
        // Hide the hitbox if the active card has rotated far enough that it's
        // basically edge-on (mid-transition), so it never sits over the wrong card.
        hitbox.style.visibility = rect.width > 20 ? 'visible' : 'hidden';
      }
      frameId = requestAnimationFrame(syncHitbox);
    };
    frameId = requestAnimationFrame(syncHitbox);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div ref={wrapperRef} className="events-gsap-wrapper">
        <section ref={containerRef} className="h-screen w-full bg-black relative overflow-hidden flex items-center justify-center" style={{ perspective: '2000px' }}>

          {/* 3D Stage */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

            {/* Background Typography (Positioned entirely in the background) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ transform: `translateZ(-800px)` }}
            >
              <h2 className="text-[60px] md:text-[90px] font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-[#f97316] via-[#ea580c] to-black tracking-widest whitespace-nowrap leading-none drop-shadow-2xl">
                EVENTS
              </h2>
            </div>

            {/* 3D Helix Container */}
            <div
              ref={cylinderRef}
              className="relative w-[220px] h-[340px] md:w-[280px] md:h-[440px]"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(-${radius}px)`
              }}
            >
            {events.map((evt, i) => {
              const angle = (360 / events.length) * i;
              // Calculate the Y offset for the helix
              const yOffset = i * yStep;

              const isActive = activeIndex === i;
              const showHover = isActive && isHovered;

              return (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end pb-6 md:pb-8 pointer-events-none"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                    backfaceVisibility: 'hidden', // hides cards when they spin to the back
                  }}
                >

                  {/* Glass Card: image only. Purely visual — no listeners here,
                      see the flat hitbox overlay outside the 3D stage instead. */}
                  <div
                    ref={(el) => (cardRefs.current[i] = el)}
                    className={`relative w-full h-[300px] md:h-[400px] bg-[#0a0a0a]/80 backdrop-blur-md border-2 rounded-xl overflow-hidden z-10 transition-shadow duration-300 ${isActive ? 'border-[#ea580c] shadow-[0_0_35px_rgba(249,115,22,0.55),0_10px_20px_rgba(0,0,0,0.8)]' : 'border-[#f97316]/60 shadow-[0_0_18px_rgba(249,115,22,0.3),0_10px_20px_rgba(0,0,0,0.8)]'} ${showHover ? 'shadow-[0_0_45px_rgba(249,115,22,0.7)]' : ''}`}
                    style={{ perspective: '1200px' }}
                  >
                    {/* Flip wrapper: rotates 180deg on hover to reveal the back face */}
                    <div
                      className="relative w-full h-full transition-transform duration-700 ease-out"
                      style={{ transformStyle: 'preserve-3d', transform: showHover ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Front face: clean image, letterbox filled with a blurred
                          backdrop of the same image instead of flat black so
                          images whose aspect ratio doesn't match the card
                          (landscape posters) don't look small and adrift. */}
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                        {evt.img ? (
                          <>
                            <img src={evt.img} alt="" className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50" />
                            <img src={evt.img} alt={evt.title} className="relative w-full h-full object-contain" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center">
                            <div className="w-10 h-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Back face: blurred image with the event name over it */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        {evt.img ? (
                          <img src={evt.img} alt="" className="absolute inset-0 w-full h-full object-cover blur-sm scale-105" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
                        )}
                        <div className="absolute inset-0 bg-black/55" />
                        <h3 className="relative z-10 text-white font-display font-bold text-xl md:text-2xl text-center px-6 leading-tight drop-shadow-lg">
                          {evt.title}
                        </h3>
                        <span className="relative z-10 mt-3 font-mono text-[10px] md:text-xs tracking-widest text-[#f97316] uppercase">
                          View Event →
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          </div>

          {/* Flat, non-rotated hitbox glued to the active card's real screen rect.
              Lives outside the 3D stage entirely so pointer hit-testing is plain
              2D and always reliable, regardless of the active card's own rotateY. */}
          <div
            ref={hitboxRef}
            onClick={() => navigate('/events')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="absolute top-0 left-0 cursor-pointer z-20"
            style={{ willChange: 'transform' }}
          />

        </section>
    </div>
  );
};
