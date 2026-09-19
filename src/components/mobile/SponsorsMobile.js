import React, { useRef } from 'react';
import { SPONSORS } from '../../data/sponsors';
import { SectionHeading } from './primitives';
import { useInView } from '../../hooks/useInView';

const LogoStrip = () => (
  <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
    {SPONSORS.map((s) => (
      <div
        key={s.name}
        className="flex h-[76px] w-[150px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
      >
        <img
          src={s.logo}
          alt=""
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain opacity-80"
        />
      </div>
    ))}
  </div>
);

export const SponsorsMobile = () => {
  const stripRef = useRef(null);
  const inView = useInView(stripRef, '100px');

  return (
    <section className="overflow-hidden border-b border-t border-[#f97316]/10 border-t-white/5 bg-[#020617] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading label="// EXTERNAL_SUPPORT" title="Partners & Sponsors" align="center" />
      </div>

      <div ref={stripRef} className="reveal relative mt-10" style={{ '--reveal-i': 1 }}>
        <div
          className="marquee flex w-max"
          style={{ animationPlayState: inView ? 'running' : 'paused' }}
        >
          <LogoStrip />
          <LogoStrip />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#020617] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#020617] to-transparent" aria-hidden="true" />
      </div>

      <ul className="sr-only">
        {SPONSORS.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
    </section>
  );
};
