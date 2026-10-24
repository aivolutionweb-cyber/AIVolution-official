import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, HEAVY, LIGHT } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { DEPARTMENTS } from '../../data/departments';
import { useActiveCell } from './useActiveCell';
import { SectionLabel, Hand, Stamp, StickerButton, WHATSAPP } from './scrap';

const TONES = ['#ffe85c', '#ff8fb1', '#9bd7ff', '#3ae88a'];
const TILT = [-2, 1.5, -1, 2];

// Four departments as staff lanyards hanging from the `main` rail. Desktop: pinned
// horizontal scroll; scroll speed swings the badges on their straps. Mobile: stacked.
const Badge = ({ d, i }) => (
  <div className="badge-wrap flex flex-col items-center lg:shrink-0" style={{ '--tone': TONES[i] }}>
    {/* branch label on the rail */}
    <p className="hidden lg:block font-mono text-[0.68rem] text-[#9bd7ff] -mt-3 mb-1 whitespace-nowrap">⎇ departments/{d.key}</p>
    {/* the whole hanging thing pivots from the rail */}
    <div className="badge origin-top flex flex-col items-center">
      <div className="strap w-4 h-20 lg:h-28 bg-ink relative overflow-hidden">
        <span className="absolute inset-0 font-mono text-[7px] leading-[9px] text-paper/70 tracking-widest [writing-mode:vertical-rl] px-[3px] select-none">AIVOLUTIONS · AIVOLUTIONS</span>
      </div>
      <div className="w-10 h-5 bg-[#555] rounded-sm border-2 border-ink -mt-1 relative z-[1]" aria-hidden="true" />
      <article
        className="dept-card relative -mt-1 w-[86vw] max-w-[420px] lg:w-[400px] bg-cream text-ink border-2 border-ink shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
        style={{ transform: `rotate(${TILT[i]}deg)` }}
      >
        <div className="h-3 bg-[var(--tone)] border-b-2 border-ink" />
        <div className="mx-auto mt-3 w-7 h-7 rounded-full border-2 border-ink bg-[#1b3a7a]" aria-hidden="true" />
        <div className="px-7 pb-7 pt-4">
          <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-pencil">{d.id} · staff</p>
          <span className="absolute top-14 right-5 font-bricolage font-extrabold text-6xl text-ink/10 leading-none select-none" aria-hidden="true">0{i + 1}</span>
          <h3 className="mt-2 text-[2rem] leading-[0.95]">{d.title}</h3>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-pencil">{d.desc}</p>
          <div className="mt-6 flex items-end justify-between gap-3">
            <span className="font-mono text-xs text-pencil">departments/{d.key}/</span>
            <Stamp rotate={-10} className="dept-stamp text-[0.6rem]">active</Stamp>
          </div>
        </div>
        <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--ink)_0_8px,transparent_8px_14px)] opacity-70" aria-hidden="true" />
      </article>
    </div>
  </div>
);

export const Departments = () => {
  const root = useRef(null);
  const track = useRef(null);
  useReveal(root);
  useActiveCell(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const stampIn = { scale: 2.6, opacity: 0, rotation: -24, duration: 0.5, ease: 'back.out(1.6)' };

      mm.add(HEAVY, () => {
        const badges = gsap.utils.toArray('.badge', track.current);
        const cards = gsap.utils.toArray('.dept-card', track.current);
        const clamp = gsap.utils.clamp(-14, 14);
        const swing = (v) => {
          badges.forEach((b, i) => {
            gsap.to(b, {
              rotation: clamp(v / 90) * (1 + i * 0.12), duration: 0.25, overwrite: true,
              onComplete: () => gsap.to(b, { rotation: 0, duration: 1.6, ease: 'elastic.out(1, 0.3)' }),
            });
          });
        };
        const tween = gsap.to(track.current, {
          x: () => -(track.current.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${track.current.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => swing(self.getVelocity()),
          },
        });
        cards.forEach((card) => {
          gsap.from(card.querySelector('.dept-stamp'), {
            ...stampIn,
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' },
          });
        });
        // Idle sway so the rail never looks frozen.
        badges.forEach((b, i) => gsap.to(b, { rotation: i % 2 ? 1.2 : -1.2, duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 }));
      });

      mm.add(LIGHT, () => {
        gsap.utils.toArray('.dept-stamp', root.current).forEach((el) => {
          gsap.from(el, { ...stampIn, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="departments" ref={root} className="cell blueprint relative overflow-hidden">
      <div className="lg:h-[100svh] relative">
        {/* the rail = main branch */}
        <div className="hidden lg:flex absolute left-0 right-0 top-[9vh] h-3 bg-ink border-y-2 border-[#9bd7ff]/60 items-center z-[2]" aria-hidden="true">
          <span className="ml-6 -mt-9 font-mono text-xs text-[#9bd7ff] bg-[#1b3a7a] px-2">⎇ main</span>
        </div>

        <div ref={track} className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-[5vw] px-5 sm:px-8 md:px-12 lg:pl-[6vw] lg:pr-[10vw] py-20 lg:pt-[9vh] lg:pb-0 lg:w-max">
          <div className="reveal lg:w-[34vw] lg:shrink-0 lg:mt-[16vh]">
            <SectionLabel path="departments/" className="[&>span:first-child]:text-[#9bd7ff] [&>span]:text-[#eaf0ff] text-[#eaf0ff]/70" />
            {/* lg: sized so "4 departments," fits the 34vw column on one line instead of orphaning the "4" */}
            <h2 className="mt-4 text-[clamp(2.6rem,6vw,6rem)] lg:text-[4.4vw] text-white">
              <span className="whitespace-nowrap">{DEPARTMENTS.length} departments,</span><br />one society.
            </h2>
            <p className="mt-5 max-w-md text-lg text-[#eaf0ff]/75 leading-relaxed">
              Every event, post, partnership and line of code runs through one of these four. Grab the lanyard that fits you.
            </p>
            <Hand className="mt-6 text-2xl text-[#9bd7ff] hidden lg:block" rotate={-2}>scroll sideways — they swing →</Hand>
          </div>

          {DEPARTMENTS.map((d, i) => <Badge key={d.key} d={d} i={i} />)}

          <div className="reveal lg:w-[30vw] lg:shrink-0 lg:mt-[16vh]">
            <Hand className="block text-3xl md:text-4xl text-white" rotate={-2}>want in?</Hand>
            <p className="mt-3 text-[#eaf0ff]/75 text-lg max-w-sm">Connect with us on WhatsApp and follow along — events, announcements, all of it.</p>
            <StickerButton href={WHATSAPP} target="_blank" rel="noreferrer" bg="var(--highlight)" rotate={-2} className="mt-6">
              Connect on WhatsApp →
            </StickerButton>
          </div>
        </div>
      </div>
    </section>
  );
};
