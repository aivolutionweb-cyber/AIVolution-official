import React, { useRef, useState, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT_TAGLINE, ABOUT_TEXT, DIRECTIVES } from '../data/about';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const hoverRevealRef = useRef(null);
  
  // Animation Refs
  const coreRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const whoAreWeRef = useRef(null);
  const whoAreWeWordsRef = useRef([]);
  const visionContainerRef = useRef(null);
  const visionCardsRef = useRef([]);

  // Particle positions are randomised once. Generating them inline in render
  // re-rolled every particle (and its CSS animation) on each re-render.
  const particles = useMemo(
    () =>
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 3}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    []
  );

  useGSAP(() => {
    // Continuous idle animation for the core rings (runs on all screen sizes)
    const ringSpin1 = gsap.to(ring1Ref.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    const ringSpin2 = gsap.to(ring2Ref.current, {
        rotate: -360,
        duration: 15,
        repeat: -1,
        ease: "none"
    });

    // The rings only need to spin while the hero is on screen. Once the user
    // has scrolled past, keep the two infinite tweens from ticking forever.
    const setRingsActive = (active) => {
      ringSpin1.paused(!active);
      ringSpin2.paused(!active);
    };
    const visibility = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setRingsActive(self.isActive),
    });
    setRingsActive(visibility.isActive);

    // Skip pinned scroll animation on small screens — show hero content statically
    const isMobile = window.innerWidth < 640;

    if (!isMobile) {
    const getPinDistance = () => (window.innerWidth < 1024 ? 4500 : 6000);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${getPinDistance()}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 2,
      }
    });

    // Initial state of the core is hidden and small
    gsap.set(coreRef.current, { scale: 0, opacity: 0 });

    // SCENE 1: Typography fades out, Orb appears and scales up to normal size (0 to 1 seconds)
    tl.to(titleRef.current, { y: -100, opacity: 0, duration: 1 }, 0)
      .to(subtitleRef.current, { y: 100, opacity: 0, duration: 1 }, 0)
      .to(coreRef.current, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }, 0);

    // SCENE 2: The Core Expands and Engulfs (1 to 3 seconds)
    tl.to(coreRef.current, { 
        scale: 40, 
        opacity: 0, 
        duration: 2,
        ease: "power2.in" 
    }, 1);

    // SCENE 3: Who Are We fades in and out
    tl.fromTo(whoAreWeRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        2.5
    ).fromTo(whoAreWeWordsRef.current,
        { opacity: 0, y: 15, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.03, duration: 0.8, ease: "power2.out" },
        3.0
    ).to(whoAreWeRef.current,
        { opacity: 0, scale: 1.05, duration: 1 },
        6.5
    );

    // SCENE 4: Directives Slide Up
    tl.fromTo(visionContainerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        7.5
    ).fromTo(visionCardsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1 },
        8.0
    );

    // Hold the final state
    tl.to({}, { duration: 1 });
    } else {
      // Mobile: show all hero content statically, no scroll animation
      gsap.set(coreRef.current, { scale: 1, opacity: 1 });
      gsap.set(titleRef.current, { y: 0, opacity: 1 });
      gsap.set(subtitleRef.current, { y: 0, opacity: 1 });
      gsap.set(whoAreWeRef.current, { opacity: 1, scale: 1 });
      gsap.set(whoAreWeWordsRef.current, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(visionContainerRef.current, { opacity: 1, y: 0 });
      gsap.set(visionCardsRef.current, { opacity: 1, y: 0 });
    }

  }, { scope: wrapperRef }); // Scope to outer wrapper

  // Hover Reveal Mouse Tracker — only listens while a preview is showing, so
  // the global mousemove handler (two GSAP tweens per event) isn't running
  // for the whole page lifetime.
  useEffect(() => {
    const el = hoverRevealRef.current;
    if (!el || !hoveredImage) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredImage]);

  return (
    <div ref={wrapperRef} className="hero-gsap-wrapper">
        <div ref={containerRef} className="h-screen w-full bg-black overflow-hidden relative">

          {/* --- AMBIENT GLOW --- */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-[#f97316]/20 to-[#ea580c]/5 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
          </div>

          {/* --- BACKGROUND TYPOGRAPHY --- */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
              <h1 className="text-[15vw] font-display font-extrabold text-white whitespace-nowrap tracking-tighter select-none">
                  AIVOLUTION
              </h1>
          </div>

          {/* --- PARTICLES --- */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              {particles.map((style, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-[#f97316] rounded-full animate-bounce"
                    style={style}
                  />
              ))}
          </div>

          {/* --- THE AI CORE (Centerpiece) --- */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            
            <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-8 sm:mb-12 tracking-tight text-center px-4 sm:px-6 mix-blend-difference z-30 leading-tight">
                Shaping the Future <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">of Intelligence.</span>
            </h1>

            {/* The Glowing Morphing Orb */}
            <div ref={coreRef} className="absolute flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                {/* Fluid Ring 1 (Orange) */}
                <div ref={ring1Ref} className="absolute w-[30vh] h-[30vh] border border-[#f97316]/40 shadow-[0_0_80px_rgba(249,115,22,0.4)] rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"></div>
                
                {/* Fluid Ring 2 (Darker Orange) */}
                <div ref={ring2Ref} className="absolute w-[25vh] h-[25vh] border-2 border-[#ea580c]/60 shadow-[0_0_50px_rgba(234,88,12,0.5)] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] mix-blend-screen"></div>
                
                {/* Inner Core Glow */}
                <div className="absolute w-[15vh] h-[15vh] bg-gradient-to-tr from-[#f97316] to-[#c2410c] rounded-full shadow-[0_0_100px_rgba(249,115,22,0.8)] blur-md animate-pulse"></div>
                
                {/* Intense Center Spot */}
                <div className="absolute w-[5vh] h-[5vh] bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,1)] blur-sm"></div>
            </div>

            {/* Viewport-relative offset so the subtitle keeps clear of the
                "scroll down" hint on short laptop screens (720p). */}
            <p ref={subtitleRef} className="text-gray-400 font-mono tracking-widest text-xs sm:text-sm uppercase mt-40 sm:mt-[28vh] z-30 mix-blend-difference text-center px-4">
                Welcome to the Core
            </p>
          </div>

          {/* --- OVERLAYS --- */}

          {/* Who Are We Overlay (Minimal & Sophisticated) */}
          <div ref={whoAreWeRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-4 sm:px-6 opacity-0 pointer-events-none overflow-y-auto py-8">

            {/* Typography Core - Minimal */}
            <div className="max-w-5xl w-full text-center relative z-10 p-2 sm:p-4 md:p-12 pointer-events-auto my-auto">
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight drop-shadow-2xl mb-2 leading-none">
                    WHO ARE WE
                </h2>

                <div className="mb-6 sm:mb-8 text-[#f97316] font-mono text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase">
                    {ABOUT_TAGLINE}
                </div>

                <p className="max-w-4xl mx-auto text-white/90 font-light text-base sm:text-lg md:text-2xl leading-relaxed md:leading-[1.8] flex flex-wrap justify-center gap-x-2 gap-y-1 max-h-[45vh] sm:max-h-none overflow-y-auto sm:overflow-visible px-1">
                    {ABOUT_TEXT.split(" ").map((word, i) => {
                        let hoverImg = null;
                        const w = word.toLowerCase();
                        if (w.includes("masterclass")) hoverImg = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop"; 
                        if (w.includes("webinar")) hoverImg = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop"; 
                        if (w.includes("hackathon")) hoverImg = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop"; 
                        if (w.includes("quizz")) hoverImg = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop"; 

                        return (
                            <span 
                                key={i} 
                                ref={el => whoAreWeWordsRef.current[i] = el} 
                                className={`inline-block opacity-0 ${hoverImg ? 'text-white cursor-pointer hover:text-[#f97316] transition-colors duration-300 relative z-50' : ''}`}
                                onMouseEnter={(e) => {
                                    if (!hoverImg) return;
                                    gsap.set(hoverRevealRef.current, { x: e.clientX, y: e.clientY });
                                    setHoveredImage(hoverImg);
                                }}
                                onMouseLeave={() => hoverImg && setHoveredImage(null)}
                            >
                                {word}
                            </span>
                        );
                    })}
                </p>
            </div>
          </div>

          {/* Vision Overlay */}
          <div ref={visionContainerRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-4 sm:px-6 opacity-0 pointer-events-none overflow-y-auto py-6">
            
            <div className="mb-6 sm:mb-10 md:mb-12 text-center mt-0 sm:mt-[-10vh] shrink-0">
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight drop-shadow-2xl mb-2 leading-none">
                    CORE DIRECTIVES
                </h2>
                <span className="font-mono text-[#f97316] text-[0.65rem] sm:text-xs tracking-widest uppercase block">
                    {"// OPERATIONAL_MANDATES"}
                </span>
            </div>

            <div className="container mx-auto grid grid-cols-3 gap-px bg-black border border-[#f97316]/20 pointer-events-auto shadow-[0_0_50px_rgba(249,115,22,0.1)] w-full max-w-5xl max-h-[45vh] overflow-x-auto overflow-y-hidden md:max-h-none md:overflow-visible">
                {DIRECTIVES.map((d, i) => (
                <div key={d.id} ref={el => visionCardsRef.current[i] = el} className="p-5 sm:p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-5 sm:mb-8 inline-block">{d.id}</span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 uppercase text-white">{d.title}</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        {d.body}
                    </p>
                </div>
                ))}
            </div>

          </div>

          <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none opacity-50 px-4">
              <span className="font-mono text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-[#f97316] block mb-2 whitespace-nowrap">Scroll Down to Sequence</span>
              <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-[#f97316] to-transparent mx-auto"></div>
          </div>

          {/* Hover Image Reveal Stage — desktop hover only, hidden on touch */}
          <div 
            ref={hoverRevealRef} 
            className={`hover-reveal-only hidden md:block fixed top-0 left-0 w-[300px] h-[200px] pointer-events-none z-[100] transition-opacity duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/10 ${hoveredImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
             {hoveredImage && <img src={hoveredImage} alt="Event Preview" className="w-full h-full object-cover" />}
          </div>
        </div>
    </div>
  );
};
