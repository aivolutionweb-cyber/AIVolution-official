import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Carousel from 'react-multi-carousel';

import 'react-multi-carousel/lib/styles.css';

const sampleMembers = [
  { name: 'Ishan', img: 'https://i.postimg.cc/VvJdtjPw/Ishan.jpg' },
  { name: 'Diwakar', img: 'https://i.postimg.cc/fyy0vGm4/Diwakar.jpg' },
  { name: 'Kriti', img: 'https://i.postimg.cc/fyqYnzZ6/kriti.jpg' },
  { name: 'Rahul', img: 'https://i.postimg.cc/SNwzWtsy/rahul.jpg' },
  { name: 'Falak', img: 'https://i.postimg.cc/m2xH95hW/falak.jpg' },
  { name: 'Aparna', img: 'https://i.postimg.cc/MpSVCF8X/aparna.jpg' },
  { name: 'Madhur', img: 'https://i.postimg.cc/hGRTq3W3/madhur.jpg' },
  { name: 'Parth', img: 'https://i.postimg.cc/dt7yZKJC/parth.jpg' },
  { name: 'Apoorva', img: 'https://i.postimg.cc/PxzBMchy/apoorva.jpg' },
  { name: 'Kshitij', img: 'https://i.postimg.cc/BQy2mnhG/kshtiij.jpg' },
  { name: 'Naman', img: 'https://i.postimg.cc/ryZ4ppXB/naman.jpg' },
  { name: 'Pranjal', img: 'https://i.postimg.cc/nzyCvXFY/pranjal.jpg' },
  { name: 'Sharad', img: 'https://i.postimg.cc/tgbZcZW2/sharad.jpg' },
];

const repeatedMembers = [...sampleMembers, ...sampleMembers];

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
            autoPlaySpeed={1200}
            keyBoardControl={true}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container py-6"
            itemClass="px-4 flex justify-center"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            showDots={true}
            dotListClass="custom-dot-list-style mt-8"
          >
            {sampleMembers.map((member, idx) => (
              <div
                key={idx}
                className="group block w-full max-w-[320px] aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-colors duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] shrink-0 cursor-pointer mx-auto"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end pointer-events-none z-10 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm md:text-base font-medium text-white/90 text-center">{member.name}</p>
                </div>
              </div>
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
