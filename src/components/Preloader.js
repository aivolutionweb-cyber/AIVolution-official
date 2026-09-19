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

// The boot sequence plays once per browser tab. Reloads and in-site
// navigation within the same session skip straight to the content.
const SESSION_KEY = 'aiv:booted';
const hasBootedThisSession = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
};
const markBooted = () => {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage unavailable */ }
};

// Typing cadence (ms per character). Drives both the visible text and the
// timeline's hold, so the two never drift apart.
const TYPE_INTERVAL_MS = 45;

export const Preloader = () => {
  const containerRef = useRef(null);
  const loadingBarRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [isFinished, setIsFinished] = useState(hasBootedThisSession);
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

  useEffect(() => {
    if (isFinished) return;
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }, [getAudioCtx, isFinished]);

  useGSAP(() => {
    if (isFinished) return;

    const tl = gsap.timeline({
      onComplete: () => {
        markBooted();
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = 'unset';
        }, 100);
      }
    });

    gsap.set(loadingBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

    tl.to(loadingBarRef.current, { scaleX: 0.3, duration: 0.4, ease: 'power2.out' })
      .to(loadingBarRef.current, { scaleX: 0.6, duration: 0.6, ease: 'steps(3)' })
      .to(loadingBarRef.current, { scaleX: 1, duration: 0.4, ease: 'power4.inOut' });

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < tagline.length) {
        setDisplayedText(tagline.substring(0, charIndex + 1));

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
    }, TYPE_INTERVAL_MS);

    const typingDuration = tagline.length * (TYPE_INTERVAL_MS / 1000) + 0.3;

    tl.to({}, { duration: typingDuration }, "-=0.8");

    tl.call(() => {
        try {
          const ctx = getAudioCtx();
          createRevealSound(ctx);
        } catch(e) { /* silent fallback */ }
      }, null, `+=${0.3}`)
      .to(textRef.current, { opacity: 0, duration: 0.2 }, "<")
      .to(loadingBarRef.current, { opacity: 0, duration: 0.2 }, "<")
      // Scale + opacity only: both are compositor-driven. The previous
      // animated blur() re-rasterised a full-screen layer every frame for no
      // visible gain (the content is already faded out by this point).
      .to(containerRef.current, {
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut'
      });

    return () => clearInterval(typeInterval);
  }, { scope: containerRef });

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="w-full max-w-2xl md:max-w-3xl px-5 sm:px-6 flex flex-col items-center">
        {/* md:whitespace-nowrap + the wider container keep the full tagline on
            one line at desktop sizes; it used to wrap and the second line was
            clipped by the fixed-height, overflow-hidden wrapper. */}
        <div className="min-h-8 md:h-10 mb-6 overflow-hidden text-center w-full" ref={textRef}>
          <h1 className="text-base sm:text-xl md:text-3xl font-mono text-white tracking-widest uppercase break-words md:whitespace-nowrap leading-snug">
            {displayedText}
            <span ref={cursorRef} className="inline-block w-[3px] h-[1em] bg-[#f97316] ml-1 animate-pulse align-middle"></span>
          </h1>
        </div>

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
