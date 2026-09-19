import React from 'react';
import { LivingCore } from '../LivingCore';
import { Link } from 'react-router-dom';
import { ABOUT_TAGLINE, ABOUT_TEXT, DIRECTIVES } from '../../data/about';
import { SectionHeading, pillPrimary, pillSecondary, ArrowIcon } from './primitives';
import { RecruitmentHeroNotice } from '../RecruitmentCTA';

const [firstSentence, ...restSentences] = ABOUT_TEXT.split('. ');
const aboutLede = `${firstSentence}.`;
const aboutBody = restSentences.join('. ');

export const HeroMobile = () => (
  <>
    <section
      id="home"
      data-core-hero
      data-core-mobile
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black px-5 pb-10 pt-24 sm:px-8 sm:pt-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 45% at 50% 32%, rgba(249,115,22,0.20) 0%, rgba(249,115,22,0.06) 45%, rgba(0,0,0,0) 72%)',
        }}
        aria-hidden="true"
      />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />

      <div data-core-intro className="relative z-10 flex flex-1 flex-col justify-center py-6">
        <LivingCore mobile />

        <span className="hero-in mb-4 mt-10 block text-center font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#f97316] sm:mt-12" style={{ '--i': 1 }}>
          {"// MAIT's Official AI Society"}
        </span>

        <h1 className="hero-in text-center font-display text-[clamp(1.85rem,9vw,2.6rem)] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ '--i': 2 }}>
          Shaping the Future
          <br />
          <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">
            of Intelligence.
          </span>
        </h1>

        <p className="hero-in mx-auto mt-5 max-w-md text-center text-base leading-relaxed text-gray-400 sm:text-lg" style={{ '--i': 3 }}>
          Welcome to the Core.
          A student-led ecosystem turning AI users into AI creators.
        </p>

        <div className="hero-in mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center" style={{ '--i': 4 }}>
          <Link to="/events" className={pillPrimary}>
            Explore Events
            <ArrowIcon />
          </Link>
          <Link to="/team" className={pillSecondary}>
            Meet the Team
          </Link>
        </div>
      </div>

      {/* The floating recruitment notice covers the scroll indicator's
          spot, so the indicator is only rendered once the notice is gone. */}
      <RecruitmentHeroNotice
        fallback={
          <div className="hero-in relative z-10 flex flex-col items-center opacity-60" style={{ '--i': 6 }}>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#f97316]">
              Scroll to explore
            </span>
            <div className="relative mt-2 h-8 w-px bg-gradient-to-b from-[#f97316]/60 to-transparent">
              <span className="scroll-dot absolute -left-[1.5px] top-0 h-1 w-1 rounded-full bg-[#f97316]" />
            </div>
          </div>
        }
      />
    </section>

    <section className="border-t border-white/5 bg-black px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <SectionHeading label={ABOUT_TAGLINE} title="Who are we" />
        <p className="reveal mt-7 text-[1.2rem] font-medium leading-snug text-white sm:text-2xl" style={{ '--reveal-i': 1 }}>
          {aboutLede}
        </p>
        <p className="reveal mt-4 text-[15px] leading-[1.75] text-gray-400 sm:text-base" style={{ '--reveal-i': 2 }}>
          {aboutBody}
        </p>
      </div>
    </section>

    <section className="bg-black px-5 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="// OPERATIONAL_MANDATES" title="Core Directives" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {DIRECTIVES.map((d, i) => (
            <div
              key={d.id}
              className="reveal rounded-2xl border border-[#f97316]/20 bg-[#0a0a0a] p-6"
              style={{ '--reveal-i': i + 1 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-1 font-mono text-[0.65rem] tracking-widest text-[#f97316]">
                  {d.id}
                </span>
                <span className="font-mono text-[0.65rem] tracking-widest text-white/25">
                  0{i + 1} / 0{DIRECTIVES.length}
                </span>
              </div>
              <h3 className="mb-2 font-display text-xl font-bold uppercase text-white">{d.title}</h3>
              <p className="text-[15px] leading-relaxed text-gray-400">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);
