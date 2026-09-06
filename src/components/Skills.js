import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const departments = [
    { title: "Tech & Dev", id: "MOD_01", desc: "Engineering the future through modern web, mobile, and AI solutions. The core backbone of AIVolution's technical infrastructure." },
    { title: "Event Mgmt", id: "MOD_02", desc: "Architecting seamless and immersive technical and cultural experiences. From hackathons to global summits." },
    { title: "Design & Creative", id: "MOD_03", desc: "Forging the premium visual identity and aesthetic of our brand. Creating the award-winning graphics that represent us." },
    { title: "Public Relations", id: "MOD_04", desc: "Establishing strategic partnerships, driving external communications, and bridging the gap between industry and academia." },
  ];

  const pathRef = useRef(null);

  useGSAP(() => {
    // Horizontal scrolling for the track
    gsap.to(trackRef.current, {
      x: `-${100 * (departments.length - 1)}vw`,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${window.innerWidth * departments.length}`,
        anticipatePin: 1,
        refreshPriority: 1
      }
    });

    // Morphing Bezier Curve for the glowing beam
    const curve = { 
        startX: 900, 
        cx: 500, 
        endX: 100,
        colorR: 6, colorG: 182, colorB: 212 // Start with Cyan (#06b6d4)
    };

    const updatePath = () => {
        if (pathRef.current) {
            pathRef.current.setAttribute("d", `M ${curve.startX},-200 Q ${curve.cx},500 ${curve.endX},1200`);
            pathRef.current.setAttribute("stroke", `rgb(${Math.round(curve.colorR)}, ${Math.round(curve.colorG)}, ${Math.round(curve.colorB)})`);
        }
    };

    const bgTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 1,
        start: "top top",
        end: () => `+=${window.innerWidth * departments.length}`,
      }
    });

    // Animate the control points to bend and sweep the beam across the screen
    bgTl.to(curve, { startX: 700, cx: 900, endX: 300, colorR: 139, colorG: 92, colorB: 246, ease: "power1.inOut", duration: 1, onUpdate: updatePath }) // Purple curve right
        .to(curve, { startX: 300, cx: 100, endX: 600, colorR: 236, colorG: 72, colorB: 153, ease: "power1.inOut", duration: 1, onUpdate: updatePath }) // Pink curve left
        .to(curve, { startX: 800, cx: 500, endX: 200, colorR: 16, colorG: 185, colorB: 129, ease: "power1.inOut", duration: 1, onUpdate: updatePath }) // Green straight
        .to(curve, { startX: 400, cx: 800, endX: 100, colorR: 59, colorG: 130, colorB: 246, ease: "power1.inOut", duration: 1, onUpdate: updatePath }) // Blue curve right
        .to(curve, { startX: 900, cx: 500, endX: 100, colorR: 249, colorG: 115, colorB: 22, ease: "power1.inOut", duration: 1, onUpdate: updatePath }); // Orange straight

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-hidden" id="skills">
      
      {/* Background Layer (Pinned) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Dynamic Morphing Beam */}
        <div className="absolute w-[200vw] h-[150vh] left-[-50vw] top-[-25vh]">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full opacity-30">
                <defs>
                    <filter id="beam-blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="20" />
                    </filter>
                </defs>
                <path 
                    ref={pathRef}
                    d="M 900,-200 Q 500,500 100,1200" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="40" 
                    filter="url(#beam-blur)"
                    className="mix-blend-screen"
                />
            </svg>
        </div>
        
        {/* Subtle global glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f97316]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Global Section Label */}
      <div className="absolute top-12 left-6 md:left-16 lg:left-32 z-20 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
          <span className="font-mono text-gray-400 text-xs md:text-sm tracking-[0.3em] uppercase">
              THE DEPARTMENTS
          </span>
      </div>

      {/* Horizontal Track */}
      <div ref={trackRef} className="relative flex h-screen w-[400vw] z-10">
        {departments.map((dept, index) => (
            <div 
                key={dept.id} 
                className="w-screen h-full flex-shrink-0 px-6 md:px-16 lg:px-32 flex items-center justify-center relative pt-[15vh]"
            >
                {/* Giant background number positioned behind the title */}
                <span className="absolute left-6 md:left-16 lg:left-32 font-display font-extrabold text-[20rem] md:text-[28rem] lg:text-[34rem] leading-none text-white/[0.03] select-none pointer-events-none z-0 top-10 md:top-20">
                    {`0${index + 1}`}
                </span>

                {/* Left: Title Block */}
                <div className="left-title-block w-full md:w-[50%] flex flex-col items-start z-10 mt-[15vh]">
                    
                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                        {dept.title}
                    </h2>
                    
                    <div className="h-1.5 w-24 rounded-full bg-[#f97316]"></div>
                </div>

                {/* Right: Glass Description Box */}
                <Link to={`/team?dept=${dept.id.replace('MOD_', '').toLowerCase().replace('&', '').replace(/\s+/g, '-')}`} className="w-full md:w-[40%] z-10 pb-20 md:pb-0 flex items-center justify-center md:justify-start md:-ml-16 md:-mt-[15vh]">
                    <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl px-8 py-6 max-w-md">
                        <p className="text-gray-400 font-sans text-base md:text-lg leading-relaxed">
                            {dept.desc}
                        </p>
                    </div>
                </Link>
            </div>
        ))}
      </div>
    </div>
  );
};