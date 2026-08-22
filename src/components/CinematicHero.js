import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  
  // Animation Refs
  const coreRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  
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
        end: "+=4000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
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
        filter: "brightness(2) blur(10px)", 
        duration: 2,
        ease: "none" 
    }, 1);

    // SCENE 3: Directives Slide Up (2.5 to 4.5 seconds)
    tl.fromTo(visionContainerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        2.5
    ).fromTo(visionCardsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1 },
        3.0
    );

    // Hold the final state
    tl.to({}, { duration: 1 });

  }, { scope: wrapperRef }); // Scope to outer wrapper

  return (
    <div ref={wrapperRef} className="hero-gsap-wrapper">
        <div ref={containerRef} className="h-screen w-full bg-black overflow-hidden relative border-b border-[#f97316]/20">

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

          {/* Vision Overlay */}
          <div ref={visionContainerRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 px-6 opacity-0 pointer-events-none">
            
            <div className="mb-12 text-center mt-[-10vh]">
                <span className="font-mono text-[#f97316] text-xs tracking-widest uppercase mb-2 block">
                    // CORE_DIRECTIVES
                </span>
                <h2 className="text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight drop-shadow-2xl">
                    OPERATIONAL MANDATES
                </h2>
            </div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-[#f97316]/20 pointer-events-auto shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                <div ref={el => visionCardsRef.current[0] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">M_01</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">MISSION</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        To democratize AI education and provide every student at MAIT the resources to build futuristic tech.
                    </p>
                </div>
                <div ref={el => visionCardsRef.current[1] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">V_02</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VISION</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        To become North India's leading student-run AI community, fostering innovation and open-source contributions.
                    </p>
                </div>
                <div ref={el => visionCardsRef.current[2] = el} className="p-8 bg-[#0a0a0a]/90 backdrop-blur-sm hover:bg-[#111] border border-transparent hover:border-[#f97316]/30 transition-colors duration-300">
                    <span className="font-mono text-[#f97316] text-xs tracking-widest border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 mb-8 inline-block">P_03</span>
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VALUES</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">
                        Collaboration over competition. Practical learning over rote memorization. Community above all.
                    </p>
                </div>
            </div>

          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none opacity-50">
               <span className="font-mono text-white text-xs tracking-widest uppercase">
                  Scroll Down To Sequence
               </span>
          </div>

        </div>
    </div>
  );
};
