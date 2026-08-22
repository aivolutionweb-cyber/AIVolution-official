import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Sponsors = () => {
    const sectionRef = useRef(null);
    const ringRef = useRef(null);

    const baseSponsors = [
        { name: "NEIGHBORLY", logo: "/assets/events/img/neighbourly.jpg" },
        { name: "COMING SOON", logo: null },
        { name: "COMING SOON", logo: null },
        { name: "COMING SOON", logo: null },
        { name: "COMING SOON", logo: null },
        { name: "COMING SOON", logo: null },
    ];
    // Double array for a fuller 3D ring
    const sponsors = [...baseSponsors, ...baseSponsors];
    const radius = 350;

    useGSAP(() => {
        // Infinite 3D rotation of the entire ring on the Y axis
        gsap.to(ringRef.current, {
            rotationY: -360,
            ease: "none",
            duration: 30,
            repeat: -1,
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-32 bg-[#020617] relative overflow-hidden border-b border-[#f97316]/10">
            
            {/* Background Glow (Orange Mix) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="container mx-auto px-6 mb-24 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <span className="font-mono text-[#f97316] text-xs tracking-[0.3em] uppercase mb-4 block">
                        // EXTERNAL_SUPPORT
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-tight">
                        PARTNERS & SPONSORS
                    </h2>
                </div>
            </div>
            
            {/* 3D Orbital Carousel Stage */}
            <div className="relative w-full h-[400px] flex items-center justify-center z-10" style={{ perspective: '1200px' }}>
                
                {/* Tilted Ring Wrapper */}
                <div 
                    ref={ringRef} 
                    className="relative w-[200px] h-[100px]"
                    style={{ 
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(-15deg)` // Tilt the ring to see it as an orbit
                    }}
                >
                    {sponsors.map((sponsor, idx) => {
                        const angle = (360 / sponsors.length) * idx;
                        
                        return (
                            <div 
                                key={idx} 
                                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: 'hidden', // Hide back of cards as they spin around
                                }}
                            >
                                <div className="group w-[220px] h-[100px] bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center p-4 transition-all duration-500 hover:bg-[#111] hover:border-[#f97316]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
                                    
                                    {/* Inner Glow on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/0 via-[#f97316]/10 to-[#ea580c]/20 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                    
                                    {sponsor.logo ? (
                                        <img 
                                            src={sponsor.logo} 
                                            alt={sponsor.name} 
                                            className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-500 relative z-10"
                                        />
                                    ) : (
                                        <div className="text-center relative z-10">
                                            <svg className="w-8 h-8 text-[#f97316]/20 mx-auto mb-1 group-hover:text-[#ea580c]/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 group-hover:text-[#f97316] transition-colors uppercase">
                                                {sponsor.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
        </section>
    );
};