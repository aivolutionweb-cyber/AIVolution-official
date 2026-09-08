import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  useGSAP(() => {
    // Continuous idle animation for the core rings
    gsap.to(ring1Ref.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    gsap.to(ring2Ref.current, {
        rotate: -360,
        duration: 15,
        repeat: -1,
        ease: "none"
    });

    // Initial state of the core is hidden and small
    gsap.set(coreRef.current, { scale: 0, opacity: 0 });

    // MAIN SCROLL TIMELINE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=6000",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 2,
      }
    });

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
        6.5 // Wait longer so text is fully readable
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

  }, { scope: wrapperRef }); // Scope to outer wrapper

  // Hover Reveal Mouse Tracker
  useGSAP(() => {
    if (hoverRevealRef.current) {
      gsap.set(hoverRevealRef.current, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(hoverRevealRef.current, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(hoverRevealRef.current, "y", { duration: 0.4, ease: "power3" });

      const handleMouseMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

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
              {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-[#f97316] rounded-full animate-bounce"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 5 + 3}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5 + 0.1
                    }}
                  />
              ))}
          </div>

          {/* --- THE AI CORE (Centerpiece) --- */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            
            <h1 ref={titleRef} className="text-5xl md:text-7xl font-display font-bold text-white mb-12 tracking-tight text-center px-4 mix-blend-difference z-30">
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

            <p ref={subtitleRef} className="text-gray-400 font-mono tracking-widest text-sm uppercase mt-64 z-30 mix-blend-difference">
                Welcome to the Core
            </p>
          </div>

          {/* --- OVERLAYS --- */}

          {/* Who Are We Overlay (Minimal & Sophisticated) */}
          <div ref={whoAreWeRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-6 opacity-0 pointer-events-none">

            {/* Typography Core - Minimal */}
            <div className="max-w-5xl text-center relative z-10 p-4 md:p-12 pointer-events-auto">
                <h2 className="text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight drop-shadow-2xl mb-2">
                    WHO ARE WE
                </h2>

                <div className="mb-8 text-[#f97316] font-mono text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase">
                    {"// WHERE CURIOSITY BECOMES CAPABILITY"}
                </div>

                <p className="max-w-4xl mx-auto text-white/90 font-light text-lg md:text-2xl leading-relaxed md:leading-[1.8] flex flex-wrap justify-center gap-x-2 gap-y-1">
                    {"AIvolution is a student-led ecosystem built for those who refuse to simply watch the future unfold. We explore emerging AI technologies, deconstruct how they work, and transform knowledge into practical solutions. Through hands-on learning, industry collaboration, competitive challenges, and experiential projects, we empower students to move from AI users to AI creators.".split(" ").map((word, i) => {
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
                                onMouseEnter={() => hoverImg && setHoveredImage(hoverImg)}
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
          <div ref={visionContainerRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-6 opacity-0 pointer-events-none">
            
            <div className="mb-12 text-center mt-[-10vh]">
                <h2 className="text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight drop-shadow-2xl mb-2">
                    CORE DIRECTIVES
                </h2>
                <span className="font-mono text-[#f97316] text-xs tracking-widest uppercase block">
                    {"// OPERATIONAL_MANDATES"}
                </span>
            </div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-[#f97316]/20 pointer-events-auto shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                <div ref={el => visionCardsRef.current[0] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">M_01</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">MISSION</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        To recognize and discover cutting-edge AI tools and techniques, empowering students to accelerate their growth and build the future with Artificial Intelligence.
                    </p>
                </div>
                <div ref={el => visionCardsRef.current[1] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">V_02</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VISION</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        To forge a thriving ecosystem of student innovators pushing the boundaries of AI exploration, technical mastery, and creative application.
                    </p>
                </div>
                <div ref={el => visionCardsRef.current[2] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">P_03</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VALUES</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        Continuous exploration of AI technologies. Hands-on learning and technical excellence. Empowering peers to leverage AI for real-world impact.
                    </p>
                </div>
            </div>

          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none opacity-50">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#f97316] block mb-2">Scroll Down to Sequence</span>
              <div className="w-px h-12 bg-gradient-to-b from-[#f97316] to-transparent mx-auto"></div>
          </div>

          {/* Hover Image Reveal Stage */}
          <div 
            ref={hoverRevealRef} 
            className={`fixed top-0 left-0 w-[300px] h-[200px] pointer-events-none z-[100] transition-opacity duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/10 ${hoveredImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
             {hoveredImage && <img src={hoveredImage} alt="Event Preview" className="w-full h-full object-cover" />}
          </div>
        </div>
    </div>
  );
};
