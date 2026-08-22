import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const Team = () => {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const scrollWrapperRef = useRef(null);

    const teamMembers = [
        {
            id: "USR_001",
            name: "JANE DOE",
            role: "PRESIDENT / FOUNDER",
            specialization: "AI STRATEGY",
            imgUrl: "https://i.pravatar.cc/400?img=1"
        },
        {
            id: "USR_002",
            name: "JOHN SMITH",
            role: "HEAD OF RESEARCH",
            specialization: "DEEP LEARNING",
            imgUrl: "https://i.pravatar.cc/400?img=11"
        },
        {
            id: "USR_003",
            name: "ALICE WONG",
            role: "TECH LEAD",
            specialization: "DATA ENGINEERING",
            imgUrl: "https://i.pravatar.cc/400?img=5"
        },
        {
            id: "USR_004",
            name: "BOB CHEN",
            role: "EVENT COORDINATOR",
            specialization: "OPERATIONS",
            imgUrl: "https://i.pravatar.cc/400?img=8"
        }
    ];

    useGSAP(() => {
        const wrapper = scrollWrapperRef.current;
        const totalScrollWidth = wrapper.scrollWidth - window.innerWidth;

        gsap.to(wrapper, {
            x: -totalScrollWidth,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${totalScrollWidth}`,
                invalidateOnRefresh: true
            }
        });
    }, { scope: wrapperRef }); // Scope to outer wrapper

    // Interactive 3D Card Hover
    const handleMouseMove = (e, cardRef) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
        const rotateY = ((x - centerX) / centerX) * 15;

        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = (cardRef) => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    return (
        <div ref={wrapperRef} className="team-gsap-wrapper">
            <section ref={containerRef} className="relative h-screen bg-black overflow-hidden flex items-center border-t border-b border-[#f97316]/10" id="team">
                
                {/* Massive Background Typography */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
                    <h2 className="text-[18vw] font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-[#f97316] to-black whitespace-nowrap">
                        DIRECTORS
                    </h2>
                </div>

                <div className="absolute top-10 left-10 z-10">
                    <span className="font-mono text-[#f97316] text-sm tracking-[0.3em] uppercase">
                        // CORE_COMMAND
                    </span>
                </div>

                {/* Horizontal Scroll Wrapper */}
                <div ref={scrollWrapperRef} className="flex gap-10 px-[10vw] h-full items-center z-10 will-change-transform">
                    {teamMembers.map((member, index) => {
                        return (
                            <TeamCard 
                                key={index} 
                                member={member} 
                                onMouseMove={handleMouseMove} 
                                onMouseLeave={handleMouseLeave} 
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

// Extracted Card Component for clean refs
const TeamCard = ({ member, onMouseMove, onMouseLeave }) => {
    const cardRef = useRef(null);

    return (
        <div 
            ref={cardRef}
            onMouseMove={(e) => onMouseMove(e, cardRef)}
            onMouseLeave={() => onMouseLeave(cardRef)}
            className="group relative w-[300px] h-[450px] md:w-[350px] md:h-[500px] flex-shrink-0 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-crosshair shadow-2xl shadow-[#f97316]/5"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Glowing Accent */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#f97316]/60 to-[#ea580c]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"></div>
            
            {/* Image Container with Parallax inner scale */}
            <div className="relative h-[60%] w-full overflow-hidden border-b border-[#f97316]/20">
                <img 
                    src={member.imgUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent"></div>
                <div className="absolute bottom-3 right-3 font-mono text-[9px] bg-[#f97316]/20 text-[#f97316] px-2 py-1 rounded border border-[#f97316]/30 backdrop-blur-md">
                    ID: {member.id}
                </div>
            </div>

            {/* Info Container */}
            <div className="p-6 flex flex-col justify-between h-[40%] bg-gradient-to-b from-transparent to-black/90" style={{ transform: 'translateZ(30px)' }}>
                <div>
                    <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-wider mb-1 group-hover:text-[#f97316] transition-colors">
                        {member.name}
                    </h3>
                    <p className="font-mono text-xs text-[#ea580c] tracking-widest uppercase">
                        {member.role}
                    </p>
                </div>

                <div className="mt-auto">
                    <span className="font-mono text-[10px] text-gray-400 tracking-[0.2em] uppercase">
                        SPEC // {member.specialization}
                    </span>
                </div>
            </div>
        </div>
    );
};
