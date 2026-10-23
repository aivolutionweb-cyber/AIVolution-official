import React, { useEffect, useRef } from 'react';
import '../styles/codex.css';

export const CodexPage = () => {
  const pageRef = useRef(null);

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
              The flagship hackathon of Aivolutions at Maharaja Agrasen Institute of Technology. Pitch online, then build for
              two days on campus with mentors. Late January to early February 2027, dates to be confirmed.
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
                    <b>DATE</b>Late Jan to early Feb 2027 (TBC)
                  </div>
                  <div>
                    <b>VENUE</b>MAIT, Rohini, New Delhi
                  </div>
                  <div>
                    <b>FORMAT</b>Online round + 2 days offline
                  </div>
                  <div>
                    <b>PRIZES</b>₹30,000 cash
                  </div>
                </div>
              </div>
              <div className="codex-sb">
                <div className="codex-vt codex-mono">NO. CODEX-2027</div>
                <div className="codex-bc" />
              </div>
            </div>

            {/* Rotating ₹30K Badge */}
            <svg className="codex-bd" viewBox="0 0 200 200" role="img" aria-label="CODEX 2.0 Aivolutions MAIT Delhi, 30K prizes">
              <defs>
                <path id="codex-cp" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
              </defs>
              <circle cx="100" cy="100" r="97" fill="#ff5a1f" stroke="#111" strokeWidth="4" />
              <g className="codex-rot">
                <text fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" fill="#fff">
                  <textPath href="#codex-cp" textLength="470" lengthAdjust="spacing">
                    CODEX 2.0 · AIVOLUTIONS · MAIT DELHI ·{' '}
                  </textPath>
                </text>
              </g>
              <text x="100" y="112" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="40" fill="#111">
                ₹30K
              </text>
              <text x="100" y="134" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="20" fill="#111">
                in prizes
              </text>
            </svg>

            {/* Floating Sticker */}
            <div className="codex-stk codex-s3" style={{ top: 'auto', bottom: '10px' }}>
              hands-on, not slides
            </div>
          </div>
        </div>
      </section>

      {/* The Numbers Section */}
      <section className="codex-sec">
        <div className="codex-w">
          <h2>
            the{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              numbers.
            </span>
          </h2>
          <p className="codex-lead">
            CODEX 1.0 narrowed 60 teams down to 3 winners. CODEX 2.0 raises the cash prizes from ₹19,000 to ₹30,000.
          </p>
          <div className="codex-grid codex-g2">
            <div className="codex-card">
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>
                CODEX 1.0 · HOW THE FIELD NARROWED
              </div>
              <div className="codex-fr">
                <div className="codex-mono codex-fl">ROUND 1 · TEAMS</div>
                <div className="codex-fb" style={{ width: '100%', background: '#ffe55c' }}>
                  60
                </div>
              </div>
              <div className="codex-fr">
                <div className="codex-mono codex-fl">ROUND 2 · TEAMS</div>
                <div className="codex-fb" style={{ width: '80%', background: '#ffd3e6' }}>
                  43
                </div>
              </div>
              <div className="codex-fr">
                <div className="codex-mono codex-fl">ROUND 3 · FINALISTS</div>
                <div className="codex-fb" style={{ width: '58%', background: '#8aa8ff' }}>
                  12
                </div>
              </div>
              <div className="codex-fr" style={{ marginBottom: 0 }}>
                <div className="codex-mono codex-fl">TOP 3 · PRIZE WINNERS</div>
                <div className="codex-fb" style={{ width: '36%', background: '#ff8f6b' }}>
                  3
                </div>
              </div>
            </div>

            <div className="codex-card">
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                CODEX 2.0 · CASH PRIZES
              </div>
              <div className="codex-pdm">
                <div className="codex-pcol">
                  <div className="codex-pa">₹10,000</div>
                  <div className="codex-pbar" style={{ height: '150px', background: '#c9f5dc' }}>
                    2
                  </div>
                </div>
                <div className="codex-pcol">
                  <div className="codex-pa">₹15,000</div>
                  <div className="codex-pbar" style={{ height: '220px', background: '#ffe55c' }}>
                    1
                  </div>
                </div>
                <div className="codex-pcol">
                  <div className="codex-pa">₹5,000</div>
                  <div className="codex-pbar" style={{ height: '110px', background: '#ffd3e6' }}>
                    3
                  </div>
                </div>
              </div>
              <div className="codex-hand" style={{ fontSize: '26px', textAlign: 'center', marginTop: '16px' }}>
                ₹30,000 in total, plus goodies and swag
              </div>
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
                ROUND 1 · ONLINE
              </div>
              <h3>Submit your idea</h3>
              <p>Send a PPT or proposal for a real problem in AI, software or data. The best teams are shortlisted.</p>
              <span className="codex-stamp codex-mono">OPEN SOON</span>
            </div>

            <div className="codex-note">
              <div className="codex-clip" />
              <div className="codex-big">02</div>
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                ROUND 2 · 2 DAYS AT MAIT
              </div>
              <h3>Build with mentors</h3>
              <p>Hands-on building with mentor check-ins and judging rounds on campus.</p>
              <span className="codex-stamp codex-mono">ON CAMPUS</span>
            </div>

            <div className="codex-note">
              <div className="codex-clip" />
              <div className="codex-big">03</div>
              <div className="codex-mono" style={{ fontSize: '12px', letterSpacing: '2px' }}>
                GRAND FINALE
              </div>
              <h3>Pitch and win</h3>
              <p>Final demos, judging and the prize ceremony for the top three teams.</p>
              <span className="codex-stamp codex-mono">₹30,000</span>
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
                UPCOMING · LATE JAN TO EARLY FEB 2027
              </div>
              <h3>CODEX 2.0</h3>
              <p style={{ margin: 0, color: '#55524a', lineHeight: 1.55 }}>
                Online round, then 2 days offline at MAIT ending in the Grand Finale. Final dates to be confirmed.
              </p>
              <span className="codex-tg codex-mono" style={{ background: '#ffe55c' }}>
                HACKATHON
              </span>
              <span className="codex-tg codex-mono">300+ EXPECTED</span>
              <span className="codex-tg codex-mono">₹30,000 PRIZES</span>
            </div>

            <div className="codex-ev">
              <div className="codex-nd" style={{ background: '#3ddc84' }} />
              <div className="codex-mono" style={{ fontSize: '13px', color: '#6b675c' }}>
                17 TO 19 SEP 2025
              </div>
              <h3>CODEX 1.0</h3>
              <p style={{ margin: 0, color: '#55524a', lineHeight: 1.55 }}>
                240+ participants across 60 teams, narrowed to 12 finalists over three rounds. Sponsorship partner: Neighborly.
              </p>
              <span className="codex-tg codex-mono" style={{ background: '#ffd3e6' }}>
                HACKATHON
              </span>
              <span className="codex-tg codex-mono">₹19,000 POOL</span>
              <span className="codex-tg codex-mono">3 ROUNDS</span>
            </div>
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

      {/* Sponsor Packages Section */}
      <section className="codex-sec" id="sponsor">
        <div className="codex-w">
          <h2>
            sponsor{' '}
            <span className="codex-hl" style={{ animation: 'none', backgroundSize: '100% 100%' }}>
              CODEX.
            </span>
          </h2>
          <p className="codex-lead">
            Meet, mentor and hire emerging AI and software talent. Add a named track award of ₹3,000 to ₹5,000 to any package.
          </p>
          <div className="codex-grid codex-g4">
            <div className="codex-card codex-c1">
              <div className="codex-mono">TITLE · 1 SLOT</div>
              <div className="codex-amt">₹40,000</div>
              <ul>
                <li>“Powered by” on all material</li>
                <li>2 judging seats</li>
                <li>Booth plus workshop slot</li>
                <li>Hiring pitch and resumes</li>
              </ul>
            </div>

            <div className="codex-card">
              <div className="codex-mono">GOLD · 2 SLOTS</div>
              <div className="codex-amt">₹20,000</div>
              <ul>
                <li>Large logo on banner</li>
                <li>1 judging seat</li>
                <li>Stall or short demo</li>
                <li>Hiring announcement</li>
              </ul>
            </div>

            <div className="codex-card">
              <div className="codex-mono">SILVER · 3 SLOTS</div>
              <div className="codex-amt">₹10,000</div>
              <ul>
                <li>Medium logo on banner</li>
                <li>1 social post</li>
                <li>Flyers at venue</li>
              </ul>
            </div>

            <div className="codex-card">
              <div className="codex-mono">SUPPORTER · 5 SLOTS</div>
              <div className="codex-amt">₹5,000</div>
              <ul>
                <li>Small logo on banner</li>
                <li>Group thank-you post</li>
                <li>Flyer in kits</li>
              </ul>
            </div>
          </div>
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
            <span className="codex-y2">&gt;</span> step 1: submit a PPT or proposal online
            <br />
            <span className="codex-y2">&gt;</span> step 2: get shortlisted
            <br />
            <span className="codex-y2">&gt;</span> step 3: build for 2 days at MAIT
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
    </div>
  );
};
