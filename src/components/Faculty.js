import React, { useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FACULTY as facultyMembers } from '../data/faculty';


const ArrowBtn = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        aria-label={direction === 'left' ? 'Previous faculty' : 'Next faculty'}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(249,115,22,0.35)',
            cursor: 'pointer',
            transition: 'background 0.25s, border-color 0.25s, transform 0.2s',
            flexShrink: 0,
        }}
        onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.18)';
            e.currentTarget.style.borderColor = '#f97316';
            e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.55)';
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.35)';
            e.currentTarget.style.transform = 'scale(1)';
        }}
    >
        <svg
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="#f97316" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: direction === 'left' ? 'rotate(0deg)' : 'rotate(180deg)' }}
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    </button>
);

const CustomButtonGroup = ({ next, previous }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '14px',
        marginTop: '28px',
    }}>
        <ArrowBtn direction="left" onClick={previous} />
        <ArrowBtn direction="right" onClick={next} />
    </div>
);

export const Faculty = () => {
    const containerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <section ref={containerRef} className="py-16 sm:py-20 md:py-24 bg-black relative overflow-hidden border-b border-[#f97316]/10" id="faculty">
            
            <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-bl from-[#f97316]/5 to-transparent blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-5 sm:px-6 relative z-10 mt-6 sm:mt-10 mb-10 sm:mb-16">
                <div className="text-center">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// ACADEMIC_LEADERSHIP"}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight px-2">
                        FACULTY ADVISORS
                    </h2>
                </div>
            </div>

            <div
                className="container mx-auto px-4 sm:px-6 relative z-10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={!isPaused}
                    autoPlaySpeed={2000}
                    keyBoardControl={true}
                    customTransition="transform 500ms ease-in-out"
                    transitionDuration={500}
                    containerClass="carousel-container py-10"
                    itemClass="px-4 flex justify-center"
                    removeArrowOnDeviceType={[]}
                    showDots={false}
                    customLeftArrow={<></>}
                    customRightArrow={<></>}
                    customButtonGroup={<CustomButtonGroup />}
                    renderButtonGroupOutside={true}
                >
                    {facultyMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="group relative w-[82vw] max-w-[320px] sm:w-full aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-[border-color,box-shadow] duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] shrink-0 cursor-grab active:cursor-grabbing mx-auto"
                        >
                            {member.imgUrl ? (
                                <>
                                    <img
                                        src={member.imgUrl}
                                        alt={member.name}
                                        loading="lazy"
                                        decoding="async"
                                        className={`w-full h-full object-cover ${member.imgPosition || 'object-center'} grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-[filter,opacity,transform] duration-700`}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                                    <span className="text-4xl font-display font-bold text-white/10 tracking-widest select-none">
                                        {member.name
                                            .split(' ')
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .map((name) => name[0]?.toUpperCase() || '')
                                            .join('')}
                                    </span>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 flex flex-col justify-end pointer-events-none z-10">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-[#f97316] transition-colors mb-1 drop-shadow-lg">
                                            {member.name}
                                        </h3>
                                        <p className="font-mono text-[10px] md:text-xs text-[#ea580c] tracking-[0.15em] uppercase">
                                            {member.role}
                                        </p>
                                    </div>
                                    
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
                </Carousel>
            </div>
        </section>
    );
};
