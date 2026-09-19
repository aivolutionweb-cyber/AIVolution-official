import React, { useRef, useState, useEffect, useCallback } from 'react';

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

// Typing cadence (ms per character).
const TYPE_INTERVAL_MS = 45;
const TAGLINE = "Booting the future - Please wait";

// Timeline (ms). Same beats as the original GSAP sequence, now driven by
// two timers + CSS (see .preloader* rules in index.css) so the boot screen
// doesn't pull the GSAP runtime into the main bundle:
//   0        loading bar starts (1.4s, three eased segments) + typing starts
//   600      the timeline's typing hold begins (bar end 1400 − 800 overlap)
//   HOLD_END hold ends: 600 + chars × 45ms + 300
//   REVEAL   +300ms: chime, text/bar fade (200ms), container zooms out (800ms)
//   DONE     +100ms after the zoom: unmount
const HOLD_END = 600 + TAGLINE.length * TYPE_INTERVAL_MS + 300;
const REVEAL_AT = HOLD_END + 300;
const DONE_AT = REVEAL_AT + 800 + 100;

export const Preloader = () => {
  const [isFinished, setIsFinished] = useState(hasBootedThisSession);
  const [isLeaving, setIsLeaving] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const audioCtxRef = useRef(null);

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
      // Lets page-level entrance animations wait for the reveal
      // (see html.is-booting in index.css).
      document.documentElement.classList.add('is-booting');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.classList.remove('is-booting');
    };
  }, [isFinished]);

  useEffect(() => {
    if (isFinished) return;
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }, [getAudioCtx, isFinished]);

  useEffect(() => {
    if (isFinished) return undefined;

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < TAGLINE.length) {
        setDisplayedText(TAGLINE.substring(0, charIndex + 1));

        const char = TAGLINE[charIndex];
        if (char !== ' ') {
          try {
            createTypingSound(getAudioCtx());
          } catch (e) { /* silent fallback */ }
        }

        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, TYPE_INTERVAL_MS);

    const revealTimer = setTimeout(() => {
      try {
        createRevealSound(getAudioCtx());
      } catch (e) { /* silent fallback */ }
      setIsLeaving(true);
    }, REVEAL_AT);

    const doneTimer = setTimeout(() => {
      markBooted();
      setIsFinished(true);
      document.body.style.overflow = 'unset';
    }, DONE_AT);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [getAudioCtx, isFinished]);

  if (isFinished) return null;

  return (
    <div
      className={`preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black ${isLeaving ? 'preloader--leaving' : ''}`}
    >
      <div className="w-full max-w-2xl md:max-w-3xl px-5 sm:px-6 flex flex-col items-center">
        {/* md:whitespace-nowrap + the wider container keep the full tagline on
            one line at desktop sizes; it used to wrap and the second line was
            clipped by the fixed-height, overflow-hidden wrapper. */}
        <div className="preloader__fade min-h-8 md:h-10 mb-6 overflow-hidden text-center w-full">
          <h1 className="text-base sm:text-xl md:text-3xl font-mono text-white tracking-widest uppercase break-words md:whitespace-nowrap leading-snug">
            {displayedText}
            <span className="inline-block w-[3px] h-[1em] bg-[#f97316] ml-1 animate-pulse align-middle"></span>
          </h1>
        </div>

        <div className="preloader__fade w-full h-1 bg-surface border border-gridline overflow-hidden">
          <div className="preloader__bar h-full w-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(255,59,0,0.8)]"></div>
        </div>

        <div className="mt-4 text-[10px] font-mono text-muted tracking-widest uppercase animate-pulse">
            INITIALIZING_SYSTEM_CORE...
        </div>
      </div>
    </div>
  );
};
