import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Generate a short typing click sound using Web Audio API
const createTypingSound = (audioCtx) => {
  if (audioCtx.state === 'suspended') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(1800 + Math.random() * 600, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.05);
};

// Generate a pleasant chime/pop sound when site opens
const createRevealSound = (audioCtx) => {
  if (audioCtx.state === 'suspended') return;
  
  // A major chord chime (C, E, G, C)
  const frequencies = [523.25, 659.25, 783.99, 1046.50];
  
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Sine wave for a pure, clean chime sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Quick attack, smooth decay
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1 / frequencies.length, audioCtx.currentTime + 0.02 + (i * 0.02)); // Slight stagger
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 1.5);
  });
};

export const Preloader = () => {
  const containerRef = useRef(null);
  const loadingBarRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const audioCtxRef = useRef(null);

  const tagline = "Booting the future - Please wait";

  // Initialize audio context
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    if (!isFinished) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFinished]);

  const handleStart = () => {
    const ctx = getAudioCtx();
    // Resume audio context to bypass browser autoplay policies
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    setHasStarted(true);
  };

  useGSAP(() => {
    if (!hasStarted) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Small delay to let the sound finish before removing element
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = 'unset';
        }, 200);
      }
    });

    // Initial state
    gsap.set(loadingBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // 1. Loading bar fills up
    tl.to(loadingBarRef.current, { scaleX: 0.3, duration: 0.5, ease: 'power2.out' })
      .to(loadingBarRef.current, { scaleX: 0.6, duration: 0.8, ease: 'steps(3)' })
      .to(loadingBarRef.current, { scaleX: 1, duration: 0.5, ease: 'power4.inOut' });

    // 2. Typing effect with sound — character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < tagline.length) {
        setDisplayedText(tagline.substring(0, charIndex + 1));
        
        // Play typing sound for visible characters
        const char = tagline[charIndex];
        if (char !== ' ') {
          try {
            const ctx = getAudioCtx();
            createTypingSound(ctx);
          } catch(e) { /* silent fallback */ }
        }
        
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 60); // 60ms per character

    // 3. Wait for typing to finish, then transition out
    const typingDuration = tagline.length * 0.06 + 0.5;
    
    tl.to({}, { duration: typingDuration }, "-=1.0");

    // 4. Fade out text and bar, and trigger the pop sound exactly now!
    tl.call(() => {
        try {
          const ctx = getAudioCtx();
          createRevealSound(ctx);
        } catch(e) { /* silent fallback */ }
      }, null, `+=${0.5}`)
      .to(textRef.current, { opacity: 0, duration: 0.2 }, "<")
      .to(loadingBarRef.current, { opacity: 0, duration: 0.2 }, "<")
      .to(containerRef.current, {
        scale: 2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: 'power3.inOut'
      });

    return () => clearInterval(typeInterval);
  }, { scope: containerRef, dependencies: [hasStarted] });

  if (isFinished) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer"
      onClick={!hasStarted ? handleStart : undefined}
    >
      {!hasStarted ? (
        <div className="flex flex-col items-center animate-pulse">
           <span className="w-12 h-12 rounded-full border border-[#f97316]/50 flex items-center justify-center mb-4 text-[#f97316]">
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
           </span>
           <p className="font-mono text-white tracking-[0.2em] text-sm uppercase">Click to Initialize</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl px-6 flex flex-col items-center">
          {/* Terminal/Typing Text */}
          <div className="h-8 md:h-10 mb-6 overflow-hidden whitespace-nowrap inline-block w-max text-center" ref={textRef}>
            <h1 className="text-xl md:text-3xl font-mono text-white tracking-widest uppercase">
              {displayedText}
              <span ref={cursorRef} className="inline-block w-[3px] h-[1em] bg-[#f97316] ml-1 animate-pulse align-middle"></span>
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
      )}
    </div>
  );
};
