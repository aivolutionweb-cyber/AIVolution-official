import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, Draggable, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { DEPARTMENTS } from '../../data/departments';
import { EVENTS } from '../../data/events';
import { ABOUT_TEXT, ABOUT_TAGLINE } from '../../data/about';
import { TYPE } from '../events/eventType';
import { WHATSAPP } from './scrap';

// The hero's playable network of what the society actually is:
// what we run (event types, coloured like the /events lanes) → who runs it (departments) → AI creators.
// Hover / tap a node to trace it, drag one to stretch the wires (it springs back).
const RUNS = [
  { label: 'hackathons', types: ['competition', 'gallery'], color: TYPE.competition[1] },
  { label: 'workshops', types: ['workshop'], color: TYPE.workshop[1] },
  { label: 'webinars', types: ['webinar'], color: TYPE.webinar[1] },
  { label: 'industrial visits', types: ['visit'], color: TYPE.visit[1] },
];

const W = 480;
const H = 500;
const Y = { in: 92, hid: 282, out: 420 };
const MARKER = '#ff5a1f';
const INK = '#141414';
const xs = (n) => Array.from({ length: n }, (_, i) => 60 + (i * 360) / Math.max(n - 1, 1));
const short = (t) => t.replace('Management', 'Mgmt').replace('Public Relations', 'PR');
const OUT_LINE = ABOUT_TEXT.split('. ').pop();
const TAGLINE = ABOUT_TAGLINE.replace(/^\/\/\s*/, '').toLowerCase();

const INS = RUNS.map((r, i) => ({
  id: `in${i}`, layer: 'in', x: xs(RUNS.length)[i], y: Y.in, r: 12, fill: r.color, label: r.label,
  events: EVENTS.filter((e) => r.types.includes(e.type)),
}));
const HIDS = DEPARTMENTS.map((d, i) => ({
  id: `hid${i}`, layer: 'hid', x: xs(DEPARTMENTS.length)[i], y: Y.hid, r: 12, fill: 'var(--highlight)', label: short(d.title), dept: d,
}));
const OUT = { id: 'out', layer: 'out', x: W / 2, y: Y.out, r: 19, fill: 'var(--marker)', label: 'AI creators' };
const NODES = [...INS, ...HIDS, OUT];
const EDGES = [
  ...INS.flatMap((a) => HIDS.map((b) => ({ id: `${a.id}-${b.id}`, a, b }))),
  ...HIDS.map((a) => ({ id: `${a.id}-out`, a, b: OUT })),
];

const curve = (a, b) => {
  const k = (b.y - a.y) * 0.5;
  return `M${a.x} ${a.y} C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
};
const isLit = (e, act) => !!act && (act.layer === 'out' || e.a === act || e.b === act || (act.layer === 'in' && e.b === OUT));
const labelY = (n, i) => {
  if (n.layer === 'in') return n.y - (i % 2 ? 44 : 24);
  if (n.layer === 'hid') return n.y + (i % 2 ? 52 : 34);
  return n.y + 48;
};

const Kicker = ({ children, color }) => (
  <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-pencil">
    {color && <span className="w-2.5 h-2.5 rounded-full border border-ink" style={{ background: color }} />}
    {children}
  </p>
);

const Readout = ({ node, fine, onClear }) => {
  const clear = (
    <button type="button" onClick={onClear} className="absolute top-3 right-3 font-mono text-xs text-pencil hover:text-ink" aria-label="Clear selection">
      esc ✕
    </button>
  );

  if (!node) {
    return (
      <div key="idle" className="hn-readout-in">
        <Kicker>what we run → who runs it → AI creators</Kicker>
        <p className="font-hand text-3xl leading-none mt-2">{TAGLINE}</p>
        <p className="mt-3 text-sm text-pencil leading-relaxed">
          {fine ? 'Hover any node to trace it — or grab one and let it snap back.' : 'Tap any node to trace it.'}
        </p>
        <p className="mt-2 font-mono text-xs text-pencil">
          {EVENTS.length} events · {DEPARTMENTS.length} departments · 1 output
        </p>
      </div>
    );
  }

  if (node.layer === 'in') {
    const shown = node.events.slice(0, 3);
    return (
      <div key={node.id} className="hn-readout-in">
        {clear}
        <Kicker color={node.fill}>events/ · {node.events.length} logged</Kicker>
        <h3 className="font-bricolage font-extrabold text-2xl leading-tight mt-1">{node.label}</h3>
        <ul className="mt-2 divide-y divide-dashed divide-ink/25">
          {shown.map((e) => (
            <li key={e.id}>
              <Link to="/events" className="group flex items-baseline justify-between gap-3 py-1.5 text-sm">
                <span className="font-semibold truncate group-hover:underline decoration-2 underline-offset-2">{e.title}</span>
                <span className="font-mono text-[0.7rem] text-pencil whitespace-nowrap">{e.date}</span>
              </Link>
            </li>
          ))}
        </ul>
        {node.events.length > shown.length && (
          <Link to="/events" className="font-mono text-xs text-pen hover:underline">+{node.events.length - shown.length} more →</Link>
        )}
      </div>
    );
  }

  if (node.layer === 'hid') {
    const d = node.dept;
    return (
      <div key={node.id} className="hn-readout-in">
        {clear}
        <Kicker color="var(--highlight)">departments/{d.key}/ · {d.id}</Kicker>
        <h3 className="font-bricolage font-extrabold text-2xl leading-tight mt-1">{d.title}</h3>
        <p className="mt-2 text-sm text-pencil leading-relaxed">{d.desc}</p>
        <Link to="/team" className="inline-block mt-2 font-bricolage font-extrabold text-sm hover:underline decoration-2 underline-offset-2">
          meet the team →
        </Link>
      </div>
    );
  }

  return (
    <div key="out" className="hn-readout-in">
      {clear}
      <Kicker color="var(--marker)">output · {TAGLINE}</Kicker>
      <h3 className="font-bricolage font-extrabold text-2xl leading-tight mt-1">AI creators</h3>
      <p className="mt-2 text-sm text-pencil leading-relaxed">{OUT_LINE}</p>
      <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-block mt-2 font-bricolage font-extrabold text-sm hover:underline decoration-2 underline-offset-2">
        Join AIvolutions →
      </a>
    </div>
  );
};

export const HeroNetwork = forwardRef(({ introDelay = 0, className = '' }, ref) => {
  const root = useRef(null);
  const svg = useRef(null);
  const nodeEls = useRef({});
  const edgeEls = useRef({});
  const sigEls = useRef({});
  const tls = useRef({});
  const dragged = useRef(false);
  const engaged = useRef(false);
  const lastClick = useRef(0);
  const [activeId, setActiveId] = useState(null);
  const [fine, setFine] = useState(false);
  const active = NODES.find((n) => n.id === activeId) || null;

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion());
  }, []);

  const pos = (n) => {
    const el = nodeEls.current[n.id];
    return el ? { x: n.x + gsap.getProperty(el, 'x'), y: n.y + gsap.getProperty(el, 'y') } : n;
  };
  const redraw = () => EDGES.forEach((e) => {
    const d = curve(pos(e.a), pos(e.b));
    [edgeEls.current[e.id], sigEls.current[e.id]].forEach((p) => p && p.setAttribute('d', d));
  });

  // One timeline per edge / ring so re-firing restarts it instead of stacking.
  const run = (key, build, delay) => {
    if (tls.current[key]) tls.current[key].kill();
    tls.current[key] = build(gsap.timeline({ delay }));
  };
  const pulse = (edgeId, color, delay) => {
    const s = sigEls.current[edgeId];
    if (!s) return;
    run(edgeId, (tl) => tl
      .set(s, { attr: { stroke: color }, opacity: 1, drawSVG: '0% 0%' })
      .to(s, { drawSVG: '0% 30%', duration: 0.16, ease: 'none' })
      .to(s, { drawSVG: '70% 100%', duration: 0.38, ease: 'none' })
      .to(s, { drawSVG: '100% 100%', duration: 0.14, ease: 'none' })
      .set(s, { opacity: 0 }), delay);
  };
  const ping = (id, color, delay, big = false) => {
    const ring = root.current && root.current.querySelector(`[data-ring="${id}"]`);
    if (!ring) return;
    run(`ring-${id}`, (tl) => tl
      .set(ring, { attr: { stroke: color } })
      .fromTo(ring, { scale: 1, opacity: 0.95 }, {
        scale: big ? 3.6 : 2.5, opacity: 0, transformOrigin: '50% 50%', duration: big ? 1 : 0.65, ease: 'power2.out',
      }), delay);
  };

  const { contextSafe } = useGSAP(
    () => {
      gsap.set('.hn-signal', { opacity: 0 });
      if (prefersReducedMotion()) return undefined;

      gsap.from('.hn-edge', {
        drawSVG: '0%', duration: 1.4, ease: 'power2.inOut', stagger: 0.025, delay: introDelay + 0.2,
        clearProps: 'strokeDasharray,strokeDashoffset',
      });
      // .hn-core's hover scale is CSS-owned, so the pop-in and breathing live on the dots.
      gsap.from('.hn-dot', {
        scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.5)', stagger: 0.05, delay: introDelay + 0.3,
      });
      gsap.to('.hn-dot', {
        scale: 1.18, transformOrigin: '50% 50%', duration: 1.4, ease: 'sine.inOut', delay: introDelay + 1.6,
        yoyo: true, repeat: -1, stagger: { each: 0.12, from: 'random' },
      });

      // Idle heartbeat: a random input fires every few seconds while nobody is playing with it.
      gsap.to({}, {
        duration: 3.2, repeat: -1, delay: introDelay + 1.4,
        onRepeat: () => {
          if (engaged.current || document.hidden || !ScrollTrigger.isInViewport(root.current)) return;
          fire(INS[gsap.utils.random(0, INS.length - 1, 1)].id);
        },
      });

      if (!window.matchMedia('(pointer: fine)').matches) return undefined;
      // Bounds keep each dot's centre on the paper. Bounding by the <svg> measures the whole node
      // (label + hit area), so edge nodes like "industrial visits" / "PR" got shoved inward on load.
      NODES.forEach((n) => Draggable.create(nodeEls.current[n.id], {
        type: 'x,y',
        bounds: { minX: -n.x, maxX: W - n.x, minY: -n.y, maxY: H - n.y },
        edgeResistance: 0.65,
        zIndexBoost: false,
        onPress() { gsap.killTweensOf(this.target, 'x,y'); },
        onDragStart() { dragged.current = true; },
        onDrag: redraw,
        onRelease() {
          gsap.to(this.target, { x: 0, y: 0, duration: 1.3, ease: 'elastic.out(1, 0.3)', onUpdate: redraw });
          if (this.isDragging || dragged.current) fire(this.target.dataset.id);
          setTimeout(() => { dragged.current = false; }, 80);
        },
      }));
      redraw();
      return undefined;
    },
    { scope: root }
  );

  // Signals travel the real wiring: inputs → every department → AI creators.
  const fire = contextSafe((id) => {
    if (prefersReducedMotion()) return;
    const n = NODES.find((x) => x.id === id);
    if (!n) return;
    const T = 0.62;
    if (n.layer === 'in') {
      ping(n.id, n.fill, 0);
      HIDS.forEach((h, j) => {
        pulse(`${n.id}-${h.id}`, n.fill, j * 0.04);
        ping(h.id, n.fill, T + j * 0.04);
        pulse(`${h.id}-out`, MARKER, T + j * 0.04);
      });
      ping(OUT.id, MARKER, 2 * T + 0.1);
    } else if (n.layer === 'hid') {
      INS.forEach((a, i) => pulse(`${a.id}-${n.id}`, a.fill, i * 0.06));
      ping(n.id, INK, T + 0.15);
      pulse(`${n.id}-out`, MARKER, T + 0.15);
      ping(OUT.id, MARKER, 2 * T + 0.2);
    } else {
      INS.forEach((a, i) => {
        ping(a.id, a.fill, i * 0.1);
        HIDS.forEach((h, j) => pulse(`${a.id}-${h.id}`, a.fill, i * 0.1 + j * 0.03));
      });
      HIDS.forEach((h, j) => {
        ping(h.id, INK, T + 0.35 + j * 0.03);
        pulse(`${h.id}-out`, MARKER, T + 0.35 + j * 0.03);
      });
      ping(OUT.id, MARKER, 2 * T + 0.45, true);
    }
  });

  useImperativeHandle(ref, () => ({ fire }));

  const hoverNode = (id) => {
    if (dragged.current || id === activeId) return;
    setActiveId(id);
    fire(id);
  };
  const clickNode = (e, id) => {
    e.stopPropagation();
    const now = Date.now();
    if (dragged.current || now - lastClick.current < 250) return;
    lastClick.current = now;
    setActiveId(id);
    fire(id);
  };
  const runAll = () => {
    setActiveId(OUT.id);
    fire(OUT.id);
  };

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') engaged.current = true; }}
      onPointerLeave={() => { engaged.current = false; }}
      onKeyDown={(e) => { if (e.key === 'Escape') setActiveId(null); }}
    >
      <div>
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="hn-net block w-full h-auto lg:h-[min(54vh,540px)] select-none touch-manipulation"
          fill="none"
          overflow="visible"
          data-active={active ? active.layer : undefined}
          onClick={() => setActiveId(null)}
          role="group"
          aria-label="What AIvolutions runs, who runs it, and what it creates"
        >
          <defs>
            <filter id="hn-wobble" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence baseFrequency="0.02" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="4" />
            </filter>
          </defs>

          <g strokeLinecap="round" filter="url(#hn-wobble)">
            {EDGES.map((e) => (
              <path
                key={e.id}
                ref={(el) => { edgeEls.current[e.id] = el; }}
                className={`hn-edge ${isLit(e, active) ? 'is-lit' : ''}`}
                d={curve(e.a, e.b)}
              />
            ))}
          </g>
          <g>
            {EDGES.map((e) => (
              <path
                key={e.id}
                ref={(el) => { sigEls.current[e.id] = el; }}
                className="hn-signal"
                d={curve(e.a, e.b)}
              />
            ))}
          </g>

          <g className="font-mono pointer-events-none" fontSize="10" fill="var(--pencil)" letterSpacing="2">
            <text x="0" y="20">WHAT WE RUN</text>
            <text x="0" y={Y.hid + 82}>WHO RUNS IT</text>
            <text x={OUT.x} y={H - 8} textAnchor="middle">OUTPUT</text>
          </g>

          {[INS, HIDS, [OUT]].map((layer) => layer.map((n, i) => {
            const on = activeId === n.id;
            const dim = active && !on && active.layer === n.layer && n.layer !== 'out';
            return (
              <g
                key={n.id}
                ref={(el) => { nodeEls.current[n.id] = el; }}
                data-id={n.id}
                className={`hn-node ${on ? 'is-active' : ''} ${dim ? 'is-dim' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={n.layer === 'in' ? `${n.label}: ${n.events.length} events` : n.layer === 'hid' ? `${n.dept.title} department` : 'AI creators'}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') hoverNode(n.id); }}
                onFocus={() => hoverNode(n.id)}
                onClick={(e) => clickNode(e, n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(n.id); fire(n.id); }
                }}
              >
                <g className="hn-core">
                  <circle cx={n.x} cy={n.y} r={n.r + 16} fill="#000" fillOpacity="0" />
                  <circle data-ring={n.id} cx={n.x} cy={n.y} r={n.r} stroke={INK} strokeWidth="2" opacity="0" />
                  <circle className="hn-dot" cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke="var(--ink)" strokeWidth="2.5" />
                </g>
                <text
                  className={`hn-label font-hand ${n.layer === 'out' ? 'hn-label--out' : ''}`}
                  x={n.x}
                  y={labelY(n, i)}
                  textAnchor="middle"
                  fontSize={n.layer === 'out' ? 28 : 20}
                  fontWeight={n.layer === 'out' ? 700 : undefined}
                >
                  {n.label}
                </text>
              </g>
            );
          }))}
        </svg>
      </div>

      {/* Index card taped under the drawing; the forward pass is a sticker slapped on its corner. */}
      <div className="hn-card relative mt-3 mx-auto w-[94%] px-4 pt-4 pb-7 min-h-[11rem]" aria-live="polite">
        <span className="tape absolute -top-3 left-1/2 -ml-12 w-24 h-6 p-0" style={{ '--r': '-3deg' }} aria-hidden="true" />
        <Readout node={active} fine={fine} onClear={() => setActiveId(null)} />
        <button
          type="button"
          onClick={runAll}
          className="btn-sticker absolute -bottom-5 -right-3 !px-3.5 !py-2 !text-sm !rounded-xl"
          style={{ '--bg': 'var(--highlight)', '--r': '4deg' }}
        >
          <span aria-hidden="true">▶</span> forward pass
        </button>
      </div>
    </div>
  );
});
