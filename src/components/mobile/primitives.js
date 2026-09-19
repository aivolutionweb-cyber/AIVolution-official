import React from 'react';

// Shared building blocks for the mobile homepage. Everything here is plain
// DOM + Tailwind: no animation library, no filters, no 3D transforms.

// `// LABEL` eyebrow + display heading, matching the desktop section headers.
// Syne ExtraBold uppercase runs ~1.17em per character, so the size is fluid
// (6.75vw) to keep the longest single word ("DEPARTMENTS") on one line from
// 320px up without ever breaking mid-word.
export const SectionHeading = ({ label, title, align = 'left', className = '' }) => (
  <div className={`reveal ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
    <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted">
      {label}
    </span>
    <h2 className="font-display text-[clamp(1.35rem,6.75vw,2.25rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white [overflow-wrap:normal] [text-wrap:balance] sm:text-4xl md:text-5xl">
      {title}
    </h2>
  </div>
);

// Native horizontal scroller with scroll-snap. The browser handles touch
// momentum and snapping on the compositor, so it stays smooth on low-end
// phones where a JS carousel (transition per tick) drops frames.
export const SnapRow = ({ children, className = '', ariaLabel }) => (
  <div
    className={`snap-row flex gap-3 overflow-x-auto px-5 pb-2 sm:px-8 ${className}`}
    role={ariaLabel ? 'list' : undefined}
    aria-label={ariaLabel}
  >
    {children}
    {/* Trailing spacer so the last card can snap fully into view with the
        same gutter as the first. */}
    <div className="w-2 shrink-0 sm:w-5" aria-hidden="true" />
  </div>
);

// Pill button / link styles shared by the mobile CTAs. Minimum 48px tall so
// every tap target clears the WCAG / platform guideline.
export const pillPrimary =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 text-xs font-semibold uppercase tracking-wide text-black transition-transform duration-200 active:scale-95';
// Card-level press feedback for tappable cards.
export const pressable = 'transition-transform duration-200 ease-out active:scale-[0.97]';
export const pillSecondary =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-xs font-semibold uppercase tracking-wide text-white transition-colors duration-200 active:bg-white/10';

export const ArrowIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const LinkedInIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
