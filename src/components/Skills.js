import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DEPARTMENTS } from '../data/departments';

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const departments = DEPARTMENTS;

  const pathRef = useRef(null);

  useGSAP(() => {
    // Prime the track for GPU compositing before any animation
    gsap.set(trackRef.current, { willChange: "transform", force3D: true });

    // Horizontal scrolling for the track
    gsap.to(trackRef.current, {
      x: `-${100 * (departments.length - 1)}vw`,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.4,
        start: "top top",
        end: () => `+=${window.innerWidth * departments.length}`,
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
        scrub: 0.4,
        start: "top top",
        end: () => `+=${window.innerWidth * departments.length}`,
      }
    });

    // Animate the control points to bend and sweep the beam across the screen
    bgTl.to(curve, { startX: 700, cx: 900, endX: 300, colorR: 139, colorG: 92, colorB: 246, ease: "none", duration: 1, onUpdate: updatePath }) // Purple curve right
        .to(curve, { startX: 300, cx: 100, endX: 600, colorR: 236, colorG: 72, colorB: 153, ease: "none", duration: 1, onUpdate: updatePath }) // Pink curve left
        .to(curve, { startX: 800, cx: 500, endX: 200, colorR: 16, colorG: 185, colorB: 129, ease: "none", duration: 1, onUpdate: updatePath }) // Green straight
        .to(curve, { startX: 400, cx: 800, endX: 100, colorR: 59, colorG: 130, colorB: 246, ease: "none", duration: 1, onUpdate: updatePath }) // Blue curve right
        .to(curve, { startX: 900, cx: 500, endX: 100, colorR: 249, colorG: 115, colorB: 22, ease: "none", duration: 1, onUpdate: updatePath }); // Orange straight

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-hidden" id="skills">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Dynamic Morphing Beam. The blur is a CSS filter on the <svg>
            (GPU-composited) rather than an SVG feGaussianBlur on the path,
            which was re-rasterised on the CPU across a 200vw×150vh bitmap on
            every scroll frame while the path morphs. */}
        <div className="absolute w-[200vw] h-[150vh] left-[-50vw] top-[-25vh]">
            <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                className="w-full h-full opacity-30"
                style={{ filter: 'blur(48px)', willChange: 'filter' }}
                aria-hidden="true"
            >
                <path 
                    ref={pathRef}
                    d="M 900,-200 Q 500,500 100,1200" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="40" 
                />
            </svg>
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f97316]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="absolute top-20 sm:top-12 left-5 sm:left-6 md:left-16 lg:left-32 z-20 flex items-center gap-3 sm:gap-4">
          <div className="w-3 h-3 rounded-full bg-[#f97316] shrink-0"></div>
          <span className="font-mono text-gray-400 text-[0.65rem] sm:text-xs md:text-sm tracking-[0.3em] uppercase">
              THE DEPARTMENTS
          </span>
      </div>

      <div ref={trackRef} className="relative flex h-screen w-[400vw] z-10" style={{ willChange: 'transform' }}>
        {departments.map((dept, index) => (
            <div 
                key={dept.id} 
                className="w-screen h-full flex-shrink-0 px-5 sm:px-6 md:px-16 lg:px-32 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 relative pt-[12vh] md:pt-[15vh] pb-10 md:pb-0"
            >
                <span className="absolute left-4 sm:left-6 md:left-16 lg:left-32 font-display font-extrabold text-[7rem] sm:text-[10rem] md:text-[28rem] lg:text-[34rem] leading-none text-white/[0.03] select-none pointer-events-none z-0 top-16 md:top-20">
                    {`0${index + 1}`}
                </span>

                <div className="left-title-block w-full md:w-[50%] flex flex-col items-start z-10 md:mt-[15vh]">
                    
                    <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-5 sm:mb-8">
                        {dept.title}
                    </h2>
                    
                    <div className="h-1.5 w-24 rounded-full bg-[#f97316]"></div>
                </div>

                <Link to={`/team?dept=${dept.key}`} className="w-full md:w-[40%] z-10 md:pb-0 flex items-center justify-center md:justify-start md:-ml-16 md:-mt-[15vh]">
                    <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl px-5 py-5 sm:px-8 sm:py-6 w-full max-w-md">
                        <p className="text-gray-400 font-sans text-sm sm:text-base md:text-lg leading-relaxed">
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