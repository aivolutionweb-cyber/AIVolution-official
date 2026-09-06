import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

gsap.registerPlugin(ScrollTrigger);

const sampleMembers = [
  { name: 'Arjun Mehta', dept: 'Tech & Dev', deptId: 'MOD_01' },
  { name: 'Sneha Kapoor', dept: 'Tech & Dev', deptId: 'MOD_01' },
  { name: 'Kunal Verma', dept: 'Event Mgmt', deptId: 'MOD_02' },
  { name: 'Ishaan Gupta', dept: 'Design & Creative', deptId: 'MOD_03' },
  { name: 'Ananya Joshi', dept: 'Public Relations', deptId: 'MOD_04' },
  { name: 'Rohan Singh', dept: 'Tech & Dev', deptId: 'MOD_01' },
  { name: 'Aarohi Jain', dept: 'Event Mgmt', deptId: 'MOD_02' },
  { name: 'Tanya Bansal', dept: 'Design & Creative', deptId: 'MOD_03' },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

export const Team = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.team-section-title', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.team-carousel', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.team-view-all', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-black relative overflow-hidden border-b border-[#f97316]/10" id="team">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#f97316]/5 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block team-section-title">
            {"// THE_BUILDERS"}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight team-section-title">
            Meet Our Team
          </h2>
        </div>

        <div className="team-carousel">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2500}
            keyBoardControl={true}
            customTransition="transform 800ms ease-in-out"
            transitionDuration={800}
            containerClass="carousel-container py-6"
            itemClass="px-4 flex justify-center"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            showDots={true}
            dotListClass="custom-dot-list-style mt-8"
          >
            {sampleMembers.map((member, idx) => (
              <Link
                key={idx}
                to={`/team?dept=${member.deptId.replace('MOD_', '').toLowerCase().replace('&', '').replace(/\s+/g, '-')}`}
                className="block w-full max-w-[320px] aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-colors duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] shrink-0 cursor-pointer mx-auto"
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <span className="text-3xl font-display font-bold text-[#f97316]">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[#ea580c] tracking-[0.15em] uppercase">{member.dept}</p>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        <div className="text-center mt-12 team-view-all">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wide uppercase transition-transform hover:scale-105 active:scale-95"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .react-multi-carousel-dot button {
          border-color: #333 !important;
          background: #111 !important;
        }
        .react-multi-carousel-dot--active button {
          background: #f97316 !important;
          border-color: #f97316 !important;
        }
      `}</style>
    </section>
  );
};
