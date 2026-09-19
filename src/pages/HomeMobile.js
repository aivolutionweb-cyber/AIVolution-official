import React, { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { HeroMobile } from '../components/mobile/HeroMobile';
import { DepartmentsMobile } from '../components/mobile/DepartmentsMobile';
import { EventsMobile } from '../components/mobile/EventsMobile';
import { SponsorsMobile } from '../components/mobile/SponsorsMobile';
import { FacultyMobile } from '../components/mobile/FacultyMobile';
import { TeamMobile } from '../components/mobile/TeamMobile';

const HomeMobile = () => {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
  <div ref={rootRef}>
    <HeroMobile />
    <DepartmentsMobile />
    <EventsMobile />
    <SponsorsMobile />
    <FacultyMobile />
    <TeamMobile />
    <div className="overflow-hidden bg-black px-4 py-10 text-center">
      <h2 className="reveal wordmark whitespace-nowrap font-display text-[7.6vw] font-extrabold leading-[0.85] tracking-tighter">
        AIVOLUTIONS
      </h2>
    </div>
  </div>
  );
};

export default HomeMobile;
