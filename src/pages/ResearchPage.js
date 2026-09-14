import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const ResearchPage = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useGSAP(() => {
        const tl = gsap.timeline();
        
        tl.fromTo('.coming-soon-text', 
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", stagger: 0.2 }
        );

        // Continuous subtle floating animation
        gsap.to('.floating-element', {
            y: -20,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.5
        });
    });

    return (
        <section className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden pt-20">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f97316]/10 blur-[100px] rounded-full floating-element"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full floating-element"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <div className="coming-soon-text font-mono text-[#f97316] text-sm md:text-base tracking-[0.3em] uppercase mb-6">
                    // Research & Development
                </div>
                
                <h1 className="coming-soon-text text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/30 uppercase tracking-tighter leading-none mb-8">
                    COMING<br />SOON
                </h1>
                
                <p className="coming-soon-text max-w-2xl text-gray-400 font-sans text-lg md:text-xl leading-relaxed">
                    We are currently building something extraordinary. Our research publications and technical whitepapers will be available here shortly.
                </p>
                
                <div className="coming-soon-text mt-12">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#f97316] to-transparent rounded-full opacity-50"></div>
                </div>
            </div>
        </section>
    );
};
