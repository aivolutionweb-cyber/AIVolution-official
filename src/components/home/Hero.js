import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { EVENTS } from '../../data/events';
import { useDraggable } from './useDraggable';
import { willPreload, PRELOADER_REVEAL_SECONDS } from '../../lib/preloader';
import { HeroNetwork } from './HeroNetwork';
import { SectionLabel, Mark, Tape, Sticker, StickerButton, Perforation, shortHash, WHATSAPP } from './scrap';

// Real numbers from src/data/events.js, as fridge-magnet stickers you can fling.
const STICKERS = [
// Parked around the network so they never cover a node.
  { text: "Codex Hackathon '25 · 60+ teams", bg: '#ffe85c', r: -8, cls: 'top-[11%] right-[30%] hidden lg:inline-flex' },
  { text: '₹19,000+ in prizes', bg: '#141414', fg: '#f3eee2', r: 6, cls: 'top-[13%] right-[3%] lg:top-[10%]' },
  { text: 'hands-on, not slides', bg: '#ff8fb1', r: -5, cls: 'bottom-[8%] right-[1%] min-[1392px]:bottom-auto min-[1392px]:top-[30%] hidden 2xl:inline-flex' },
  { text: 'build it, don\'t just watch', bg: '#2f6bff', fg: '#fff', r: 9, cls: 'top-[47%] right-[0%] hidden 2xl:inline-flex' },
];

const featured = EVENTS.find((e) => e.featured) || EVENTS[0];

export const Hero = () => {
  const root = useRef(null);
  const net = useRef(null);
  const [introDelay] = useState(() => (willPreload() ? PRELOADER_REVEAL_SECONDS : 0.15));
  useDraggable(root, '.hero-sticker');

  const { contextSafe } = useGSAP(
    () => {
      const delay = introDelay;
      const tl = gsap.timeline({ delay, defaults: { ease: 'expo.out' } });
      tl.from('.mask-line > span', { yPercent: 110, duration: 1.1, stagger: 0.1 })
        .from('.hero-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
        .add(() => root.current.classList.add('is-visible'), '-=0.4')
        .from('.hero-sticker', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.07 }, '-=0.5');

      if (prefersReducedMotion()) return undefined;
      gsap.to('.scroll-cue', { y: 6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      return undefined;
    },
    { scope: root }
  );

  // "AI creators." re-types itself and fires the network's forward pass into its output node.
  const toCreators = contextSafe((e) => {
    if (net.current) net.current.fire('out');
    if (prefersReducedMotion()) return;
    gsap.to(e.currentTarget, {
      duration: 0.9, overwrite: true,
      scrambleText: { text: 'AI creators.', chars: 'aivolutions01', speed: 0.6 },
    });
  });
  const firePass = () => net.current && net.current.fire('out');

  // Pointer flashlight reveals the blue ink grid (plain effect: useGSAP ignores returned cleanups).
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return undefined;
    const move = (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - b.left}px`);
      el.style.setProperty('--my', `${e.clientY - b.top}px`);
    };
    el.addEventListener('pointermove', move, { passive: true });
    return () => el.removeEventListener('pointermove', move);
  }, []);

  return (
    <section id="home" ref={root} className="relative min-h-[100svh] overflow-hidden dotgrid flex items-center">
      <div className="inkgrid absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-[3] w-full max-w-[1500px] mx-auto px-5 sm:px-8 md:px-12 pt-28 pb-24 md:pt-32 grid gap-12 lg:gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-[660px]">
          <div className="hero-fade flex flex-wrap items-center gap-3 mb-6">
            <SectionLabel bare><span className="text-pen font-bold">⎇ main</span> · public</SectionLabel>
            <Tape rotate={-2} stripe>official AI society · dept. of CSE-AI, MAIT</Tape>
          </div>

          <h1 className="text-[clamp(2.9rem,6.4vw,6.6rem)]">
            <span className="mask-line"><span>we turn AI</span></span>
            <span className="mask-line"><span><span className="strike font-hand font-medium tracking-normal text-pencil">users</span> into</span></span>
            <span className="mask-line"><span><Mark><span className="cursor-default" onMouseEnter={toCreators}>AI creators.</span></Mark></span></span>
          </h1>

          <p className="hero-fade mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-pencil">
            A student-led ecosystem at Maharaja Agrasen Institute of Technology for those who refuse to
            simply watch the future unfold — hands-on learning, industry collaboration, competitive
            challenges, and experiential projects.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-4">
            <StickerButton href={WHATSAPP} target="_blank" rel="noreferrer" bg="var(--highlight)" rotate={-1.5} onMouseEnter={firePass}>
              Join AIvolutions <span aria-hidden="true">→</span>
            </StickerButton>
            <StickerButton to="/events" bg="#fff" rotate={1} onMouseEnter={firePass}>See our events</StickerButton>
          </div>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <SectionLabel bare>latest commit</SectionLabel>
            <Link
              to={`/events?e=${featured.id}`}
              className="group inline-flex items-center gap-4 border-2 border-ink bg-cream pl-2 pr-4 py-2 shadow-[4px_4px_0_var(--ink)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img src={featured.imgUrl} alt="" width="56" height="56" className="w-14 h-14 object-cover border border-ink" />
              <span>
                <span className="block font-bricolage font-extrabold text-lg leading-tight">{featured.title}</span>
                <span className="block font-mono text-xs text-pencil"><span className="text-marker">{shortHash(featured.id)}</span> · {featured.date} · {featured.facts.slice(0, 2).join(' · ')}</span>
              </span>
              <span className="font-bricolage font-extrabold text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* from 1392px the wider right margin leaves room for the corner merch tee */}
        <div className="hero-fade relative mx-auto w-full max-w-[520px] lg:w-[min(42vw,520px)] lg:max-w-none lg:mr-6 xl:mr-10 min-[1392px]:mr-[9.5rem]">
          <HeroNetwork ref={net} introDelay={introDelay} />
        </div>
      </div>

      {STICKERS.map((s) => (
        <Sticker key={s.text} className={`hero-sticker absolute z-[4] ${s.cls}`} bg={s.bg} fg={s.fg} data-r={s.r}>
          {s.text}
        </Sticker>
      ))}

      <p className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] font-mono text-[0.68rem] tracking-[0.18em] uppercase text-pencil whitespace-nowrap">
        ↓ README.md
      </p>
      <Perforation />
    </section>
  );
};
