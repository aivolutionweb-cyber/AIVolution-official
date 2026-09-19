import React, { useEffect, useState } from 'react';
import { RECRUITMENT } from '../data/recruitment';

const DISMISS_KEY = 'aiv:recruitment-cta-dismissed';
const isDismissed = () => {
  try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
};

const LiveDot = () => (
  <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f97316] opacity-75" />
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#f97316]" />
  </span>
);

// Shared "Register Now" anchor. Opens the Google Form in a new tab.
export const RegisterLink = ({ className = '', children }) => (
  <a
    href={RECRUITMENT.formUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {children ?? (
      <>
        {RECRUITMENT.cta} <span aria-hidden="true">→</span>
      </>
    )}
  </a>
);

// Desktop homepage: a compact fixed card in the bottom-left corner. The
// desktop hero is pinned for ~4200px of scroll, so anything placed in normal
// flow below it is only reached after the full sequence — a small floating
// card is the only way to be in the first viewport without touching the
// Living Core. It stays hidden behind the genesis veil (`html.is-booting`)
// and fades in once the core has formed. Dismissal is remembered per tab.
export const RecruitmentFloatingCard = () => {
  const [dismissed, setDismissed] = useState(isDismissed);
  if (dismissed) return null;

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* Storage is optional. */ }
    setDismissed(true);
  };

  return (
    <aside
      className="recruitment-float fixed bottom-6 left-6 z-40 border border-[#f97316]/40 bg-[#0a0a0a] p-4 pr-10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(249,115,22,0.12)] xl:w-[min(340px,calc(100vw-48px))] xl:p-5"
      aria-label="2nd Year Interview Registration"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#f97316] via-[#ffd6a0] to-transparent" aria-hidden="true" />
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center font-mono text-sm text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316]"
        aria-label="Dismiss registration notice"
      >
        ×
      </button>

      {/* 1024–1279px: the hero title spans nearly the full width at this
          size, so only a two-line pill fits beside it without overlap. */}
      <div className="xl:hidden">
        <div className="mb-1.5 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#f97316]">
          <LiveDot />
          2nd Year Interviews
        </div>
        <RegisterLink className="inline-flex min-h-[32px] items-center gap-1.5 font-display text-base font-bold text-white transition-colors hover:text-[#ffd6a0] focus-visible:outline-none focus-visible:underline" />
      </div>

      <div className="hidden xl:block">
        <div className="mb-3 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#f97316]">
          <LiveDot />
          Registrations Open
        </div>
        <h2 className="font-display text-lg font-bold leading-tight text-white">
          {RECRUITMENT.headline}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          {RECRUITMENT.tagline}
        </p>
        <RegisterLink className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[#f97316] px-5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition-colors duration-200 hover:bg-[#ffd6a0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" />
      </div>
    </aside>
  );
};

// Mobile homepage: a single-line fixed strip along the bottom of the first
// viewport, short enough to sit in the scroll indicator's band under the
// hero's own buttons. The mobile hero already fills 100svh, so an in-flow card would
// land below the fold; floating is the only way to be seen on landing
// without moving hero elements. While it is live the hero's "Scroll to
// explore" indicator (which it would cover) is not rendered; dismissing the
// notice restores it. It hides once the page is scrolled past the hero
// start so it never collides with the scroll-to-top button, and stays behind
// the genesis veil like the desktop card.
export const RecruitmentHeroNotice = ({ fallback }) => {
  const [dismissed, setDismissed] = useState(isDismissed);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    if (dismissed) return undefined;
    const onScroll = () => setAtTop(window.scrollY < 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed) return fallback;

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* Storage is optional. */ }
    setDismissed(true);
  };

  return (
    <aside
      className={`recruitment-float fixed inset-x-3 bottom-2 z-40 flex h-12 items-center gap-2 border border-[#f97316]/40 bg-[#0a0a0a]/95 pl-3 pr-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_25px_rgba(249,115,22,0.12)] ${
        atTop ? '' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      aria-label="2nd Year Interview Registrations Open"
      aria-hidden={!atTop}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#f97316] via-[#ffd6a0] to-transparent" aria-hidden="true" />
      <LiveDot />
      <p className="min-w-0 flex-1 truncate font-display text-xs font-bold leading-none tracking-tight text-white">
        {RECRUITMENT.shortHeadline}
      </p>
      <RegisterLink className="inline-flex h-9 shrink-0 items-center justify-center gap-1 bg-[#f97316] px-3 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-black transition-transform duration-200 active:scale-95">
        Register <span aria-hidden="true">→</span>
      </RegisterLink>
      <button
        type="button"
        onClick={dismiss}
        className="flex h-9 w-7 shrink-0 items-center justify-center font-mono text-sm text-white/40 active:text-white"
        aria-label="Dismiss registration notice"
      >
        ×
      </button>
    </aside>
  );
};
