import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { EVENTS } from '../../data/events';
import '../../styles/cutout.css';

// Transform existing AIVolution events into 5 structured categories:
// Workshops, Competitions, Webinars, Industrial Visit, Miscellaneous
function buildCutoutCategories() {
  const getEventData = (event, categoryName) => {
    const gallery = event.gallery && event.gallery.length > 0 ? event.gallery : [event.imgUrl];
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      summary: event.summary,
      facts: event.facts || [],
      sections: event.sections || [],
      coverImg: event.imgUrl || gallery[0],
      gallery,
      category: categoryName,
    };
  };

  // 1. Workshops (From Prompt to Production, Metaverse Game Dev)
  const workshopEvents = EVENTS.filter((e) => e.type === 'workshop').map((e) => getEventData(e, 'Workshops'));

  // 2. Competitions (Codex Hackathon 2025, The Coding Triathlon, Algosphere)
  const compEvents = EVENTS.filter((e) => e.type === 'competition' || e.type === 'gallery').map((e) => getEventData(e, 'Competitions'));

  // 3. Webinars (Enterprise Application Suite, Preparation Mantra)
  const webinarEvents = EVENTS.filter((e) => e.id === 'WEB_ERP' || e.id === 'WEB_001').map((e) => getEventData(e, 'Webinars'));

  // 4. Industrial Visit (DUCAT Pitampura)
  const visitEvents = EVENTS.filter((e) => e.type === 'visit').map((e) => getEventData(e, 'Industrial Visit'));

  // 5. Miscellaneous (Orientation 2024, Society Kickoff & Community Highlights)
  const miscEvents = [
    ...EVENTS.filter((e) => e.id === 'WEB_002').map((e) => getEventData(e, 'Miscellaneous')),
    {
      id: 'MISC_COMMUNITY',
      title: 'AIvolutions Community & Research Highlights',
      date: '2024–2026 Academic Year',
      summary: 'Student chapter research demos, mentorship circles, open-source sprints, and department showcases.',
      facts: ['Community Sprints', 'AI Mentorship', 'Student Showcases', 'Open Source'],
      sections: [
        {
          heading: 'Community Culture',
          body: 'AIvolutions brings together students from CSE-AI, CSE-DS, and CSE-AIML at MAIT to cultivate practical engineering skills, open-source contribution, and cutting-edge artificial intelligence projects.',
        },
        {
          heading: 'Year-Round Engagement',
          body: 'Through weekly code labs, project guidance, peer code reviews, and guest sessions with tech founders and AI leaders, members transition from classroom theory to production-grade implementation.',
        },
      ],
      coverImg: '/assets/events/coding-triathlon/day3_group.webp',
      gallery: [
        '/assets/events/coding-triathlon/day3_group.webp',
        '/assets/events/prompt-to-production/core_team.jpg',
        '/assets/events/codex-2025/team_group.webp',
      ],
      category: 'Miscellaneous',
    },
  ];

  return [
    {
      id: 'competitions',
      word: 'COMPETITIONS',
      note: 'HACKATHONS & CODE SHOWDOWNS',
      paper: '#DE3B22',
      ink: '#FFF3E4',
      pencil: '#FFE66B',
      rot: 3.2,
      desktopPos: { top: '15%', left: '55%' },
      tabletPos: { top: '18%', left: '46%' },
      mobilePos: { top: '22%', left: '6%' },
      statement: 'Flagship hackathons, live grand finales, 3-day challenge relays, and competitive problem-solving.',
      events: compEvents,
    },
    {
      id: 'workshops',
      word: 'WORKSHOPS',
      note: 'HANDS-ON LABS & EXPERT TALKS',
      paper: '#EFB61F',
      ink: '#241C10',
      pencil: '#CC3A22',
      rot: -2.4,
      desktopPos: { top: '44%', left: '10%' },
      tabletPos: { top: '38%', left: '8%' },
      mobilePos: { top: '36%', left: '6%' },
      statement: 'Hands-on workshops, agentic AI systems, prompt engineering, and metaverse game development.',
      events: workshopEvents,
    },
    {
      id: 'webinars',
      word: 'WEBINARS',
      note: 'TECH TALKS & CAREER ROADMAPS',
      paper: '#3AE88A',
      ink: '#14281E',
      pencil: '#FFE66B',
      rot: -1.8,
      desktopPos: { top: '44%', left: '58%' },
      tabletPos: { top: '52%', left: '20%' },
      mobilePos: { top: '50%', left: '6%' },
      statement: 'Industry leadership talks, enterprise application suites, society roadmaps, and preparation strategies.',
      events: webinarEvents,
    },
    {
      id: 'industrial-visit',
      word: 'INDUSTRIAL VISIT',
      note: 'INDUSTRY CAMPUS & REAL DEPLOYMENT',
      paper: '#EFE3D2',
      ink: '#33291F',
      pencil: '#B4795A',
      rot: 2.6,
      desktopPos: { top: '63%', left: '28%' },
      tabletPos: { top: '68%', left: '18%' },
      mobilePos: { top: '64%', left: '6%' },
      statement: 'Direct industry immersion, IT campus labs, live problem solving, and hands-on ML/CV/NLP.',
      events: visitEvents,
    },
    {
      id: 'miscellaneous',
      word: 'MISCELLANEOUS',
      note: 'ORIENTATION, EXAM PREP & LIFE',
      paper: '#191715',
      ink: '#F4F1E8',
      pencil: '#FF5B39',
      rot: -3.0,
      desktopPos: { top: '81%', left: '22%' },
      tabletPos: { top: '82%', left: '14%' },
      mobilePos: { top: '78%', left: '6%' },
      statement: 'Society kickoff, technical orientation, mentoring, student chapter milestones, and community moments.',
      events: miscEvents,
    },
  ];
}

const CATEGORIES = buildCutoutCategories();

// Where an event sits in CATEGORIES, so `/events?event=<id>` can open straight on its dossier.
const locateEvent = (id) => {
  for (let c = 0; c < CATEGORIES.length; c++) {
    const e = CATEGORIES[c].events.findIndex((ev) => ev.id === id);
    if (e !== -1) return { c, e, event: CATEGORIES[c].events[e] };
  }
  return null;
};

export const CutoutEventsGallery = () => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cutTimelineRef = useRef(null);
  const { search } = useLocation();
  const [linked] = useState(() => locateEvent(new URLSearchParams(search).get('event')));

  const [phase, setPhase] = useState(linked ? 'sheet' : 'mat'); // 'mat' | 'cutting' | 'sheet'
  const [activeCatIdx, setActiveCatIdx] = useState(linked ? linked.c : 0);
  const [activeEventIdx, setActiveEventIdx] = useState(linked ? linked.e : 0);
  const [hoveredWordIdx, setHoveredWordIdx] = useState(null);
  const [modalEvent, setModalEvent] = useState(linked ? linked.event : null);
  const [modalPhotoIdx, setModalPhotoIdx] = useState(0);

  const currentCategory = useMemo(() => CATEGORIES[activeCatIdx] || CATEGORIES[0], [activeCatIdx]);
  const currentEvents = useMemo(() => currentCategory.events || [], [currentCategory]);
  const activeEvent = useMemo(() => currentEvents[activeEventIdx] || currentEvents[0] || null, [currentEvents, activeEventIdx]);

  // Handle category selection with Cutout Stencil Animation
  const handleSelectCategory = useCallback((catIdx) => {
    setActiveCatIdx(catIdx);
    setActiveEventIdx(0);
    setPhase('cutting');

    if (cutTimelineRef.current) {
      cutTimelineRef.current.kill();
    }

    // Play Cutout transition animation
    cutTimelineRef.current = gsap.timeline({
      onComplete: () => {
        setPhase('sheet');
      },
    });

    cutTimelineRef.current.to({}, { duration: 1.25 });
  }, []);

  // Skip Cutout animation straight to sheet
  const handleSkipCut = useCallback(() => {
    if (cutTimelineRef.current) {
      cutTimelineRef.current.kill();
    }
    setPhase('sheet');
  }, []);

  // Return to cutting mat
  const handleBackToMat = useCallback(() => {
    if (cutTimelineRef.current) {
      cutTimelineRef.current.kill();
    }
    setPhase('mat');
    setModalEvent(null);
  }, []);

  // Open full modal dossier & gallery
  const handleOpenModal = useCallback((event, photoIdx = 0) => {
    setModalEvent(event);
    setModalPhotoIdx(photoIdx);
  }, []);

  // Keyboard navigation: Escape to go back, ArrowLeft/ArrowRight to step through events or photos
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (modalEvent) {
          setModalEvent(null);
        } else if (phase === 'sheet') {
          handleBackToMat();
        }
      } else if (modalEvent) {
        if (e.key === 'ArrowRight') {
          setModalPhotoIdx((prev) => (prev + 1) % modalEvent.gallery.length);
        } else if (e.key === 'ArrowLeft') {
          setModalPhotoIdx((prev) => (prev - 1 + modalEvent.gallery.length) % modalEvent.gallery.length);
        }
      } else if (phase === 'sheet') {
        if (e.key === 'ArrowRight') {
          setActiveEventIdx((prev) => (prev + 1) % currentEvents.length);
        } else if (e.key === 'ArrowLeft') {
          setActiveEventIdx((prev) => (prev - 1 + currentEvents.length) % currentEvents.length);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, modalEvent, currentEvents.length, handleBackToMat]);

  // Pointer tracking for custom pixel cursor
  useEffect(() => {
    const root = rootRef.current;
    const cur = cursorRef.current;
    if (!root || !cur) return;

    const onPointerMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cur.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cur.style.opacity = '1';
    };

    const onPointerLeave = () => {
      if (cur) cur.style.opacity = '0';
    };

    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);

    return () => {
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // Render Green Self-Healing Cutting Mat Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    let isCancelled = false;
    const matImg = new Image();
    matImg.src = '/assets/events/cutout/mat.jpg';

    const renderMat = () => {
      if (isCancelled) return;
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = rect.width;
      const H = rect.height;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // 1. Desk Wood / Warm Cardstock Border
      ctx.fillStyle = '#E7DFCE';
      ctx.fillRect(0, 0, W, H);

      const deskGrad = ctx.createLinearGradient(0, 0, W, H);
      deskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      deskGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      deskGrad.addColorStop(1, '#D3C8B1');
      ctx.fillStyle = deskGrad;
      ctx.fillRect(0, 0, W, H);

      if (W <= 0 || H <= 0) return;

      // 2. Green Self-Healing Mat Margins
      const padX = Math.max(16, W * 0.024);
      const padY = Math.max(16, H * 0.028);
      const matW = Math.max(200, W - padX * 2);
      const matH = Math.max(200, H - padY * 2);
      const cornerR = Math.max(2, Math.min(12, matW * 0.012));

      // Mat Drop Shadow onto Desk
      ctx.save();
      ctx.shadowColor = 'rgba(28, 22, 14, 0.38)';
      ctx.shadowBlur = Math.max(20, matW * 0.024);
      ctx.shadowOffsetY = Math.max(8, matH * 0.014);
      ctx.fillStyle = '#2C4E3E';

      // Rounded rect for mat
      ctx.beginPath();
      ctx.moveTo(padX + cornerR, padY);
      ctx.arcTo(padX + matW, padY, padX + matW, padY + matH, cornerR);
      ctx.arcTo(padX + matW, padY + matH, padX, padY + matH, cornerR);
      ctx.arcTo(padX, padY + matH, padX, padY, cornerR);
      ctx.arcTo(padX, padY, padX + matW, padY, cornerR);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Clip inside mat
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(padX + cornerR, padY);
      ctx.arcTo(padX + matW, padY, padX + matW, padY + matH, cornerR);
      ctx.arcTo(padX + matW, padY + matH, padX, padY + matH, cornerR);
      ctx.arcTo(padX, padY + matH, padX, padY, cornerR);
      ctx.arcTo(padX, padY, padX + matW, padY, cornerR);
      ctx.closePath();
      ctx.clip();

      // Draw high-res photographic cutting mat texture if loaded
      if (matImg.complete && matImg.naturalWidth > 0) {
        ctx.drawImage(matImg, padX, padY, matW, matH);
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#2C4E3E';
        ctx.fillRect(padX, padY, matW, matH);
        ctx.restore();
      } else {
        // Procedural Green Mat Background
        ctx.fillStyle = '#2C4E3E';
        ctx.fillRect(padX, padY, matW, matH);

        // Mottled texture
        const mottleGrad = ctx.createLinearGradient(padX, padY, padX + matW, padY + matH);
        mottleGrad.addColorStop(0, '#356049');
        mottleGrad.addColorStop(0.5, '#2C4E3E');
        mottleGrad.addColorStop(1, '#234133');
        ctx.fillStyle = mottleGrad;
        ctx.fillRect(padX, padY, matW, matH);

        // Mat Grid Lines
        const gridStep = matW / (W < 760 ? 18 : 36);
        ctx.strokeStyle = 'rgba(233, 240, 216, 0.14)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = padX + gridStep; x < padX + matW; x += gridStep) {
          const isMajor = Math.round((x - padX) / gridStep) % 5 === 0;
          ctx.strokeStyle = isMajor ? 'rgba(238, 244, 222, 0.32)' : 'rgba(233, 240, 216, 0.14)';
          ctx.lineWidth = isMajor ? 1.5 : 0.8;
          ctx.beginPath();
          ctx.moveTo(x, padY);
          ctx.lineTo(x, padY + matH);
          ctx.stroke();
        }
        for (let y = padY + gridStep; y < padY + matH; y += gridStep) {
          const isMajor = Math.round((y - padY) / gridStep) % 5 === 0;
          ctx.strokeStyle = isMajor ? 'rgba(238, 244, 222, 0.32)' : 'rgba(233, 240, 216, 0.14)';
          ctx.lineWidth = isMajor ? 1.5 : 0.8;
          ctx.beginPath();
          ctx.moveTo(padX, y);
          ctx.lineTo(padX + matW, y);
          ctx.stroke();
        }
      }

      // Perimeter Ruler markings & numbers
      const rulerStep = matW / (W < 760 ? 32 : 64);
      ctx.strokeStyle = 'rgba(238, 244, 222, 0.35)';
      ctx.fillStyle = 'rgba(244, 249, 236, 0.85)';
      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.lineWidth = 1;

      for (let i = 0; i <= (W < 760 ? 32 : 64); i++) {
        const x = padX + i * rulerStep;
        const isMajor = i % 5 === 0;
        const tickH = isMajor ? 8 : 4;
        ctx.beginPath();
        ctx.moveTo(x, padY);
        ctx.lineTo(x, padY + tickH);
        ctx.moveTo(x, padY + matH);
        ctx.lineTo(x, padY + matH - tickH);
        ctx.stroke();
      }

      // Authentic Vintage Mat Branding
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(244, 249, 236, 0.75)';
      ctx.textAlign = 'right';
      ctx.fillText('A1 · 5mm', padX + matW - 16, padY + matH - 12);

      if (W >= 760) {
        ctx.save();
        ctx.translate(padX + 16, padY + matH * 0.45);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.font = '500 8.5px "JetBrains Mono", monospace';
        ctx.fillText('SELF-HEALING CUTTING MAT', 0, 0);
        ctx.restore();
      }

      // Coffee Cup Ring Stain
      const coffeeX = padX + matW * 0.69;
      const coffeeY = padY + matH * 0.65;
      const coffeeR = matW * 0.052;
      const coffeeGrad = ctx.createRadialGradient(coffeeX, coffeeY, coffeeR * 0.72, coffeeX, coffeeY, coffeeR);
      coffeeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      coffeeGrad.addColorStop(0.72, 'rgba(96, 64, 30, 0.28)');
      coffeeGrad.addColorStop(0.95, 'rgba(96, 64, 30, 0.35)');
      coffeeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coffeeGrad;
      ctx.beginPath();
      ctx.arc(coffeeX, coffeeY, coffeeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end mat clip
    };

    matImg.onload = renderMat;
    renderMat();

    window.addEventListener('resize', renderMat);
    return () => {
      isCancelled = true;
      window.removeEventListener('resize', renderMat);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`cut-root ${modalEvent ? 'is-modal-open' : ''}`}
      data-phase={phase}
    >
      {/* Canvas Drawing Layer: Wood Desk + Green Self-Healing Mat */}
      <canvas ref={canvasRef} className="cut-cv" aria-hidden="true" />

      {/* TOP DESK LINKS: Authentic Paper Tickets with Drop Shadows */}
      <Link
        to="/"
        className="desk-link desk-link--top-left"
        style={{ '--rot': '-1.4deg' }}
        aria-label="Back to Homepage"
      >
        ← HOME
      </Link>
      <Link
        to="/team"
        className="desk-link desk-link--top-right"
        style={{ '--rot': '1.8deg' }}
        aria-label="Explore Society Team"
      >
        TEAM →
      </Link>

      {/* TACTILE PROPS AROUND THE CUTTING MAT (Vintage Camera, Light Meter, Polaroids, Film, Lens) */}
      <div className="cut-props" aria-hidden="true">
        {/* 1. Camera at top-center */}
        <div
          className="cut-prop"
          data-prop="camera"
          style={{
            top: '4.5%',
            left: '30%',
            width: 'clamp(95px, 9.8vw, 155px)',
            transform: 'rotate(-4deg)',
          }}
        >
          <img src="/assets/events/cutout/props/camera.png" alt="" draggable={false} />
        </div>

        {/* 2. Exposure Meter at top-right */}
        <div
          className="cut-prop"
          data-prop="meter"
          style={{
            top: '24%',
            right: '3%',
            width: 'clamp(42px, 4.2vw, 68px)',
            transform: 'rotate(12deg)',
          }}
        >
          <img src="/assets/events/cutout/props/meter.png" alt="" draggable={false} />
        </div>

        {/* 3. Stack of Polaroids at bottom-left */}
        <div
          className="cut-prop"
          data-prop="polaroids"
          style={{
            bottom: '7%',
            left: '4%',
            width: 'clamp(72px, 7.5vw, 115px)',
            transform: 'rotate(-10deg)',
          }}
        >
          <img src="/assets/events/cutout/props/polaroids.png" alt="" draggable={false} />
        </div>

        {/* 4. Film Canister at bottom-left */}
        <div
          className="cut-prop"
          data-prop="film"
          style={{
            bottom: '2%',
            left: '7.5%',
            width: 'clamp(70px, 7.2vw, 110px)',
            transform: 'rotate(6deg)',
          }}
        >
          <img src="/assets/events/cutout/props/film.png" alt="" draggable={false} />
        </div>

        {/* 5. Camera Lens at bottom-right */}
        <div
          className="cut-prop"
          data-prop="lens"
          style={{
            bottom: '2.5%',
            right: '3.5%',
            width: 'clamp(78px, 8vw, 120px)',
            transform: 'rotate(-16deg)',
          }}
        >
          <img src="/assets/events/cutout/props/lens.png" alt="" draggable={false} />
        </div>
      </div>

      {/* PHASE 1: THE CUTTING MAT WITH THE MAIN HEADING & 5 CATEGORY STRIPS */}
      {phase === 'mat' && (
        <>
          {/* Main Heading "OUR PHOTOS feel?" with tactile paper badges */}
          <div className="cut-mat-content">
            <div
              className="cut-heading-wrap"
              style={{
                top: '17%',
                left: '7%',
              }}
            >
              <div className="cut-heading-label">HOW SHOULD</div>
              <div className="cut-heading-row">
                <span className="cut-heading-badge">OUR PHOTOS</span>
              </div>
              <div className="cut-subheading-row">
                <span className="cut-subheading-badge">feel?</span>
              </div>
              <div className="cut-pick-note">
                PICK ONE — THE CUT DOES THE REST
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="inline-block ml-2 align-middle"
                >
                  <path
                    d="M2 3 C10 4, 18 8, 24 16 M24 16 L18 16 M24 16 L22 10"
                    stroke="#FFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Exactly 5 Event Category Strips on the Cutting Mat */}
          {CATEGORIES.map((cat, idx) => {
            const isHovered = hoveredWordIdx === idx;
            return (
              <div
                key={cat.id}
                className="cut-strip"
                style={{
                  top: cat.desktopPos.top,
                  left: cat.desktopPos.left,
                  transform: `rotate(${cat.rot}deg) ${isHovered ? 'translateY(-3px)' : ''}`,
                }}
                onMouseEnter={() => setHoveredWordIdx(idx)}
                onMouseLeave={() => setHoveredWordIdx(null)}
                onClick={() => handleSelectCategory(idx)}
              >
                <div
                  className="cut-strip-badge relative"
                  style={{
                    backgroundColor: cat.paper,
                    color: cat.ink,
                  }}
                >
                  {cat.word}

                  {/* Pinned Selection Box on Hover matching reference */}
                  {isHovered && (
                    <div className="cut-strip-pin-box">
                      <span className="cut-pin-corner cut-pin-tl" />
                      <span className="cut-pin-corner cut-pin-tr" />
                      <span className="cut-pin-corner cut-pin-bl" />
                      <span className="cut-pin-corner cut-pin-br" />
                    </div>
                  )}
                </div>
                <div className="cut-strip-note">{cat.note}</div>
              </div>
            );
          })}
        </>
      )}

      {/* PHASE 2: THE CUT & STENCIL ANIMATION */}
      {phase === 'cutting' && (
        <div className="cut-stage-cutting">
          {/* Skip button in top right */}
          <button type="button" className="cut-skip" onClick={handleSkipCut}>
            skip →
          </button>

          {/* Giant Stencil Letters with Masked Event Photographs */}
          <div className="cut-stencil-word">
            {Array.from(currentCategory.word).map((char, cIdx) => {
              const bgImg = currentEvents[cIdx % currentEvents.length]?.coverImg || currentEvents[0]?.coverImg;
              const rotStart = ((cIdx % 3) - 1) * 8;
              return (
                <span
                  key={cIdx}
                  className="cut-stencil-char"
                  style={{
                    '--rot-start': `${rotStart}deg`,
                    animationDelay: `${cIdx * 0.06}s`,
                    backgroundImage: `url(${bgImg})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 3: THE CONTACT SHEET VIEW */}
      {phase === 'sheet' && (
        <div className="cut-sheet-container">
          <div className="cut-sheet-card">
            {/* Sheet Top Header */}
            <div className="cut-sheet-header">
              <div>
                <h2
                  className="cut-sheet-title"
                  style={{
                    color: currentCategory.paper === '#191715' ? '#DE3B22' : currentCategory.paper,
                  }}
                >
                  {currentCategory.word}
                </h2>
                <div className="cut-sheet-sub">
                  AIVOLUTION ARCHIVE // CSE-AI MAIT · {currentCategory.note}
                </div>
              </div>
              <div className="cut-sheet-counter">
                {String(activeEventIdx + 1).padStart(2, '0')} / {String(currentEvents.length).padStart(2, '0')}{' '}
                {currentCategory.word}
              </div>
            </div>

            {/* Sheet Main Split View */}
            {activeEvent && (
              <div className="cut-sheet-body">
                {/* Left: Large Hero Photograph */}
                <div
                  className="cut-hero-frame cursor-pointer"
                  onClick={() => handleOpenModal(activeEvent, 0)}
                  title="Click to view full event report & photo gallery"
                >
                  <img
                    src={activeEvent.coverImg}
                    alt={activeEvent.title}
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {/* Right: Event Information & Action */}
                <div className="cut-details-col">
                  <span
                    className="cut-event-badge"
                    style={{
                      backgroundColor: currentCategory.paper,
                      color: currentCategory.ink,
                    }}
                  >
                    {activeEvent.category}
                  </span>

                  <h3 className="cut-event-title">{activeEvent.title}</h3>
                  <p className="cut-event-desc">{activeEvent.summary}</p>

                  {/* Facts Pills */}
                  {activeEvent.facts && activeEvent.facts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {activeEvent.facts.map((fact, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/5 border border-black/10 rounded-[2px]"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="cut-event-meta">
                    {activeEvent.date} · {activeEvent.gallery.length} ARCHIVED PHOTOGRAPHS
                  </div>

                  {/* Action Button: Opens Full Event Report Modal */}
                  <button
                    type="button"
                    className="cut-cta-button"
                    onClick={() => handleOpenModal(activeEvent, 0)}
                  >
                    VIEW FULL EVENT DOSSIER & PHOTOS ({activeEvent.gallery.length}) →
                  </button>
                </div>
              </div>
            )}

            {/* Event Deck / Contact Negatives Strip */}
            <div className="cut-deck-section">
              <div className="cut-deck-header">
                <span className="cut-deck-label">
                  ARCHIVED {currentCategory.word} ({currentEvents.length})
                </span>
                <span className="cut-deck-hint">
                  Click to spotlight · Open for full dossier & photos
                </span>
              </div>

              <div className="cut-deck-grid">
                {currentEvents.map((evt, eIdx) => {
                  const isActive = eIdx === activeEventIdx;
                  return (
                    <div
                      key={evt.id}
                      className={`cut-deck-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveEventIdx(eIdx)}
                    >
                      <div className="cut-deck-card-photo">
                        <img src={evt.coverImg} alt={evt.title} loading="lazy" />
                        <span className="cut-deck-badge-count">
                          📷 {evt.gallery.length} PHOTOS
                        </span>
                      </div>

                      <div className="cut-deck-card-title">{evt.title}</div>
                      <div className="cut-deck-card-date">{evt.date}</div>

                      {isActive && (
                        <svg className="cut-grease-ring" viewBox="0 0 100 70" fill="none">
                          <ellipse
                            cx="50"
                            cy="35"
                            rx="47"
                            ry="31"
                            stroke="#FFD700"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            transform="rotate(-2 50 35)"
                            opacity="0.9"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Back to Mat + Category Switcher Tabs */}
          <div className="cut-sheet-bar">
            <button type="button" className="cut-back-button" onClick={handleBackToMat}>
              ← BACK TO THE MAT
            </button>

            {/* Category Quick-Switcher Tabs */}
            <div className="cut-category-switcher">
              {CATEGORIES.map((cat, idx) => {
                const isCurrent = idx === activeCatIdx;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cut-chip-tab ${isCurrent ? 'is-active' : ''}`}
                    style={{
                      backgroundColor: cat.paper,
                      color: cat.ink,
                    }}
                    onClick={() => handleSelectCategory(idx)}
                  >
                    {cat.word}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FULL EVENT ARCHIVAL DOSSIER & PHOTO GALLERY MODAL */}
      {modalEvent && (
        <div
          className="cut-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalEvent(null)}
        >
          <div
            className="cut-modal-dossier"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="cut-modal-top-bar">
              <div>
                <div className="cut-modal-serial">
                  AIVOLUTION ARCHIVE // DOSSIER #{modalEvent.id} · {modalEvent.category}
                </div>
                <h3 className="cut-modal-title">
                  {modalEvent.title}
                </h3>
                <div className="font-mono text-xs text-[#241F19]/70 mt-1 uppercase tracking-wider">
                  {modalEvent.date} · Department of CSE-AI, MAIT
                </div>
              </div>

              <button
                type="button"
                className="cut-modal-close-btn"
                onClick={() => setModalEvent(null)}
                aria-label="Close Dossier"
              >
                ✕ CLOSE DOSSIER
              </button>
            </div>

            {/* Facts Pills */}
            {modalEvent.facts && modalEvent.facts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {modalEvent.facts.map((fact, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-black/5 border border-black/15 rounded-[2px]"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            )}

            {/* STYLISH EVENT PHOTO GALLERY */}
            <div className="cut-modal-gallery">
              <div className="cut-modal-photo-info">
                <span>
                  EVENT PHOTOGRAPHS // FRAME #{String(modalPhotoIdx + 1).padStart(2, '0')} OF {String(modalEvent.gallery.length).padStart(2, '0')}
                </span>
                <span className="text-[#DE3B22] font-mono text-[10px]">
                  USE ← → ARROWS OR CLICK THUMBNAILS
                </span>
              </div>

              {/* Large Photo Stage */}
              <div className="cut-modal-photo-stage">
                <img
                  src={modalEvent.gallery[modalPhotoIdx] || modalEvent.coverImg}
                  alt={`${modalEvent.title} - ${modalPhotoIdx + 1}`}
                  loading="eager"
                />

                {modalEvent.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="cut-modal-nav-btn is-prev"
                      onClick={() => setModalPhotoIdx((prev) => (prev - 1 + modalEvent.gallery.length) % modalEvent.gallery.length)}
                      aria-label="Previous photograph"
                    >
                      ← PREV
                    </button>
                    <button
                      type="button"
                      className="cut-modal-nav-btn is-next"
                      onClick={() => setModalPhotoIdx((prev) => (prev + 1) % modalEvent.gallery.length)}
                      aria-label="Next photograph"
                    >
                      NEXT →
                    </button>
                  </>
                )}
              </div>

              {/* Modal Thumbnails Strip */}
              {modalEvent.gallery.length > 1 && (
                <div className="cut-modal-strip">
                  {modalEvent.gallery.map((imgSrc, pIdx) => {
                    const isPhotoActive = pIdx === modalPhotoIdx;
                    return (
                      <div
                        key={pIdx}
                        className={`cut-modal-thumb ${isPhotoActive ? 'is-active' : ''}`}
                        onClick={() => setModalPhotoIdx(pIdx)}
                      >
                        <img src={imgSrc} alt="" loading="lazy" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* EVENT DOSSIER STORY & SECTIONS */}
            <div className="cut-modal-story">
              <div className="cut-modal-section-card bg-[#FFFFFF]/70">
                <div className="cut-modal-sec-head">Overview & Synopsis</div>
                <p className="cut-modal-sec-body text-sm leading-relaxed">
                  {modalEvent.summary}
                </p>
              </div>

              {modalEvent.sections && modalEvent.sections.map((sec, sIdx) => (
                <div key={sIdx} className="cut-modal-section-card">
                  <div className="cut-modal-sec-head">
                    {String(sIdx + 1).padStart(2, '0')}. {sec.heading}
                  </div>
                  <p className="cut-modal-sec-body">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Dismiss Button */}
            <div className="mt-8 pt-4 border-t border-black/15 flex justify-end">
              <button
                type="button"
                className="cut-modal-close-btn"
                onClick={() => setModalEvent(null)}
              >
                RETURN TO {modalEvent.category.toUpperCase()} ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pixel Arrow Custom Cursor */}
      <div ref={cursorRef} className="cut-cursor" aria-hidden="true">
        <svg viewBox="0 0 64 84" width="100%" height="100%" fill="none">
          <defs>
            <linearGradient id="cut-cur-grad" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#D8D4CC" />
            </linearGradient>
          </defs>
          <path
            d="M8 4 L8 66 L22 53 L32 78 L46 72 L36 48 L56 47 Z"
            fill="url(#cut-cur-grad)"
            stroke="#141414"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
