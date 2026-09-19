import React from 'react';
import { Link } from 'react-router-dom';
import { TEAM_HIGHLIGHTS } from '../../data/team';
import { SectionHeading, SnapRow, pillPrimary, ArrowIcon } from './primitives';

// Mobile counterpart of Team. Two-up snap row instead of the 1.2s autoplay
// carousel (whose 13 pagination dots also overflowed narrow screens).
export const TeamMobile = () => (
  <section id="team" className="border-t border-white/5 bg-black py-16 sm:py-20">
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <SectionHeading label="// THE_BUILDERS" title="Meet Our Team" />
    </div>

    <SnapRow className="mt-8" ariaLabel="Team members">
      {TEAM_HIGHLIGHTS.map((member, i) => (
        <div
          key={member.name}
          role="listitem"
          className="reveal w-[44vw] max-w-[200px] shrink-0 snap-start sm:w-[180px]"
          style={{ '--reveal-i': Math.min(i, 3) + 1 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl">
            <img
              src={member.img}
              alt={member.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-10">
              <p className="truncate text-center text-sm font-medium text-white/90">{member.name}</p>
            </div>
          </div>
        </div>
      ))}
    </SnapRow>

    <div className="reveal mt-10 px-5 text-center sm:px-8">
      <Link to="/team" className={pillPrimary}>
        View all
        <ArrowIcon />
      </Link>
    </div>
  </section>
);
