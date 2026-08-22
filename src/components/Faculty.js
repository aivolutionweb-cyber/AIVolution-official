import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const facultyMembers = [
    {
        name: "Dr. Vinay Kumar Saini",
        role: "HOD AI&DS",
        linkedin: "https://www.linkedin.com/school/7942020/",
        imgUrl: "https://i.postimg.cc/L6Q15nTX/1640103425941.jpg",
        imgPosition: "object-top"
    },
    {
        name: "Dr. Anshu Khurana",
        role: "Assistant Professor",
        linkedin: "https://www.linkedin.com/school/7942020/",
        imgUrl: "https://i.postimg.cc/63VZpcjp/1675939070856.jpg",
        imgPosition: "object-[center_20%]" // Adjusted to pull face into view for portrait
    },
    {
        name: "Mr. Nitin Garg",
        role: "Assistant Professor",
        linkedin: "https://www.linkedin.com/school/7942020/",
        imgUrl: "https://i.postimg.cc/qvYybzhW/1557999211647-(1).jpg",
        imgPosition: "object-top"
    },
    {
        name: "Dr. Tina Dudeja",
        role: "Assistant Professor",
        linkedin: "https://www.linkedin.com/in/dr-tina-dudeja-ba343115b/",
        imgUrl: "https://i.postimg.cc/HstC9yKV/1721225367690.jpg",
        imgPosition: "object-[center_20%]"
    },
    {
        name: "Ms. Aneesha Shokeen",
        role: "Assistant Professor",
        linkedin: "https://www.linkedin.com/in/aneesha-shokeen-39a7921aa/",
        imgUrl: "https://i.postimg.cc/RV4RK6Kd/1687721540968.jpg",
        imgPosition: "object-top"
    }
];

export const Faculty = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(() => {
        gsap.fromTo(cardsRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-black relative overflow-hidden border-b border-[#f97316]/10" id="faculty">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#f97316]/5 to-transparent blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 mt-10">
                <div className="text-center mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// ACADEMIC_LEADERSHIP"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">
                        FACULTY ADVISORS
                    </h2>
                </div>

                {/* Using flex-wrap so the 5 cards auto-center on the second row */}
                <div className="flex flex-wrap justify-center gap-8">
                    {facultyMembers.map((member, idx) => (
                        <div 
                            key={idx}
                            ref={el => cardsRef.current[idx] = el}
                            className="group relative w-full sm:w-[280px] lg:w-[260px] xl:w-[300px] aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-colors duration-500 shadow-2xl shadow-[#f97316]/0 hover:shadow-[#f97316]/10"
                        >
                            {/* Full Cover Image */}
                            <img 
                                src={member.imgUrl} 
                                alt={member.name}
                                className={`w-full h-full object-cover ${member.imgPosition || 'object-center'} grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700`}
                            />
                            
                            {/* Gradient Overlay for Text Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

                            {/* Info Container */}
                            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end pointer-events-none">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-[#f97316] transition-colors mb-1 drop-shadow-lg">
                                            {member.name}
                                        </h3>
                                        <p className="font-mono text-[10px] md:text-xs text-[#ea580c] tracking-[0.15em] uppercase">
                                            {member.role}
                                        </p>
                                    </div>
                                    
                                    {/* LinkedIn Icon Button */}
                                    <a 
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-[#f97316]/20 border border-white/20 hover:border-[#f97316] rounded-full transition-all duration-300 flex-shrink-0 ml-4 backdrop-blur-sm"
                                        aria-label={`Connect with ${member.name} on LinkedIn`}
                                    >
                                        <svg className="w-4 h-4 fill-current text-white group-hover:text-[#f97316] transition-colors" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
