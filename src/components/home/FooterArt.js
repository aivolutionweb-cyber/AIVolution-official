import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { SectionLabel } from './scrap';
import { IdCard } from './IdCard';
import { ABOUT_TAGLINE } from '../../data/about';
import { EVENTS } from '../../data/events';
import { DEPARTMENTS } from '../../data/departments';
import { FACULTY } from '../../data/faculty';
import { TEAM } from '../../data/team';
import { SPONSORS } from '../../data/sponsors';

// Repo stats, all derived from the data files.
const STATS = [
  ['commits', EVENTS.length, 'events so far'],
  ['branches', DEPARTMENTS.length, 'departments'],
  ['contributors', TEAM.length, 'core team'],
  ['maintainers', FACULTY.length, 'faculty'],
  ['sponsors', SPONSORS.length, 'partners'],
];

// "Languages" bar = share of events by type.
const TYPE_COLORS = { competition: 'var(--marker)', workshop: 'var(--pen)', webinar: 'var(--mint)', visit: 'var(--pink)', gallery: 'var(--highlight)' };
const counts = EVENTS.reduce((m, e) => ({ ...m, [e.type]: (m[e.type] || 0) + 1 }), {});
const LANGS = Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .map(([type, n]) => ({ type, n, pct: (n / EVENTS.length) * 100, color: TYPE_COLORS[type] || 'var(--pencil)' }));

const Card = ({ title, tone, children, rotate }) => (
  <div className="border-2 border-ink bg-cream shadow-[5px_5px_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1" style={{ transform: `rotate(${rotate}deg)` }}>
    <div className="px-4 py-1.5 border-b-2 border-ink font-mono text-[0.65rem] tracking-[0.2em] uppercase" style={{ background: tone }}>{title}</div>
    <div className="px-4 py-4">{children}</div>
  </div>
);

export const NavigateCard = () => {
  const { pathname } = useLocation();
  // Clicking the link for the page you're already on scrolls to its top (route change handles the rest).
  const toTop = (to) => () => { if (pathname === to) window.scrollTo({ top: 0, behavior: 'instant' }); };
  const link = 'squiggle font-bricolage font-extrabold text-lg hover:text-marker transition-colors';
  return (
    <Card title="navigate" tone="var(--highlight)" rotate={-0.8}>
      <ul className="space-y-2.5">
        <li><Link to="/" onClick={toTop('/')} className={link}>home</Link></li>
        <li><Link to="/events" onClick={toTop('/events')} className={link}>events</Link></li>
        <li><Link to="/team" onClick={toTop('/team')} className={link}>team</Link></li>
      </ul>
    </Card>
  );
};

export const FindUsCard = () => (
  <Card title="find us" tone="var(--pink)" rotate={-0.5}>
    <p className="font-hand text-2xl leading-tight">Maharaja Agrasen Institute of Technology</p>
    <p className="font-mono text-xs text-pencil mt-2">Sector 22, Rohini, Delhi — 110086</p>
    <p className="font-mono text-xs text-pencil mt-1">Dept. of CSE-AIML</p>
  </Card>
);

export const FooterArt = () => {
  const root = useRef(null);
  useReveal(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.lang-seg', {
        scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.lang-bar', start: 'top 85%', once: true },
      });
      gsap.from('.stat-n', {
        innerText: 0, snap: 'innerText', duration: 1.2, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-paper pt-10 pb-12 px-5 sm:px-8 border-t-[3px] border-ink [clip-path:inset(0_0_-100vh_0)]">
      {/* clip-path (not overflow) hides the card above the tear line but lets it swing below */}
      <div className="perforation absolute left-0 right-0 top-0" aria-hidden="true" />
      <div className="relative z-[2] max-w-7xl mx-auto lg:pr-[360px]">
        <div className="reveal">
          <SectionLabel bare><span className="text-pen font-bold">⎇ main</span> · public</SectionLabel>
          <h2 className="mt-2 text-[clamp(2.4rem,8vw,7.5rem)] leading-[0.9]">AIvolutions</h2>
          <p className="mt-4 max-w-2xl text-lg text-pencil">{ABOUT_TAGLINE.replace('// ', '')}</p>
        </div>

        <div className="reveal mt-12" style={{ '--reveal-i': 1 }}>
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-pencil mb-3">activity by type</p>
          <div className="lang-bar flex h-3 w-full overflow-hidden border-2 border-ink bg-cream">
            {LANGS.map((l) => (
              <span key={l.type} className="lang-seg h-full" style={{ width: `${l.pct}%`, background: l.color }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            {LANGS.map((l) => (
              <li key={l.type} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-ink" style={{ background: l.color }} />
                <span className="capitalize">{l.type}</span>
                <span className="text-pencil">{l.pct.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="stats reveal mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 font-mono" style={{ '--reveal-i': 2 }}>
          {STATS.map(([label, n, sub]) => (
            <div key={label} className="border-l-2 border-ink/20 pl-3">
              <dd className="stat-n font-bricolage font-extrabold text-3xl md:text-4xl text-ink leading-none">{n}</dd>
              <dt className="text-[0.65rem] tracking-[0.18em] uppercase text-pencil mt-1">{label} <span className="normal-case tracking-normal opacity-70">· {sub}</span></dt>
            </div>
          ))}
        </dl>

        <div className="reveal mt-12 grid sm:grid-cols-2 gap-6 md:gap-8" style={{ '--reveal-i': 3 }}>
          <NavigateCard />
          <FindUsCard />
        </div>
      </div>
      {/* desktop: hangs from the tear line on the right (the column above leaves it room); mobile: its own slot */}
      <IdCard className="relative z-[3] mt-12 h-[720px] border-t-2 border-dashed border-ink/25 max-lg:overflow-hidden lg:absolute lg:mt-0 lg:top-0 lg:h-full lg:w-[300px] lg:border-0 lg:right-[max(2rem,calc((100%-80rem)/2))]" />
    </section>
  );
};
