import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { ABOUT_TAGLINE, ABOUT_TEXT, DIRECTIVES } from '../../data/about';
import { EVENTS } from '../../data/events';
import { DEPARTMENTS } from '../../data/departments';
import { TEAM } from '../../data/team';
import { FACULTY } from '../../data/faculty';
import { useActiveCell } from './useActiveCell';
import { SectionLabel, Hand, Stamp, Tape, Perforation } from './scrap';

const TAGLINE = ABOUT_TAGLINE.replace('// ', '').toLowerCase();

// Highlighted phrases in ABOUT_TEXT, each annotated with the real events behind it.
const PHRASES = [
  { text: 'hands-on learning', color: '#ffe85c', note: 'Metaverse game-dev workshop · DUCAT hands-on session' },
  { text: 'industry collaboration', color: '#9bd7ff', note: 'STMicroelectronics keynote · DUCAT · Neighborly' },
  { text: 'competitive challenges', color: '#ff8fb1', note: "Codex Hackathon '25 · Coding Triathlon · Algosphere" },
  { text: 'experiential projects', color: '#3ae88a', note: 'robotics / AI integration projects' },
  { text: 'AI users to AI creators', color: '#ffb86b', note: 'the whole point' },
];

const FLAGSHIP_EVENT = EVENTS.find((e) => e.id === 'CMP_002') || EVENTS[1];

// Intentional editorial line breaks (~50-56 chars) with syntactic phrase tagging and punctuation preservation.
const EDITOR_LINES = [
  {
    n: 3,
    tokens: [
      { w: 'AIvolution', p: -1 },
      { w: 'is', p: -1 },
      { w: 'a', p: -1 },
      { w: 'student-led', p: -1 },
      { w: 'ecosystem', p: -1 },
      { w: 'built', p: -1 },
      { w: 'for', p: -1 },
      { w: 'those', p: -1 },
    ],
  },
  {
    n: 4,
    tokens: [
      { w: 'who', p: -1 },
      { w: 'refuse', p: -1 },
      { w: 'to', p: -1 },
      { w: 'simply', p: -1 },
      { w: 'watch', p: -1 },
      { w: 'the', p: -1 },
      { w: 'future', p: -1 },
      { w: 'unfold.', p: -1 },
      { w: 'We', p: -1 },
      { w: 'explore', p: -1 },
    ],
  },
  {
    n: 5,
    tokens: [
      { w: 'emerging', p: -1 },
      { w: 'AI', p: -1 },
      { w: 'technologies,', p: -1 },
      { w: 'deconstruct', p: -1 },
      { w: 'how', p: -1 },
      { w: 'they', p: -1 },
      { w: 'work,', p: -1 },
      { w: 'and', p: -1 },
    ],
  },
  {
    n: 6,
    tokens: [
      { w: 'transform', p: -1 },
      { w: 'knowledge', p: -1 },
      { w: 'into', p: -1 },
      { w: 'practical', p: -1 },
      { w: 'solutions.', p: -1 },
    ],
  },
  {
    n: 7,
    blank: true,
  },
  {
    n: 8,
    tokens: [
      { w: 'Through', p: -1 },
      { w: 'hands-on', p: 0 },
      { w: 'learning', p: 0, punct: ',' },
      { w: 'industry', p: 1 },
      { w: 'collaboration', p: 1, punct: ',' },
    ],
  },
  {
    n: 9,
    tokens: [
      { w: 'competitive', p: 2 },
      { w: 'challenges', p: 2, punct: ',' },
      { w: 'and', p: -1 },
      { w: 'experiential', p: 3 },
      { w: 'projects', p: 3, punct: ',' },
    ],
  },
  {
    n: 10,
    tokens: [
      { w: 'we', p: -1 },
      { w: 'empower', p: -1 },
      { w: 'students', p: -1 },
      { w: 'to', p: -1 },
      { w: 'move', p: -1 },
      { w: 'from', p: -1 },
      { w: 'AI', p: 4 },
      { w: 'users', p: 4 },
      { w: 'to', p: 4 },
      { w: 'AI', p: 4 },
      { w: 'creators', p: 4, punct: '.' },
    ],
  },
];

const RAW = `# ${TAGLINE}\n\n${ABOUT_TEXT.replace(
  /(hands-on learning|industry collaboration|competitive challenges|experiential projects|AI users to AI creators)/g,
  '**$1**'
)}`;
const TABS = [['README.md', '#about'], ['departments/', '#departments'], ['events/', '#events'], ['CONTRIBUTORS.md', '#contributors']];

// README badges, all from data.
const BADGES = [
  ['events', EVENTS.length, '#ff5a1f'],
  ['departments', DEPARTMENTS.length, '#2f6bff'],
  ['core team', TEAM.length, '#3ae88a'],
  ['faculty', FACULTY.length, '#ff8fb1'],
  ['dept', 'CSE-AI', '#ffe85c'],
  ['branch', '⎇ main', '#9bd7ff'],
];

// One folder per directive.
const FOLDERS = [
  { tone: '#ffe85c', accent: 'var(--marker)', note: 'the why', label: 'the toolbox · what we’ve taught so far' },
  { tone: '#9bd7ff', accent: 'var(--pen)', note: 'the where', label: 'the path · how members grow' },
  { tone: '#3ae88a', accent: 'var(--redpen)', note: 'the how', label: 'the checklist · how we work' },
];
const CYCLE = 6;

// What each directive looks like in practice — every line traces to src/data/events.js.
const IN_PRACTICE = [
  'In practice: we get the newest AI tools into students’ hands, fast.',
  'In practice: a path from your first workshop to hackathon finalist to core team.',
  'In practice: three rules we hold ourselves to — with receipts.',
];
const MISSION_TOOLS = [
  ['Agentic AI', 'live tool-calling demo'],
  ['Computer vision', 'CNNs, object detection'],
  ['NLP', 'chatbots, sentiment analysis'],
  ['Game dev & VR', 'Metaverse workshop'],
  ['Git & GitHub', 'branching, PRs, conflicts'],
  ['Enterprise AI', 'AI-integrated ERP'],
];
const VISION_PATH = [
  ['join', 'Orientation — meet the core team, see the year’s roadmap'],
  ['learn', 'workshops, webinars, industrial visits'],
  ['build', 'hackathons — 60+ teams at Codex ’25, 12 finalists'],
  ['lead', 'join the core team and run it next year'],
];
const VALUE_RECEIPTS = [
  'Metaverse · Agentic AI · enterprise ERP sessions',
  'GitHub relay · bug bounty · live problem-solving at DUCAT',
  'Preparation Mantra by a senior member · mentoring at Codex',
];
const CHIP_TONES = ['#ffe85c', '#9bd7ff', '#ff8fb1', '#3ae88a', '#fff', '#ffb86b'];
const firstSentence = (s) => s.split(/(?<=\.)\s+/)[0];

const Panel = ({ i, body, accent }) => {
  if (i === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {MISSION_TOOLS.map(([name, detail], k) => (
          <div key={name} className="dir-pop border-2 border-ink bg-[var(--bg)] text-ink px-4 py-3 shadow-[4px_4px_0_var(--ink)]" style={{ '--bg': CHIP_TONES[k], transform: `rotate(${k % 2 ? 1.5 : -1.5}deg)` }}>
            <p className="font-bricolage font-extrabold text-lg md:text-xl leading-tight">{name}</p>
            <p className="font-mono text-[0.68rem] text-pencil mt-1">{detail}</p>
          </div>
        ))}
      </div>
    );
  }
  if (i === 1) {
    return (
      <ol className="relative">
        {VISION_PATH.map(([step, detail], k) => (
          <li key={step} className="dir-pop flex items-start gap-4 py-2.5" style={{ marginLeft: `${k * 1.5}rem` }}>
            <span className="shrink-0 w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-mono text-xs font-bold" style={{ background: k === 3 ? accent : 'transparent', color: k === 3 ? '#fff' : 'inherit' }}>{k + 1}</span>
            <div className="border-b-2 border-dashed border-current/25 pb-2.5 flex-1">
              <p className="font-bricolage font-extrabold text-2xl md:text-3xl leading-none">{step} <span className="font-hand font-medium text-xl opacity-70">{k < 3 ? '↗' : '★'}</span></p>
              <p className="font-mono text-xs md:text-sm opacity-75 mt-1.5">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  const rules = body.split('. ').map((s) => s.replace(/\.$/, ''));
  return (
    <ul className="space-y-4">
      {rules.map((rule, k) => (
        <li key={rule} className="dir-pop flex items-start gap-4">
          <svg viewBox="0 0 40 40" className="draw w-10 h-10 shrink-0" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="34" height="34" rx="8" stroke="currentColor" />
            <path d="M11 21 L 18 28 L 30 13" stroke={accent} strokeWidth="5" />
          </svg>
          <div>
            <p className="font-bricolage font-extrabold text-xl md:text-2xl leading-tight">{rule}.</p>
            <Hand className="text-lg leading-tight mt-1" style={{ color: accent }}>{VALUE_RECEIPTS[k]}</Hand>
          </div>
        </li>
      ))}
    </ul>
  );
};

// The open folder's contents.
const FolderBody = ({ i }) => {
  const d = DIRECTIVES[i];
  const f = FOLDERS[i];
  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-start">
      <div>
        <div className="dir-in flex flex-wrap items-center gap-3">
          <Stamp rotate={-6} color={f.accent}>{d.id}</Stamp>
          <Tape rotate={2} className="!text-[0.62rem]">README.md ## {d.title.toLowerCase()} · {f.note}</Tape>
        </div>
        <h3 className="dir-in mt-5 text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">{d.title.toLowerCase()}</h3>
        {i !== 2 && <p className="dir-in mt-4 text-base md:text-lg leading-relaxed opacity-85 max-w-xl">{d.body}</p>}
        <Hand className="dir-in block mt-4 text-2xl leading-tight" rotate={-1} color={f.accent}>{IN_PRACTICE[i]}</Hand>
      </div>
      <div className="dir-panel">
        <p className="dir-in font-mono text-[0.65rem] tracking-[0.2em] uppercase opacity-60 mb-4">{f.label}</p>
        <Panel i={i} body={d.body} accent={f.accent} />
      </div>
    </div>
  );
};

export const About = () => {
  const root = useRef(null);
  const folders = useRef(null);
  const lnRef = useRef(null);
  const colRef = useRef(null);
  const cycle = useRef(null);
  const [raw, setRaw] = useState(false);
  const [active, setActive] = useState(0);
  const [hoverPhrase, setHoverPhrase] = useState(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile();
  useReveal(root);
  useActiveCell(root);

  // The README "types itself" as you scroll: words ink in, a cursor and the
  // current-line highlight follow, the status bar reports Ln/Col; badges count up.
  useGSAP(
    () => {
      gsap.from('.badge-n', { innerText: 0, snap: 'innerText', duration: 1.2, ease: 'power2.out', stagger: 0.1, scrollTrigger: { trigger: '.badges', start: 'top 85%', once: true } });
      if (raw) return;
      const words = gsap.utils.toArray('.editor .w', root.current);
      const lines = gsap.utils.toArray('.editor .ln', root.current);
      const traces = gsap.utils.toArray('.editor .trace-item', root.current);
      const place = (i) => {
        words.forEach((w, j) => w.classList.toggle('is-cur', j === i));
        const line = words[i]?.closest('.ln');
        lines.forEach((l) => l.classList.toggle('is-cur', l === line));
        if (lnRef.current && line) {
          lnRef.current.textContent = line.dataset.n;
          colRef.current.textContent = words[i]?.dataset.col || '1';
        }
        const curPhrase = words[i]?.dataset.phrase;
        traces.forEach((tr) => {
          tr.classList.toggle('is-active', curPhrase !== undefined && tr.dataset.phrase === curPhrase);
        });
      };
      if (prefersReducedMotion()) { place(words.length - 1); return; }
      gsap.from(words, {
        opacity: 0.08, stagger: 0.012, ease: 'none',
        scrollTrigger: { trigger: '.editor', start: 'top 75%', end: 'bottom 55%', scrub: 0.3, onUpdate: (self) => place(Math.min(words.length - 1, Math.floor(self.progress * words.length))) },
      });
      gsap.from('.editor .cmt', { x: 12, opacity: 0, stagger: 0.05, duration: 0.45, ease: 'power2.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: '.editor', start: 'top 85%', once: true } });
      gsap.from('.editor .preview-card', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: '.editor', start: 'top 85%', once: true } });
    },
    { scope: root, revertOnUpdate: true, dependencies: [raw] }
  );

  // Folders: fan in on arrival; track whether the section is on screen (auto-cycle only then).
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: folders.current, start: 'top 80%', end: 'bottom 20%', onToggle: (self) => setInView(self.isActive) });
      if (prefersReducedMotion() || isMobile) return;
      gsap.from('.folder-tab', { y: 40, rotation: (i) => (i - 1) * 6, opacity: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.1, scrollTrigger: { trigger: folders.current, start: 'top 80%', once: true } });
      gsap.from('.folder-stack', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: folders.current, start: 'top 80%', once: true } });
    },
    { scope: root, revertOnUpdate: true, dependencies: [isMobile] }
  );

  // Opening a folder: circle-wipe from its tab, contents stagger in, ticks draw.
  useGSAP(
    () => {
      if (isMobile) return;
      const origin = `${(active + 0.5) * (100 / 3)}% 0%`;
      const body = folders.current.querySelector('.folder-body');
      if (!prefersReducedMotion()) {
        gsap.fromTo(body, { clipPath: `circle(0% at ${origin})` }, { clipPath: `circle(150% at ${origin})`, duration: 0.8, ease: 'power2.inOut', clearProps: 'clipPath' });
        gsap.from('.folder-body .dir-in', { y: 24, opacity: 0, stagger: 0.07, duration: 0.45, delay: 0.25 });
        gsap.from('.folder-body .dir-pop', { scale: 0.6, opacity: 0, stagger: 0.06, duration: 0.45, ease: 'back.out(2)', delay: 0.35 });
        gsap.from('.folder-body .draw path, .folder-body .draw rect', { drawSVG: '0%', stagger: 0.05, duration: 0.5, ease: 'power2.inOut', delay: 0.45 });
      }
      // Auto-cycle: a ring fills on the active tab, then the next folder opens.
      if (!inView || prefersReducedMotion()) return;
      const ring = folders.current.querySelector('.folder-tab.is-active .ring-fill');
      const tl = gsap.timeline({ onComplete: () => setActive((a) => (a + 1) % DIRECTIVES.length) });
      if (ring) tl.fromTo(ring, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: CYCLE, ease: 'none' });
      else tl.to({}, { duration: CYCLE });
      cycle.current = tl;
    },
    { scope: root, revertOnUpdate: true, dependencies: [active, inView, isMobile] }
  );

  // Hovering the folders pauses the cycle (DOM listeners live in a plain effect).
  useEffect(() => {
    const el = folders.current;
    if (!el) return undefined;
    const pause = () => cycle.current && cycle.current.pause();
    const resume = () => cycle.current && cycle.current.resume();
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    return () => { el.removeEventListener('pointerenter', pause); el.removeEventListener('pointerleave', resume); };
  }, []);

  let wordIndex = 0;
  return (
    <section id="about" ref={root} className="cell relative bg-cream dotgrid">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionLabel path="README.md" className="reveal" />

        {/* README as a code-editor window */}
        <div className="reveal relative mt-5 border-2 border-ink bg-screen text-[#eaf0ff] shadow-[10px_10px_0_var(--ink)] grain grain--light" style={{ '--reveal-i': 1 }}>
          {/* tab bar */}
          <div className="relative z-[2] flex items-stretch justify-between border-b border-white/10 bg-[#141414]">
            <div className="flex items-stretch min-w-0 overflow-x-auto">
              <span className="flex items-center gap-1.5 px-4 shrink-0" aria-hidden="true">
                <i className="w-3 h-3 rounded-full bg-redpen" /><i className="w-3 h-3 rounded-full bg-highlight" /><i className="w-3 h-3 rounded-full bg-mint" />
              </span>
              {TABS.map(([name, href], i) => (
                <a key={name} href={href} className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs whitespace-nowrap border-r border-white/10 ${i === 0 ? 'bg-screen text-[#eaf0ff] border-t-2 border-t-marker' : 'text-[#eaf0ff]/45 hover:text-[#eaf0ff] hover:bg-white/5'}`}>
                  <span className={i === 0 ? 'text-marker' : 'text-[#eaf0ff]/30'}>{name.endsWith('/') ? '▸' : '●'}</span>{name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1 px-3 font-mono text-xs shrink-0" role="tablist" aria-label="README view">
              {['preview', 'raw'].map((m) => (
                <button key={m} type="button" role="tab" aria-selected={raw === (m === 'raw')} onClick={() => setRaw(m === 'raw')} className={`px-2.5 py-1 rounded ${raw === (m === 'raw') ? 'bg-mint text-ink' : 'text-[#eaf0ff]/60 hover:text-[#eaf0ff]'}`}>{m}</button>
              ))}
            </div>
          </div>

          {/* badges bar */}
          <div className="badges relative z-[2] flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 pt-5 pb-1 border-b border-white/5 bg-white/[0.01]">
            <div className="flex flex-wrap items-center gap-2">
              {BADGES.map(([label, value, color]) => (
                <span key={label} className="badge inline-flex items-stretch font-mono text-[0.68rem] font-bold border-2 border-ink rounded overflow-hidden shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  <span className="px-2 py-0.5 bg-[#25272e] text-[#eaf0ff]/85">{label}</span>
                  <span className="px-2 py-0.5 text-ink" style={{ background: color }}>{typeof value === 'number' ? <span className="badge-n">{value}</span> : value}</span>
                </span>
              ))}
            </div>
            <div className="hidden xl:flex items-center gap-2 font-mono text-[0.65rem] text-[#eaf0ff]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span>env: production</span>
              <span className="text-white/20">|</span>
              <span>encoding: UTF-8</span>
            </div>
          </div>

          {/* body */}
          <div className="relative z-[2]">
            {raw ? (
              <pre className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap px-6 md:px-10 py-7">
                {RAW.split('\n').map((line, i) => (
                  <span key={i} className="block"><span className="inline-block w-10 text-[#eaf0ff]/30 select-none">{i + 1}</span>{line}</span>
                ))}
              </pre>
            ) : (
              <div className="editor grid grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_430px]">
                {/* Left: Code Buffer Pane */}
                <div className="code-pane py-5 md:py-7 lg:pr-4">
                  {/* Line 1: Heading */}
                  <div className="ln grid grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] items-baseline px-2 sm:px-4 py-0.5">
                    <span className="ln-n font-mono text-xs text-[#eaf0ff]/30 text-right pr-4 select-none">1</span>
                    <Hand className="text-2xl md:text-3xl text-mint/90 py-1" rotate={-0.5}># {TAGLINE}</Hand>
                  </div>

                  {/* Line 2: Empty Spacer */}
                  <div className="ln grid grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] items-baseline px-2 sm:px-4 py-0.5">
                    <span className="ln-n font-mono text-xs text-[#eaf0ff]/30 text-right pr-4 select-none">2</span>
                  </div>

                  {/* Lines 3 to 10 */}
                  {EDITOR_LINES.map((line) => {
                    if (line.blank) {
                      return (
                        <div key={line.n} data-n={line.n} className="ln grid grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] items-baseline px-2 sm:px-4 py-1">
                          <span className="ln-n font-mono text-xs text-[#eaf0ff]/30 text-right pr-4 select-none">{line.n}</span>
                        </div>
                      );
                    }

                    let colCounter = 1;
                    return (
                      <div
                        key={line.n}
                        data-n={line.n}
                        className="ln grid grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] items-baseline px-2 sm:px-4 py-1"
                      >
                        <span className="ln-n font-mono text-xs text-[#eaf0ff]/30 text-right pr-4 select-none">
                          {line.n}
                        </span>
                        <p className="font-bricolage font-extrabold text-[clamp(1.15rem,1.75vw,1.7rem)] leading-[1.38] tracking-[-0.01em] text-paper">
                          {line.tokens.map((t, wi) => {
                            const col = colCounter;
                            colCounter += t.w.length + (t.punct ? 1 : 0) + 1;
                            const idx = wordIndex++;
                            const isHovered = hoverPhrase !== null && hoverPhrase === t.p;
                            return (
                              <React.Fragment key={idx}>
                                <span
                                  className={`w inline-block ${t.p !== -1 ? 'tok' : ''} ${isHovered ? 'ring-2' : ''}`}
                                  data-col={col}
                                  data-phrase={t.p !== -1 ? t.p : undefined}
                                  style={t.p !== -1 ? { '--c': PHRASES[t.p].color } : undefined}
                                  onPointerEnter={t.p !== -1 ? () => setHoverPhrase(t.p) : undefined}
                                  onPointerLeave={t.p !== -1 ? () => setHoverPhrase(null) : undefined}
                                >
                                  {t.w}
                                </span>{t.punct && <span className="punct text-[#eaf0ff]/70 select-none">{t.punct}</span>}{' '}
                              </React.Fragment>
                            );
                          })}
                        </p>
                      </div>
                    );
                  })}

                  {/* Line 11: End Spacer */}
                  <div className="ln grid grid-cols-[3rem_1fr] md:grid-cols-[3.75rem_1fr] items-baseline px-2 sm:px-4 py-0.5">
                    <span className="ln-n font-mono text-xs text-[#eaf0ff]/30 text-right pr-4 select-none">11</span>
                  </div>
                </div>

                {/* Right: Companion Inspector Pane (Preview + Runtime Traces) */}
                <div className="inspector-pane border-t lg:border-t-0 lg:border-l border-white/10 bg-[#121418]/70 backdrop-blur-sm flex flex-col justify-between">
                  <div>
                    {/* Inspector Sub-header */}
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 bg-[#16181f]/90 font-mono text-[0.68rem] text-[#eaf0ff]/65">
                      <span className="flex items-center gap-2 font-bold tracking-wider uppercase text-[#eaf0ff]/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                        live preview {'//'} codex_hackathon_2025
                      </span>
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/5 text-mint border border-mint/20 font-semibold">
                        ACTIVE SPRINT
                      </span>
                    </div>

                    {/* Compact Event Preview Card */}
                    <div className="p-4 sm:p-5 border-b border-white/10">
                      <div className="preview-card group relative rounded-xl border border-white/15 bg-gradient-to-br from-[#1c202a] to-[#121418] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-[0.64rem] tracking-wider uppercase font-bold text-mint flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                            FLAGSHIP COMPETITION
                          </span>
                          <span className="font-mono text-[0.62rem] text-[#eaf0ff]/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {FLAGSHIP_EVENT.date}
                          </span>
                        </div>

                        <div className="flex gap-3.5 items-center">
                          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/20 bg-black/50 shadow-inner">
                            <img
                              src={FLAGSHIP_EVENT.imgUrl}
                              alt={FLAGSHIP_EVENT.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <Tape rotate={-6} tone="blue" className="!text-[0.5rem] !py-0.5 !px-1 absolute -top-1 -left-1">
                              rec
                            </Tape>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bricolage font-extrabold text-lg leading-snug text-paper group-hover:text-mint transition-colors truncate">
                              {FLAGSHIP_EVENT.title}
                            </h4>
                            <p className="font-mono text-[0.68rem] text-pencil line-clamp-2 mt-1 leading-relaxed">
                              {FLAGSHIP_EVENT.summary}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded bg-white/5 text-[#eaf0ff]/75 border border-white/10">
                                60+ Teams
                              </span>
                              <span className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded bg-white/5 text-[#eaf0ff]/75 border border-white/10">
                                ₹19k+ Pool
                              </span>
                              <span className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded bg-mint/10 text-mint border border-mint/30 font-semibold">
                                12 Finalists
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-[0.65rem] text-[#eaf0ff]/40">{'//'} department flagship</span>
                          <Link
                            to="/events"
                            className="inline-flex items-center gap-1 font-bold text-mint hover:underline decoration-2 underline-offset-2"
                          >
                            inspect event report →
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Runtime Traces / Annotations */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[0.65rem] text-[#eaf0ff]/45 tracking-wider uppercase mb-1">
                        <span>{'//'} runtime traces ({PHRASES.length})</span>
                        <span className="text-[0.6rem] text-pencil">hover to trace</span>
                      </div>
                      {PHRASES.map((p, idx) => (
                        <div
                          key={p.text}
                          data-phrase={idx}
                          className={`trace-item cmt group flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.025] border border-white/5 cursor-pointer ${
                            hoverPhrase === idx ? 'is-active' : ''
                          }`}
                          style={{ '--phrase-color': p.color }}
                          onPointerEnter={() => setHoverPhrase(idx)}
                          onPointerLeave={() => setHoverPhrase(null)}
                        >
                          <span
                            className="trace-dot shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 transition-all duration-200"
                            style={{ background: p.color, boxShadow: `0 0 6px ${p.color}40` }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <span
                                className="font-mono text-[0.68rem] font-bold uppercase tracking-wide truncate"
                                style={{ color: p.color }}
                              >
                                {p.text}
                              </span>
                            </div>
                            <Hand
                              className="text-sm leading-snug block mt-0.5 text-[#eaf0ff]/80 group-hover:text-paper"
                              style={{ color: p.color }}
                            >
                              {p.note}
                            </Hand>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Companion footer info */}
                  <div className="px-5 py-2.5 border-t border-white/10 bg-[#15171d]/60 font-mono text-[0.62rem] text-[#eaf0ff]/40 flex items-center justify-between">
                    <span>sync: live branch {'//'} main</span>
                    <span className="text-mint">● verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* status bar */}
          <div className="relative z-[2] flex items-center justify-between gap-4 px-4 py-1.5 bg-[#141414] border-t border-white/10 font-mono text-[0.68rem] text-[#eaf0ff]/60">
            <div className="flex items-center gap-4"><span className="text-mint">⎇ main*</span><span className="hidden sm:inline">UTF-8</span><span className="hidden sm:inline">Markdown</span></div>
            <div className="flex items-center gap-4"><span>Ln <span ref={lnRef}>1</span>, Col <span ref={colRef}>1</span></span><span>{ABOUT_TEXT.split(' ').length} words</span><span className="text-mint">● no problems</span></div>
          </div>

          <Tape rotate={-3} tone="blue" className="absolute -top-4 right-28 hidden sm:inline-block z-[3]">last updated: this semester</Tape>
          <Stamp rotate={8} color="var(--mint)" className="absolute -bottom-5 right-8 hidden sm:inline-block z-[3] bg-screen">reviewed ✓</Stamp>
        </div>

        {/* mission / vision / values as a tabbed folder — all three tabs always in view */}
        <div ref={folders} className="folders relative mt-20 md:mt-24">
          <div className="reveal flex flex-wrap items-center gap-3 mb-5">
            <SectionLabel bare><span className="text-pen font-bold">README.md</span> ## mission · vision · values</SectionLabel>
            <Hand className="text-xl text-pencil" rotate={-2}>{isMobile ? 'three folders, all open' : 'click a tab — or wait, they take turns'}</Hand>
          </div>

          {isMobile ? (
            <div className="space-y-8">
              {DIRECTIVES.map((d, i) => (
                <article key={d.id} className="border-[3px] border-ink shadow-[6px_6px_0_var(--ink)] p-6 text-ink" style={{ background: FOLDERS[i].tone }}>
                  <FolderBody i={i} />
                </article>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 items-end" role="tablist" aria-label="Mission, vision, values">
                {DIRECTIVES.map((d, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      onPointerEnter={() => setActive(i)}
                      className={`folder-tab relative text-left border-[3px] border-b-0 border-ink rounded-t-2xl px-5 pt-4 transition-[padding,background] duration-300 ${isActive ? 'is-active pb-6 text-ink' : 'pb-3 bg-paper text-ink/70 hover:bg-cream'}`}
                      style={{ background: isActive ? FOLDERS[i].tone : undefined, zIndex: isActive ? 3 : 1 }}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase opacity-70">{d.id}</span>
                        <svg viewBox="0 0 36 36" className="w-6 h-6 shrink-0" aria-hidden="true">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="4" />
                          {isActive && <circle className="ring-fill" cx="18" cy="18" r="15" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100" transform="rotate(-90 18 18)" />}
                        </svg>
                      </span>
                      <span className="block font-bricolage font-extrabold text-2xl lg:text-3xl leading-none mt-1">{d.title.toLowerCase()}</span>
                      <span className={`block mt-2 text-sm leading-snug ${isActive ? 'opacity-90' : 'opacity-60'}`}>{firstSentence(d.body)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="folder-stack relative">
                <div className="absolute inset-x-4 -bottom-3 h-full border-[3px] border-ink bg-paper rotate-[0.6deg]" aria-hidden="true" />
                <div className="absolute inset-x-8 -bottom-6 h-full border-[3px] border-ink bg-cream rotate-[-0.6deg]" aria-hidden="true" />
                <div key={active} className="folder-body relative border-[3px] border-ink shadow-[10px_10px_0_var(--ink)] p-8 lg:p-12 text-ink min-h-[520px]" style={{ background: FOLDERS[active].tone }}>
                  <FolderBody i={active} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Perforation />
    </section>
  );
};
