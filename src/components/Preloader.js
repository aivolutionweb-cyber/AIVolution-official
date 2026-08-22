import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Preloader = () => {
  const containerRef = useRef(null);
  const loadingBarRef = useRef(null);
  const textRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsFinished(true);
        document.body.style.overflow = 'unset';
      }
    });

    // Initial state
    gsap.set(loadingBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // 1. Loading bar fills up rapidly but inconsistently (like a real system boot)
    tl.to(loadingBarRef.current, { scaleX: 0.3, duration: 0.5, ease: 'power2.out' })
      .to(loadingBarRef.current, { scaleX: 0.6, duration: 0.8, ease: 'steps(3)' })
      .to(loadingBarRef.current, { scaleX: 1, duration: 0.5, ease: 'power4.inOut' });

    // 2. Typing effect for the text (reveal width)
    tl.from(textRef.current, { 
      width: 0, 
      duration: 2.2, // Adjusted for the sweet spot
      ease: 'steps(32)', // matches the character count
    }, "-=1.0");

    // 3. The Transition (scale, blur, and fade out smoothly without white flash)
    tl.to(textRef.current, {
        opacity: 0,
        duration: 0.2
    }, "+=0.5")
    .to(loadingBarRef.current, {
        opacity: 0,
        duration: 0.2
    }, "<")
    .to(containerRef.current, {
        scale: 2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: 'power3.inOut'
    });

  }, { scope: containerRef });

  if (isFinished) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <div className="w-full max-w-2xl px-6 flex flex-col items-center">
        
        {/* Terminal/Typing Text */}
        <div className="h-8 md:h-10 mb-6 overflow-hidden whitespace-nowrap inline-block w-max text-center border-r-4 border-primary animate-pulse" ref={textRef}>
          <h1 className="text-xl md:text-3xl font-mono text-white tracking-widest uppercase">
            AIVolution - The AI Club of MAIT
          </h1>
        </div>

        {/* Loading Bar */}
        <div className="w-full h-1 bg-surface border border-gridline overflow-hidden">
          <div ref={loadingBarRef} className="h-full w-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(255,59,0,0.8)]"></div>
        </div>
        
        <div className="mt-4 text-[10px] font-mono text-muted tracking-widest uppercase animate-pulse">
            INITIALIZING_SYSTEM_CORE...
        </div>
      </div>
    </div>
  );
};
