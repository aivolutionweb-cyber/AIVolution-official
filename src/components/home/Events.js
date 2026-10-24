import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { EVENTS_DESC, eventTime } from './eventDate';
import { useActiveCell } from './useActiveCell';
import { SectionLabel, Hand, Tape, Polaroid, Perforation, shortHash } from './scrap';

// Event type → lane colour + label. (Algosphere is typed "gallery" in the data but is a hackathon.)
const TYPE = {
  competition: ['competition', '#ff5a1f'],
  gallery: ['competition', '#ff5a1f'],
  workshop: ['workshop', '#2f6bff'],
  webinar: ['webinar', '#3ae88a'],
  visit: ['industrial visit', '#ff8fb1'],
};
const typeOf = (e) => TYPE[e.type] || [e.type, '#6b6860'];

// Contribution grid: one column per month, one cell per week of the month (days 1–7, 8–14, …).
// A cell lights up in its event's type colour for every week an event ran in.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (d) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// Every day an event ran: "23–25 Mar 2026" → 23, 24, 25 Mar; "22 Mar – Apr 2025" → 22 Mar plus its
// final in the first week of April.
const eventDays = (e) => {
  const start = new Date(eventTime(e, true));
  const span = e.date.match(/^(\d{1,2})–(\d{1,2}) /);
  if (span) return Array.from({ length: span[2] - span[1] + 1 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const toMonth = e.date.match(/– ([A-Za-z]{3}) /);
  if (toMonth) return [start, new Date(start.getFullYear(), MONTHS.indexOf(toMonth[1]), 1)];
  return [start];
};

const DAYS = EVENTS_DESC.flatMap((e) => eventDays(e).map((d) => ({ d, e })));
const first = new Date(Math.min(...DAYS.map(({ d }) => d)));
const last = new Date(Math.max(...DAYS.map(({ d }) => d)));
const monthKey = (d) => d.getFullYear() * 12 + d.getMonth();
const HEAT_MONTHS = Array.from({ length: monthKey(last) - monthKey(first) + 1 }, (_, i) => new Date(first.getFullYear(), first.getMonth() + i, 1));
const cellEvents = new Map(); // "month-week" → events that ran that week
DAYS.forEach(({ d, e }) => {
  const k = `${monthKey(d) - monthKey(first)}-${Math.min(4, Math.floor((d.getDate() - 1) / 7))}`;
  const list = cellEvents.get(k) || [];
  if (!list.includes(e)) cellEvents.set(k, [...list, e]);
});
const LEGEND = [...new Map(Object.values(TYPE).map(([label, color]) => [label, color])).entries()];

const Heatmap = () => (
  <div className="heat border-2 border-ink bg-cream p-4 md:p-6 shadow-[6px_6px_0_var(--ink)] overflow-x-auto">
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
      <p className="font-bricolage font-extrabold text-lg">
        {EVENTS_DESC.length} events · {DAYS.length} event days · {fmt(first)} → {fmt(last)}
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.65rem] text-pencil">
        {LEGEND.map(([label, color]) => (
          <li key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-ink" style={{ background: color }} />
            {label}
          </li>
        ))}
      </ul>
    </div>
    <div className="grid gap-[5px] min-w-[520px]" style={{ gridTemplateColumns: `repeat(${HEAT_MONTHS.length}, minmax(0, 1fr))` }}>
      {HEAT_MONTHS.map((m, i) => (
        <span key={`m${i}`} className="font-mono text-[9px] text-pencil leading-tight whitespace-nowrap">
          {MONTHS[m.getMonth()]}
          {(i === 0 || m.getMonth() === 0) && <span className="block text-ink font-bold">’{String(m.getFullYear()).slice(2)}</span>}
        </span>
      ))}
      {Array.from({ length: 5 }, (_, week) =>
        HEAT_MONTHS.map((m, i) => {
          const events = cellEvents.get(`${i}-${week}`);
          return (
            <span
              key={`${i}-${week}`}
              title={events ? events.map((e) => e.title).join(' · ') : undefined}
              className={`heat-cell aspect-square rounded-[3px] ${events ? 'border-2 border-ink shadow-[2px_2px_0_var(--ink)]' : 'bg-ink/[0.06]'}`}
              style={{ gridColumn: i + 1, gridRow: week + 2, background: events ? typeOf(events[0])[1] : undefined }}
            />
          );
        })
      )}
    </div>
  </div>
);

export const Events = () => {
  const root = useRef(null);
  useReveal(root);
  useActiveCell(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.heat-cell', {
        scale: 0, duration: 0.4, ease: 'back.out(2)', stagger: { each: 0.004, from: 'start' },
        scrollTrigger: { trigger: '.heat', start: 'top 80%', once: true },
      });
      // The git line draws down as you scroll; each commit pops when reached.
      gsap.from('.git-line', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.git-log', start: 'top 70%', end: 'bottom 70%', scrub: true } });
      gsap.utils.toArray('.commit', root.current).forEach((c, i) => {
        const side = c.dataset.side === 'r' ? 1 : -1;
        const st = { trigger: c, start: 'top 78%', once: true };
        gsap.from(c.querySelector('.commit-node'), { scale: 0, duration: 0.5, ease: 'back.out(3)', scrollTrigger: st });
        gsap.from(c.querySelector('.commit-card'), { x: side * 60, opacity: 0, duration: 0.7, scrollTrigger: st });
        gsap.from(c.querySelector('.polaroid'), { rotation: side * 14, y: 30, opacity: 0, duration: 0.8, ease: 'back.out(1.4)', delay: 0.15, scrollTrigger: st });
      });
    },
    { scope: root }
  );

  return (
    <section id="events" ref={root} className="cell relative bg-paper dotgrid">
      <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel path="events/" />
            <h2 className="mt-4 text-[clamp(2.6rem,6vw,6rem)]">commit history.</h2>
            <p className="mt-4 max-w-xl text-lg text-pencil">Every event we've run, newest first. Click any commit for the full report and photos.</p>
          </div>
          <Link to="/events" className="btn-sticker" style={{ '--bg': '#fff' }}>all event reports →</Link>
        </div>

        <div className="reveal mt-10" style={{ '--reveal-i': 1 }}><Heatmap /></div>

        {/* git graph */}
        <div className="git-log relative mt-16 md:mt-24">
          <div className="git-line absolute left-5 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-ink" aria-hidden="true" />
          <ol className="space-y-14 md:space-y-20">
            {EVENTS_DESC.map((e, i) => {
              const [label, color] = typeOf(e);
              const right = i % 2 === 1;
              return (
                <li key={e.id} data-side={right ? 'r' : 'l'} className={`commit relative md:grid md:grid-cols-2 md:gap-16 items-center ${right ? '' : 'md:[direction:rtl]'}`}>
                  <span className="commit-node absolute left-5 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-6 h-6 rounded-full border-[3px] border-ink z-[2]" style={{ background: color }} aria-hidden="true" />
                  <div className="md:[direction:ltr] pl-14 md:pl-0">
                    <Link to={`/events?e=${e.id}`} className="commit-card group block border-2 border-ink bg-cream p-5 md:p-7 shadow-[6px_6px_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
                        <span className="text-marker font-bold">{shortHash(e.id)}</span>
                        <span className="text-pencil">{e.date}</span>
                        <Tape rotate={-1} className="!text-[0.62rem] !py-1 !px-2.5" style={{ background: color }}>{label}</Tape>
                        {i === 0 && <span className="px-2 py-0.5 border border-ink bg-highlight text-[0.62rem] font-bold">HEAD → main</span>}
                      </div>
                      <h3 className="mt-3 text-2xl md:text-[2rem] leading-[0.95] group-hover:underline decoration-marker decoration-4 underline-offset-4">{e.title}</h3>
                      <p className="mt-3 text-pencil leading-relaxed">{e.summary}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {e.facts.slice(0, 4).map((f) => <li key={f} className="font-mono text-[0.65rem] px-2 py-1 border border-ink/30 bg-paper">{f}</li>)}
                      </ul>
                    </Link>
                  </div>
                  <div className="md:[direction:ltr] hidden md:flex justify-center">
                    <Polaroid src={e.imgUrl} alt={e.title} caption={e.title} sub={e.date} rotate={right ? -4 : 4} className="w-[260px] lg:w-[300px]" />
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="relative mt-14 pl-14 md:pl-0 md:text-center">
            <span className="absolute left-5 md:left-1/2 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-ink bg-paper" aria-hidden="true" />
            <Hand className="text-2xl text-pencil" rotate={-2}>initial commit — Orientation, Sep 2024</Hand>
          </div>
        </div>
      </div>
      <Perforation />
    </section>
  );
};
