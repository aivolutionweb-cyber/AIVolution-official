import React from 'react';
import { FACULTY } from '../../data/faculty';
import { SectionHeading, SnapRow, LinkedInIcon } from './primitives';

// Mobile counterpart of Faculty. The desktop react-multi-carousel autoplays
// a transform transition every 2s and greys every photo out with a
// `grayscale` filter that only lifts on hover — which never happens on a
// touch screen. Here the photos are shown in colour in a native snap row.
export const FacultyMobile = () => (
  <section id="faculty" className="border-t border-white/5 bg-black py-16 sm:py-20">
    <div className="mx-auto flex max-w-5xl items-end justify-between gap-4 px-5 sm:px-8">
      <SectionHeading label="// ACADEMIC_LEADERSHIP" title="Faculty Advisors" />
      <span className="shrink-0 pb-1 font-mono text-[0.6rem] uppercase tracking-widest text-white/40">
        Swipe <span aria-hidden="true">→</span>
      </span>
    </div>

    <SnapRow className="mt-8" ariaLabel="Faculty advisors">
      {FACULTY.map((member, i) => (
        <div
          key={member.name}
          role="listitem"
          className="reveal w-[66vw] max-w-[260px] shrink-0 snap-start sm:w-[240px]"
          style={{ '--reveal-i': Math.min(i, 2) + 1 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl">
            {member.imgUrl ? (
              <img
                src={member.imgUrl}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover ${member.imgPosition || 'object-center'}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="select-none font-display text-4xl font-bold tracking-widest text-white/10">
                  {member.name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join('')}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold leading-tight text-white">{member.name}</h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#ea580c]">
                  {member.role}
                </p>
              </div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white active:bg-[#f97316]/30"
                aria-label={`Connect with ${member.name} on LinkedIn`}
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      ))}
    </SnapRow>
  </section>
);
