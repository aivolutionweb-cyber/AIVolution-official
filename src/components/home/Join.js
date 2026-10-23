import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { useActiveCell } from './useActiveCell';
import { SectionLabel, Hand, PostIt, StickerButton, Stamp, Sticker, WHATSAPP } from './scrap';
import { useDraggable } from './useDraggable';

export const INSTAGRAM = 'https://www.instagram.com/aivolutions.mait';
export const LINKEDIN = 'https://www.linkedin.com/company/aivolutionaries/';

// The "clone" output that types itself in when the terminal scrolls into view.
const LINES = [
  ['$ git clone aivolutions', 'cmd'],
  ['Cloning into ‘aivolutions’…', ''],
  ['remote: 4 departments, 8 events, 1 society', 'dim'],
  ['$ cd aivolutions && cat CONTRIBUTING.md', 'cmd'],
];

const STEPS = [
  { n: '01', title: 'star the repo', body: 'Follow us on Instagram — event posters and recaps land there first.', cta: 'Instagram ↗', href: INSTAGRAM, bg: '#ff8fb1' },
  { n: '02', title: 'clone it', body: 'Join the WhatsApp channel for announcements and registrations.', cta: 'WhatsApp ↗', href: WHATSAPP, bg: '#3ae88a' },
  { n: '03', title: 'open a pull request', body: 'Show up to the next event. Everything we run is open to students.', cta: 'See events →', to: '/events', bg: '#ffe85c' },
];

// Two branches merging into main — the whole point of contributing.
const MergeDoodle = ({ className }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
    <path className="merge-path" d="M30 40 C 120 40, 150 150, 230 150 S 330 150, 380 150" stroke="var(--pink)" />
    <path className="merge-path" d="M30 260 C 120 260, 150 150, 230 150" stroke="var(--mint)" />
    <path className="merge-path" d="M230 150 H 380" stroke="var(--marker)" strokeWidth="6" />
    <circle className="merge-dot" cx="30" cy="40" r="9" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3" />
    <circle className="merge-dot" cx="30" cy="260" r="9" fill="var(--mint)" stroke="var(--ink)" strokeWidth="3" />
    <circle className="merge-dot" cx="380" cy="150" r="12" fill="var(--marker)" stroke="var(--ink)" strokeWidth="3" />
    <text x="300" y="135" className="font-mono" fontSize="11" fill="var(--pencil)" letterSpacing="2">MAIN</text>
    <text x="20" y="24" className="font-hand" fontSize="18" fill="var(--pencil)">you</text>
    <text x="20" y="292" className="font-hand" fontSize="18" fill="var(--pencil)">us</text>
  </svg>
);

export const Join = () => {
  const root = useRef(null);
  useReveal(root);
  useActiveCell(root);
  useDraggable(root, '.join-sticker');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Terminal types itself, the clone progress fills, then the steps deal in.
      const lines = gsap.utils.toArray('.term-line', root.current);
      const pct = { v: 0 };
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.term', start: 'top 75%', once: true } });
      lines.slice(0, 3).forEach((el, i) => {
        tl.to(el, { duration: 0.35, scrambleText: { text: LINES[i][0], chars: '01<>/█▒', speed: 0.6 } }, i * 0.3);
      });
      tl.to('.term-bar', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.9)
        .to(pct, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { root.current.querySelector('.term-pct').textContent = Math.round(pct.v); } }, 0.9)
        .to('.term-done', { opacity: 1, duration: 0.2 }, 2.05)
        .to(lines[3], { duration: 0.35, scrambleText: { text: LINES[3][0], chars: '01<>/█▒', speed: 0.6 } }, 2.2)
        .from('.step', { x: 60, rotation: 4, opacity: 0, stagger: 0.14, duration: 0.6, ease: 'back.out(1.6)' }, 2.3)
        .from('.step-dot', { scale: 0, stagger: 0.14, duration: 0.4, ease: 'back.out(3)' }, 2.35);

      // The branch line beside the steps draws with scroll; merge doodle draws on enter.
      gsap.from('.step-line', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 60%', scrub: true } });
      gsap.from('.merge-path', { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut', stagger: 0.25, scrollTrigger: { trigger: '.merge', start: 'top 85%', once: true } });
      gsap.from('.merge-dot', { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(3)', stagger: 0.3, delay: 0.6, scrollTrigger: { trigger: '.merge', start: 'top 85%', once: true } });
      gsap.to('.merge-dot', { y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });
    },
    { scope: root }
  );

  return (
    <section id="join" ref={root} className="cell relative bg-paper overflow-hidden">
      <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel path="CONTRIBUTING.md" />
            <h2 className="mt-4 text-[clamp(2.6rem,6vw,6rem)]">want in?</h2>
            <p className="mt-4 max-w-xl text-lg text-pencil">Three steps. No pull request template required.</p>
          </div>
          <PostIt rotate={3} tone="mint" className="text-xl">open to all branches<br />of MAIT</PostIt>
        </div>

        <div className="mt-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="space-y-8">
            {/* terminal */}
            <div className="term reveal screen grain grain--light border-2 border-ink shadow-[8px_8px_0_var(--ink)] font-mono text-sm md:text-base" style={{ '--reveal-i': 1 }}>
              <div className="relative z-[2] flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#141414]">
                <i className="w-3 h-3 rounded-full bg-redpen" /><i className="w-3 h-3 rounded-full bg-highlight" /><i className="w-3 h-3 rounded-full bg-mint" />
                <span className="ml-3 text-xs text-[#d7f5e3]/60">zsh — aivolutions</span>
              </div>
              <div className="relative z-[2] p-5 md:p-6 leading-8 min-h-[14rem]">
                {LINES.slice(0, 3).map(([, kind], i) => (
                  <p key={i} className={`term-line min-h-[2rem] ${kind === 'cmd' ? 'text-mint' : kind === 'dim' ? 'text-[#d7f5e3]/55' : 'text-[#d7f5e3]'}`} />
                ))}
                <p className="flex items-center gap-3 text-[#d7f5e3]">
                  <span className="shrink-0">Receiving objects:</span>
                  <span className="flex-1 h-3 border border-mint/40 p-[2px]"><span className="term-bar block h-full w-full bg-mint origin-left scale-x-0" /></span>
                  <span className="w-10 text-right"><span className="term-pct">0</span>%</span>
                  <span className="term-done text-mint opacity-0">done.</span>
                </p>
                <p className="term-line min-h-[2rem] text-mint" />
                <p className="caret text-mint" />
              </div>
            </div>

            {/* merge doodle */}
            <div className="merge reveal relative hidden lg:block" style={{ '--reveal-i': 2 }}>
              <MergeDoodle className="w-full max-w-[420px]" />
              <Hand className="absolute right-6 bottom-2 text-xl text-pencil" rotate={-3}>merge conflicts: none, usually</Hand>
            </div>
          </div>

          {/* steps along a branch line */}
          <div className="steps relative pl-10 sm:pl-12">
            <div className="step-line absolute left-3 sm:left-4 top-4 bottom-4 w-1 bg-ink" aria-hidden="true" />
            <ol className="space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.n} className="relative">
                  <span className="step-dot absolute -left-10 sm:-left-12 top-7 w-6 h-6 rounded-full border-[3px] border-ink" style={{ background: s.bg, transform: 'translateX(-9px)' }} aria-hidden="true" />
                  <div className="step group flex flex-col sm:flex-row sm:items-center gap-5 border-2 border-ink bg-cream p-5 md:p-6 shadow-[6px_6px_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
                    <span className="relative font-bricolage font-extrabold text-5xl leading-none select-none w-16 shrink-0 text-ink/15 transition-colors duration-300 group-hover:text-ink">
                      {s.n}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl leading-none"><span className="mark" style={{ '--mark': s.bg }}>{s.title}</span></h3>
                      <p className="mt-2 text-pencil">{s.body}</p>
                    </div>
                    {s.to
                      ? <StickerButton to={s.to} bg={s.bg} rotate={i % 2 ? -1.5 : 1.5} className="shrink-0 !py-3 !px-5 text-base">{s.cta}</StickerButton>
                      : <StickerButton href={s.href} target="_blank" rel="noreferrer" bg={s.bg} rotate={i % 2 ? -1.5 : 1.5} className="shrink-0 !py-3 !px-5 text-base">{s.cta}</StickerButton>}
                    <Stamp rotate={-10} color="var(--mint)" className="absolute -top-4 right-4 text-[0.6rem] bg-cream opacity-0 scale-150 transition-all duration-300 group-hover:!opacity-90 group-hover:scale-100">merged ✓</Stamp>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="reveal mt-12 flex flex-wrap items-center gap-5" style={{ '--reveal-i': 3 }}>
          <Stamp rotate={-5} color="var(--pen)">also on</Stamp>
          <a href={LINKEDIN} target="_blank" rel="noreferrer" className="squiggle font-bricolage font-extrabold text-lg">LinkedIn ↗</a>
          <Link to="/team" className="squiggle font-bricolage font-extrabold text-lg">the team →</Link>
          <Hand className="text-xl text-pencil ml-auto" rotate={-2}>dept. of CSE-AIML · MAIT, Rohini</Hand>
        </div>
      </div>

      {/* fling-able stickers */}
      <Sticker className="join-sticker absolute z-[3] top-[14%] right-[6%] hidden lg:inline-flex" bg="#ffe85c" data-r={-8}>PRs welcome</Sticker>
      <Sticker className="join-sticker absolute z-[3] bottom-[12%] left-[4%] hidden lg:inline-flex" bg="#2f6bff" fg="#fff" data-r={6}>good first issue: show up</Sticker>
    </section>
  );
};
