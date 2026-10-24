import React, { useEffect, useRef, useState } from 'react';
import '../styles/codex.css';

const codex1Photos = [
  {
    id: 1,
    src: '/assets/events/codex-2025/ceremony.jpg',
    title: 'Opening Ceremony & Keynote Address',
    tag: 'INCEPTION',
    tagColor: '#ffe55c',
    tapeColor: 'repeating-linear-gradient(135deg, #ffd3e6 0 8px, #ffe4f0 8px 16px)',
    desc: 'Faculty address and problem statement briefing kicking off the 2-day hackathon.',
    rotation: '-1.5deg',
  },
  {
    id: 2,
    src: '/assets/events/codex-2025/hacking_lab.jpg',
    title: 'The Hacking Arena in Full Motion',
    tag: 'BUILD SPRINT',
    tagColor: '#8aa8ff',
    tapeColor: 'repeating-linear-gradient(135deg, #ffe55c 0 8px, #fff08a 8px 16px)',
    desc: '60+ teams working across labs, writing code, debugging, and building prototypes.',
    rotation: '1.2deg',
  },
  {
    id: 3,
    src: '/assets/events/codex-2025/judging_pitch.jpg',
    title: 'Pitch Round & Live Demonstration',
    tag: 'EVALUATION',
    tagColor: '#ff8f6b',
    tapeColor: 'repeating-linear-gradient(135deg, #c9f5dc 0 8px, #e0faec 8px 16px)',
    desc: 'Finalists pitching their working software live to industry and faculty evaluators.',
    rotation: '-1.2deg',
  },
  {
    id: 4,
    src: '/assets/events/codex-2025/panel_review.jpg',
    title: 'Deep-Dive Review & Mentor Feedback',
    tag: 'MENTORSHIP',
    tagColor: '#c9f5dc',
    tapeColor: 'repeating-linear-gradient(135deg, #ffd3e6 0 8px, #ffe4f0 8px 16px)',
    desc: 'Mentors providing rigorous code review, architectural advice, and refinement.',
    rotation: '1.6deg',
  },
  {
    id: 5,
    src: '/assets/events/codex-2025/winners_1.webp',
    title: '1st Prize Champions — Team RADICALS',
    tag: 'GRAND WINNERS',
    tagColor: '#ffe55c',
    tapeColor: 'repeating-linear-gradient(135deg, #8aa8ff 0 8px, #b2c7ff 8px 16px)',
    desc: 'Awarded the 1st prize trophy and top honours on the main stage.',
    rotation: '-1.4deg',
  },
  {
    id: 6,
    src: '/assets/events/codex-2025/team_group.webp',
    title: 'Organizing Team & Finalists',
    tag: 'THE CREW',
    tagColor: '#ffd3e6',
    tapeColor: 'repeating-linear-gradient(135deg, #ffe55c 0 8px, #fff08a 8px 16px)',
    desc: 'The organizers, mentors, and finalists celebrating at the conclusion of CODEX 1.0.',
    rotation: '1.4deg',
  },
];

export const CodexPage = () => {
  const pageRef = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    const pg = pageRef.current;
    if (!pg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      const r = pg.getBoundingClientRect();
      pg.style.setProperty('--mx', `${e.clientX - r.left}px`);
      pg.style.setProperty('--my', `${e.clientY - r.top}px`);
      pg.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      pg.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };

    pg.addEventListener('mousemove', handleMouseMove);
    return () => {
      pg.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhoto(null);
    };
    if (activePhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activePhoto]);

  return (
    <div ref={pageRef} className="codex-pg">
      <div className="codex-spot" />
      <div className="codex-cd" />

      {/* Hero Section */}
      <section className="codex-hero">
        <div className="codex-w">
          <div>
            <div className="codex-lbl">
              <span className="codex-mono codex-b">~ codex · 2.0</span>
              <span className="codex-tape codex-mono">OFFICIAL AI SOCIETY · DEPT. OF CSE-AIML, MAIT</span>
            </div>
            <h1>
              <span>CODEX 2.0:</span>
              <span className="codex-l2">
                from <i className="codex-st">slides</i> to
              </span>
              <span className="codex-l3">
                <em className="codex-hl" style={{ fontStyle: 'normal' }}>
                  Grand Finale.
                </em>
              </span>
            </h1>
            <p className="codex-d">
              The flagship hackathon of Aivolutions at Maharaja Agrasen Institute of Technology. A 3-day on-campus hackathon
              featuring Day 1 offline screening, Day 2 prototyping &amp; shortlisting, and Day 3 final judging.
            </p>
            <div className="codex-btns">
              {/* TODO: Add official registration form URL when live */}
              <a className="codex-btn codex-y" href="#contact">
                Register now →
              </a>
              <a className="codex-btn codex-wh" href="#sponsor">
                Sponsor CODEX 2.0
              </a>
            </div>
          </div>

          <div className="codex-art">
            {/* Admit One Ticket */}
            <div className="codex-tk" role="img" aria-label="CODEX 2.0 admit one ticket">
              <div className="codex-m">
                <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '3px' }}>
                  ADMIT ONE · TEAM PASS
                </div>
                <h3>CODEX 2.0</h3>
                <div className="codex-sub">Aivolutions × MAIT Delhi</div>
                <div className="codex-dt codex-mono">
                  <div>
                    <b>DATE</b>COMING SOON
                  </div>
                  <div>
                    <b>VENUE</b>MAIT, Rohini, New Delhi
                  </div>
                  <div>
                    <b>FORMAT</b>3 Days Offline
                  </div>
                  <div>
                    <b>STAGES</b>Screening · Prototype · Finale
                  </div>
                </div>
              </div>
              <div className="codex-sb">
                <div className="codex-vt codex-mono">NO. CODEX-2027</div>
                <div className="codex-bc" />
              </div>
            </div>

            {/* Floating Sticker */}
            <div className="codex-stk codex-s3" style={{ top: 'auto', bottom: '10px' }}>
              hands-on, not slides
            </div>
          </div>
        </div>
      </section>

      {/* Pinboard: How It Works */}
      <section className="codex-pin">
        <div className="codex-w">
          <h2>how it works.</h2>
          <p className="codex-lead">Three stages. Each one narrows the field.</p>
          <div className="codex-grid codex-g3">
            <div className="codex-note" style={{ '--r': '-1.5deg' }}>
              <div className="codex-clip" />
              <div className="codex-big">01</div>
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                DAY 1 · OFFLINE SCREENING
              </div>
              <h3>1st Offline Screening</h3>
              <p>In-person screening on campus. Teams present their proposals and problem statements to earn their spot.</p>
              <span className="codex-stamp codex-mono">ON CAMPUS</span>
            </div>

            <div className="codex-note">
              <div className="codex-clip" />
              <div className="codex-big">02</div>
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                DAY 2 · BUILD &amp; SHORTLIST
              </div>
              <h3>2nd Day Prototyping</h3>
              <p>Intensive prototyping sprint with mentor check-ins and progress evaluations to shortlist the top finalists.</p>
              <span className="codex-stamp codex-mono">SHORTLISTING</span>
            </div>

            <div className="codex-note">
              <div className="codex-clip" />
              <div className="codex-big">03</div>
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                DAY 3 · GRAND FINALE
              </div>
              <h3>3rd Day Final Judging</h3>
              <p>Live prototype demonstrations and pitching before an expert jury panel to decide the winners of CODEX 2.0.</p>
              <span className="codex-stamp codex-mono">GRAND FINALE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="codex-sec">
        <div className="codex-w">
          <h2>
            the{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              timeline.
            </span>
          </h2>
          <p className="codex-lead">git log for the flagship hackathon.</p>
          <div className="codex-tl">
            <div className="codex-ev">
              <div className="codex-nd" style={{ background: '#ff5a1f' }} />
              <div className="codex-mono" style={{ fontSize: '13px', color: '#6b675c' }}>
                UPCOMING · COMING SOON
              </div>
              <h3>CODEX 2.0</h3>
              <p style={{ margin: 0, color: '#55524a', lineHeight: 1.55 }}>
                3 days offline at MAIT: 1st day offline screening, 2nd day prototyping &amp; shortlisting, and 3rd day final judging. Official dates dropping soon.
              </p>
              <span className="codex-tg codex-mono" style={{ background: '#ffe55c' }}>
                HACKATHON
              </span>
              <span className="codex-tg codex-mono">300+ EXPECTED</span>
              <span className="codex-tg codex-mono">3 DAYS OFFLINE</span>
            </div>

            <div className="codex-ev">
              <div className="codex-nd" style={{ background: '#3ddc84' }} />
              <div className="codex-mono" style={{ fontSize: '13px', color: '#6b675c' }}>
                17 TO 19 SEP 2025
              </div>
              <h3>CODEX 1.0</h3>
              <p style={{ margin: 0, color: '#55524a', lineHeight: 1.55 }}>
                240+ participants across 60 teams with a 20K prize pool, narrowed to 12 finalists over three rounds. Sponsorship partner: Neighborly.
              </p>
              <span className="codex-tg codex-mono" style={{ background: '#ffd3e6' }}>
                HACKATHON
              </span>
              <span className="codex-tg codex-mono">20K PRIZE POOL</span>
              <span className="codex-tg codex-mono">3 ROUNDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* CODEX 1.0 Photographs / Past Event Section */}
      <section className="codex-sec" id="codex-1-memories">
        <div className="codex-w">
          <div className="codex-lbl" style={{ marginBottom: '16px' }}>
            <span className="codex-mono codex-b">~ archive · 18–19 sep 2025</span>
            <span className="codex-tape codex-mono" style={{ padding: '8px 16px', fontSize: '13px' }}>
              CODEX 1.0 MEMORIES
            </span>
          </div>
          <h2>
            codex 1.0{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              photographs.
            </span>
          </h2>
          <p className="codex-lead">
            Highlights from the inaugural CODEX Hackathon — 60+ teams, intense building rounds, mentor check-ins, and the final prize ceremony at MAIT.
          </p>

          <div className="codex-gallery-grid">
            {codex1Photos.map((photo) => (
              <div
                key={photo.id}
                className="codex-photo-card"
                style={{ transform: `rotate(${photo.rotation})` }}
                onClick={() => setActivePhoto(photo)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePhoto(photo);
                  }
                }}
              >
                <div
                  className="codex-photo-tape"
                  style={{ background: photo.tapeColor }}
                />
                <div className="codex-photo-img-wrap">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="codex-photo-img"
                    loading="lazy"
                  />
                  <span className="codex-photo-zoom-hint">🔍 CLICK TO EXPAND</span>
                </div>
                <div className="codex-photo-meta">
                  <span
                    className="codex-photo-tag codex-mono"
                    style={{ background: photo.tagColor }}
                  >
                    {photo.tag}
                  </span>
                  <h3 className="codex-photo-title">{photo.title}</h3>
                  <p className="codex-photo-desc">{photo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <div className="codex-mq">
        <div>
          <span>past partners</span>
          <span>Neighborly</span>
          <span>Unstop</span>
          <span>Devpost</span>
          <span>Devfolio</span>
          <span>OSEN</span>
          <span>past partners</span>
          <span>Neighborly</span>
          <span>Unstop</span>
          <span>Devpost</span>
          <span>Devfolio</span>
          <span>OSEN</span>
        </div>
      </div>

      {/* Coming Soon Section */}
      <section className="codex-sec codex-coming-soon-sec" id="coming-soon">
        <div className="codex-w">
          <div className="codex-lbl" style={{ marginBottom: '16px' }}>
            <span className="codex-mono codex-b">~ sneak peek</span>
            <span className="codex-tape codex-mono" style={{ padding: '8px 16px', fontSize: '13px' }}>
              CODEX 2.0 · IN DEVELOPMENT
            </span>
          </div>
          <h2>
            coming{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              soon.
            </span>
          </h2>
          <p className="codex-lead">
            We are cooking up something massive for CODEX 2.0. 3 days of building, elite industry mentors, and exciting perks.
          </p>

          <div className="codex-coming-soon-grid">
            <div className="codex-teaser-card">
              <div
                className="codex-teaser-tape"
                style={{ background: 'repeating-linear-gradient(135deg, #ffe55c 0 8px, #fff08a 8px 16px)' }}
              />
              <span
                className="codex-teaser-badge codex-mono"
                style={{ background: '#ffe55c' }}
              >
                TRACKS &amp; THEMES
              </span>
              <h3>Problem Statements</h3>
              <p>
                Real-world challenge briefs in Generative AI, Autonomous Agents, Scalable Systems, and Applied Machine Learning.
              </p>
              <span className="codex-stamp codex-mono">DROPPING SHORTLY</span>
            </div>

            <div className="codex-teaser-card">
              <div
                className="codex-teaser-tape"
                style={{ background: 'repeating-linear-gradient(135deg, #ffd3e6 0 8px, #ffe4f0 8px 16px)' }}
              />
              <span
                className="codex-teaser-badge codex-mono"
                style={{ background: '#ffd3e6' }}
              >
                REGISTRATION PORTAL
              </span>
              <h3>Team Sign-Ups</h3>
              <p>
                Centralized portal for team registrations, proposal submissions, and official onboarding to the hacker Discord.
              </p>
              <span className="codex-stamp codex-mono">OPENS SOON</span>
            </div>

            <div className="codex-teaser-card">
              <div
                className="codex-teaser-tape"
                style={{ background: 'repeating-linear-gradient(135deg, #c9f5dc 0 8px, #e0faec 8px 16px)' }}
              />
              <span
                className="codex-teaser-badge codex-mono"
                style={{ background: '#c9f5dc' }}
              >
                AWARDS &amp; SWAG
              </span>
              <h3>Goodies &amp; Recognition</h3>
              <p>
                Exciting sponsor bounties, cloud credits, developer swag, stickers, certificates, and exclusive limited-edition hackathon tees.
              </p>
              <span className="codex-stamp codex-mono">AWARDS &amp; MERCH</span>
            </div>
          </div>

          <div className="codex-ticker-box">
            <div className="codex-ticker-text">
              <div className="codex-pulse-dot" />
              STATUS: PREPARING STAGE 1 · DATES TO BE ANNOUNCED
            </div>
            <a
              className="codex-btn codex-y"
              style={{ padding: '8px 18px', fontSize: '13px' }}
              href="https://whatsapp.com/channel/0029Vb9S7lj8F2pN7ghfV00Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Notified on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Fun Sponsor Card Section */}
      <section className="codex-sec" id="sponsor">
        <div className="codex-w">
          <div className="codex-lbl" style={{ marginBottom: '16px' }}>
            <span className="codex-mono codex-b">~ partner with us</span>
            <span className="codex-tape codex-mono" style={{ padding: '8px 16px', fontSize: '13px' }}>
              OFFICIAL SPONSORSHIP · CODEX 2.0
            </span>
          </div>
          <h2>
            sponsor{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              CODEX.
            </span>
          </h2>
          <p className="codex-lead">
            Back the next wave of engineers, creators, and AI innovators. Let's make an impact together.
          </p>

          <a
            href="mailto:aivolutionweb@gmail.com?subject=Sponsorship%20Inquiry%20-%20CODEX%202.0&body=Hi%20AIvolution%20Team%2C%0A%0AWe%20would%20love%20to%20sponsor%20CODEX%202.0!%20Please%20share%20the%20sponsorship%20deck%20and%20collaboration%20details.%0A%0ACompany%2FOrganization%3A%20%0AContact%20Person%3A%20%0AEmail%20%2F%20Phone%3A%20"
            className="codex-sponsor-fun-card"
            title="Click to email aivolutionweb@gmail.com and sponsor CODEX 2.0"
          >
            <div className="codex-sponsor-fun-tape" />
            <div className="codex-sponsor-badge-top codex-mono">
              ⚡ CALLING ALL TECH PARTNERS & SPONSORS ⚡
            </div>

            <div className="codex-hand codex-sponsor-hand">
              got cool tech, API bounties, or looking to scout top AI talent?
            </div>

            <h3 className="codex-sponsor-main-title">
              Click to sponsor us →
            </h3>

            <p className="codex-sponsor-sub">
              Have an idea, tools, or resources you want in front of 300+ ambitious developers at MAIT Delhi? Tap here to shoot us an email directly at <b>aivolutionweb@gmail.com</b>!
            </p>

            <div className="codex-sponsor-pills">
              <span className="codex-sponsor-pill codex-mono">🚀 KEYNOTE / WORKSHOP SLOTS</span>
              <span className="codex-sponsor-pill codex-mono">🏆 NAMED TRACK AWARDS</span>
              <span className="codex-sponsor-pill codex-mono">💼 RESUME ACCESS & DIRECT HIRING</span>
              <span className="codex-sponsor-pill codex-mono">👕 LOGO ON T-SHIRTS & BANNERS</span>
            </div>

            <div className="codex-sponsor-btn-wrap">
              <span className="codex-btn codex-y codex-sponsor-btn">
                ✉️ Click to sponsor us (aivolutionweb@gmail.com) →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="codex-cta" id="contact">
        <div className="codex-w">
          <div className="codex-hand" style={{ fontSize: '30px', color: '#6b675c' }}>
            psst... want in?
          </div>
          <h2>
            want in?{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              join CODEX.
            </span>
          </h2>
          <div className="codex-tm codex-mono">
            <span className="codex-g">$</span> codex register --team
            <br />
            <span className="codex-y2">&gt;</span> day 1: 1st offline screening on campus
            <br />
            <span className="codex-y2">&gt;</span> day 2: prototyping &amp; shortlisting
            <br />
            <span className="codex-y2">&gt;</span> day 3: final judging &amp; grand finale
            <span className="codex-cur" style={{ height: '18px', width: '9px', marginLeft: '6px' }} />
          </div>
          <div className="codex-ct">
            {/* TODO: Registration Link when registration portal opens */}
            <a
              className="codex-btn codex-y"
              href="https://whatsapp.com/channel/0029Vb9S7lj8F2pN7ghfV00Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register now →
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="codex-modal-overlay"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="codex-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="codex-modal-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              className="codex-modal-img"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="codex-photo-tag codex-mono"
                  style={{ background: activePhoto.tagColor, margin: 0 }}
                >
                  {activePhoto.tag}
                </span>
                <span className="codex-mono" style={{ fontSize: '12px', color: '#6b675c' }}>
                  CODEX 1.0 ARCHIVE · 18–19 SEP 2025
                </span>
              </div>
              <h3 style={{ fontSize: '24px', margin: '4px 0 0' }}>{activePhoto.title}</h3>
              <p style={{ margin: 0, color: '#55524a', fontSize: '15px' }}>{activePhoto.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
