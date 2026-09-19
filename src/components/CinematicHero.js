import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LivingCore } from './LivingCore';
import { ABOUT_TAGLINE, ABOUT_TEXT, DIRECTIVES } from '../data/about';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const hoverRevealRef = useRef(null);
  
  // Animation Refs
  const coreRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const whoAreWeRef = useRef(null);
  const whoAreWeWordsRef = useRef([]);
  const visionContainerRef = useRef(null);
  const visionCardsRef = useRef([]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4200",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 2,
        invalidateOnRefresh: true,
      }
    });

    // The complete core becomes a small warm anchor above the next section.
    tl.to(titleRef.current, { y: -35, opacity: 0, duration: 1 }, 0)
      .to(subtitleRef.current, { opacity: 0, duration: 0.8 }, 0)
      .to(coreRef.current, { scale: 0.18, y: () => -window.innerHeight * 0.17, opacity: 0.65, duration: 2.5, ease: "power2.inOut" }, 0)
      .to(coreRef.current, { opacity: 0, duration: 1 }, 6.5);

    // SCENE 3: Who Are We fades in and out
    tl.fromTo(whoAreWeRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        2.5
    ).fromTo(whoAreWeWordsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.8, ease: "power2.out" },
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
    });
    return () => media.revert();

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
    <div ref={wrapperRef} className="hero-gsap-wrapper" data-core-hero id="home">
        <div ref={containerRef} className="hero-cinema h-screen w-full bg-black overflow-hidden relative">

          <div data-core-intro className="hero-intro absolute inset-0 flex flex-col items-center justify-center z-20">
            <div ref={coreRef} className="hero-core-slot"><LivingCore /></div>
            <h1 ref={titleRef} className="hero-title font-display font-bold text-white tracking-tight text-center px-6 leading-tight">
                Shaping the Future <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">of Intelligence.</span>
            </h1>
            <p ref={subtitleRef} className="hero-subtitle text-gray-400 font-mono tracking-widest text-xs uppercase text-center px-4">
                Welcome to the Core
            </p>
          </div>

          {/* --- OVERLAYS --- */}

          {/* Who Are We Overlay (Minimal & Sophisticated) */}
          <div ref={whoAreWeRef} className="hero-about absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-4 sm:px-6 opacity-0 pointer-events-none overflow-y-auto py-8">

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
          <div ref={visionContainerRef} className="hero-directives absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-4 sm:px-6 opacity-0 pointer-events-none overflow-y-auto py-6">
            
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
