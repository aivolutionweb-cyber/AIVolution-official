import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { EVENTS_DESC } from './eventDate';
import { shortHash } from './scrap';
import { typeOf } from '../events/eventType';

// `git log --graph --oneline` of the society: one commit card per real event, newest first.
const COMMITS = EVENTS_DESC.map((e) => {
  const [label, color] = typeOf(e);
  return {
    id: e.id,
    hash: shortHash(e.id),
    title: e.title,
    date: e.date,
    type: e.type,
    label,
    color,
    summary: e.summary,
    featured: !!e.featured,
  };
});

const CommitItem = ({ c }) => (
  <Link
    to="/events"
    className="git-commit-card group relative flex items-center gap-3.5 px-4 py-2.5 rounded-lg border border-white/10 bg-[#14161c]/90 min-w-[310px] sm:min-w-[350px] md:min-w-[380px] max-w-[420px] shrink-0 text-left no-underline select-none cursor-pointer"
    style={{ '--cat-color': c.color, '--cat-glow': `${c.color}35` }}
    title={`${c.title} — click to view event report`}
  >
    {/* Graph node & commit hash */}
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative flex items-center justify-center">
        <span
          className="w-2.5 h-2.5 rounded-full border border-ink transition-transform duration-300 group-hover:scale-125"
          style={{ background: c.color, boxShadow: `0 0 8px ${c.color}60` }}
        />
        {c.featured && (
          <span
            className="absolute -inset-1 rounded-full animate-ping opacity-35 pointer-events-none"
            style={{ background: c.color }}
          />
        )}
      </div>
      <span className="font-mono text-[0.66rem] font-bold text-[#ffb86b] tracking-wider">
        {c.hash}
      </span>
    </div>

    {/* Vertical divider */}
    <div className="w-[1px] h-9 bg-white/10 shrink-0 group-hover:bg-white/20 transition-colors" />

    {/* Content */}
    <div className="min-w-0 flex-1">
      {/* Top meta row: Category pill + Date */}
      <div className="flex items-center justify-between gap-2 text-[0.6rem] font-mono leading-none mb-1">
        <span
          className="px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider text-[0.58rem]"
          style={{
            color: c.color,
            background: `color-mix(in srgb, ${c.color} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${c.color} 30%, transparent)`,
          }}
        >
          {c.label}
        </span>
        <span className="text-[#d7f5e3]/50 font-mono text-[0.62rem] whitespace-nowrap">
          {c.date}
        </span>
      </div>

      {/* Title + Action link indicator */}
      <div className="flex items-center justify-between gap-1.5">
        <p className="font-bricolage font-extrabold text-sm md:text-[0.9rem] text-paper group-hover:text-mint transition-colors truncate leading-tight">
          {c.title}
        </p>
        <span className="font-mono text-xs text-mint opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0">
          ↗
        </span>
      </div>

      {/* Contextual description snippet */}
      <p className="font-mono text-[0.65rem] text-[#d7f5e3]/50 group-hover:text-[#d7f5e3]/90 truncate mt-0.5 transition-colors leading-relaxed">
        {c.summary}
      </p>
    </div>
  </Link>
);

const Track = ({ trackRef, onPointerEnter, onPointerLeave }) => (
  <div
    ref={trackRef}
    className="git-log-track flex items-center gap-3 py-3 will-change-transform"
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onTouchStart={onPointerEnter}
    onTouchEnd={onPointerLeave}
  >
    {[...COMMITS, ...COMMITS].map((c, i) => (
      <React.Fragment key={`${c.id}-${i}`}>
        <CommitItem c={c} />
        <span className="text-white/15 font-mono text-xs select-none shrink-0" aria-hidden="true">
          ───
        </span>
      </React.Fragment>
    ))}
  </div>
);

export const GitLog = () => {
  const root = useRef(null);
  const track = useRef(null);
  const isHovered = useRef(false);
  const tweenRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;
      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration: 48,
        ease: 'none',
        repeat: -1,
      });
      tweenRef.current = tween;

      const clamp = gsap.utils.clamp(-6, 6);
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (isHovered.current) return;
          gsap.fromTo(
            tween,
            { timeScale: clamp(1 + self.getVelocity() / 240) },
            { timeScale: 1, duration: 1.5, ease: 'power2.out', overwrite: true }
          );
        },
      });
    },
    { scope: root }
  );

  const handlePointerEnter = () => {
    isHovered.current = true;
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.08, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    }
  };

  const handlePointerLeave = () => {
    isHovered.current = false;
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
    }
  };

  return (
    <div
      ref={root}
      className="screen relative border-y-2 border-ink font-mono text-sm overflow-hidden select-none"
      role="region"
      aria-label="Recent society commits and events log"
    >
      <div className="relative z-[2] flex items-stretch">
        {/* Pinned terminal prompt */}
        <div className="shrink-0 relative z-[4] flex items-center gap-3 px-4 md:px-6 py-3 border-r border-mint/25 bg-[#101216] shadow-[4px_0_16px_rgba(0,0,0,0.5)]">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse shrink-0" />
          <span className="text-mint font-bold text-xs sm:text-sm whitespace-nowrap">
            $ git log --oneline
          </span>
          <div className="hidden sm:flex items-center gap-2 text-[0.68rem] text-[#d7f5e3]/50">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-mint font-semibold">
              ⎇ main
            </span>
            <span className="hidden md:inline">{COMMITS.length} commits</span>
          </div>
        </div>

        {/* Marquee viewport with edge fade masks */}
        <div className="git-log-viewport relative flex-1 flex items-center overflow-hidden py-2.5">
          {/* Left edge fade gradient */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-8 md:w-16 bg-gradient-to-r from-screen to-transparent z-[3]" />
          {/* Right edge fade gradient */}
          <div className="pointer-events-none absolute right-0 inset-y-0 w-8 md:w-16 bg-gradient-to-l from-screen to-transparent z-[3]" />

          <Track
            trackRef={track}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          />
        </div>
      </div>
    </div>
  );
};
