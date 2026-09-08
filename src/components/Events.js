import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TrackVisibility from "react-on-screen";
import "animate.css";
import { fetchEvents } from "../services/eventsService";
import { EventRegistrationModal } from "./EventRegistrationModal";

export const EVENTS = [
  {
    type: "workshop",
    title: "AI/ML, RAG & LLMs Workshop",
    date: "27 Sep 2026",
    registrationOpen: true,
    registrationKind: "solo",
    summary:
      "A hands-on dive into ML foundations, Retrieval-Augmented Generation, and building with LLMs.",
    facts: ["Hands-On Workshop", "RAG · LLMs · ML", "Open to All Branches"],
    sections: [
      {
        heading: "Overview",
        body: "AIvolutions is hosting a hands-on workshop this September diving into the technologies powering today's AI systems — core Machine Learning foundations, Retrieval-Augmented Generation (RAG) pipelines, and building real applications with Large Language Models (LLMs).",
      },
      {
        heading: "What You'll Learn",
        body: "Participants will get a practical walkthrough of ML fundamentals, how RAG grounds LLM outputs in real data, and hands-on exercises building a mini LLM-powered application — no prior AI experience required, just curiosity and a laptop.",
      },
      {
        heading: "Who Should Attend",
        body: "Open to students across CSE-AI, CSE-DS, CSE-AIML, and any branch curious about applied AI. Seats are limited, so register early to secure a spot.",
      },
    ],
    imgUrl: "/assets/events/upcoming-ai-workshop.svg",
    id: "WRK_AIML_2026",
  },
  {
    type: "competition",
    featured: true,
    registrationOpen: false,
    registrationKind: "team",
    title: "Codex Hackathon 2025",
    date: "18–19 Sep 2025",
    summary:
      "AIvolutions' flagship 2-day hackathon — 60+ teams, a live grand finale, and ₹19,000+ in prizes.",
    facts: ["60+ Teams", "2 Days", "₹19,000+ Prize Pool", "12 Finalists"],
    sections: [
      {
        heading: "The Event",
        body: "The CODEX Hackathon 2025, organized by AIvolutions — the official AI society of MAIT's Department of CSE-AI — was conducted on 18th–19th September 2025. This two-day flagship event brought together aspiring coders, innovators, and technology enthusiasts from the CSE-AI, CSE-DS, and CSE-AIML streams to collaborate, innovate, and build impactful technological solutions.",
      },
      {
        heading: "Rounds & Judging",
        body: "Over 60 teams competed in Round 1. Following a competitive selection process, 43 teams qualified for Round 2 on day one, and the top 12 advanced to the Grand Finale on 19th September, presenting their solutions live to a distinguished panel of judges. Throughout, participants had access to expert faculty mentorship, refining their ideas from ideation to implementation.",
      },
      {
        heading: "Winners & Credits",
        body: "Winners were recognized with a ₹19,000+ prize pool: 1st Prize (₹10,000) to Team RADICALS, 2nd Prize (₹5,000) to Team Digital Destroyers, and the Neighborly Choice Award (₹4,000) to Team NexaGen. The event was made possible by faculty coordinators Dr. Nitin Garg, Dr. Tina Dudeja, Dr. Nitish Uppal, and Dr. Anshu Khurana, under the leadership of Dr. Vinay Kumar Saini, HOD of CSE-AI & DS, with Neighborly Pvt. Ltd. as sponsor.",
      },
    ],
    imgUrl: "/assets/events/codex-2025/poster.jpg",
    id: "CMP_002",
    gallery: [
      "/assets/events/codex-2025/poster.jpg",
      "/assets/events/codex-2025/winners_1.jpg",
      "/assets/events/codex-2025/winners_2.jpg",
      "/assets/events/codex-2025/team_group.jpg",
      "/assets/events/codex-2025/mentoring.jpg",
      "/assets/events/codex-2025/guests.jpg",
    ],
  },
  {
    type: "competition",
    registrationOpen: false,
    registrationKind: "team",
    title: "The Coding Triathlon",
    date: "23–25 Mar 2025",
    summary:
      "A 3-day escalating challenge series — GitHub relay, live quiz, bug bounty, and a Level-Up finale.",
    facts: ["3 Days", "60+ Participants / Day", "GitHub Relay", "Bug Bounty", "Live Quiz"],
    sections: [
      {
        heading: "Overview",
        body: "\"The Coding Triathlon\" was a three-day technical event held from 23rd–25th March 2025, designed as a progressive challenge series where each day introduced a distinct technical dimension of escalating difficulty. Sessions consistently drew 60+ participants per day.",
      },
      {
        heading: "Day by Day",
        body: "Day 1 paired a GitHub Relay — a team-based activity covering repository creation, branching, pull requests, and conflict resolution — with an industry-academia session from DUCAT experts Mr. Sandeep and Mr. Deepak on Agentic AI, including a live hands-on demo of an AI chatbot's tool-calling in action. Day 2 brought a Kahoot-based live Quiz Competition spanning DSA, OS, Computer Networks, DBMS, and AI, followed by a Bug Bounty Challenge debugging real code across Python, JavaScript, and SQL. Day 3 culminated in a Level-Up format final — a multi-tiered showdown blending logical reasoning, algorithms, and rapid-fire coding — closing with a formal prize and medal distribution.",
      },
      {
        heading: "Organizers & Outlook",
        body: "The event was organized by Aivolutions under Faculty Coordinator Dr. Nitin Garg and HOD Dr. Vinay Kumar Saini, and is recommended for adoption as an annual event given its strong engagement and industry participation.",
      },
    ],
    imgUrl: "/assets/events/coding-triathlon/day1_guests.jpg",
    id: "CMP_TRI",
    gallery: [
      "/assets/events/coding-triathlon/day1_guests.jpg",
      "/assets/events/coding-triathlon/day1_group.jpg",
      "/assets/events/coding-triathlon/day1_interactive.jpg",
      "/assets/events/coding-triathlon/day2_session.jpg",
      "/assets/events/coding-triathlon/day2_lab.jpg",
      "/assets/events/coding-triathlon/day3_finale.jpg",
      "/assets/events/coding-triathlon/day3_group.jpg",
      "/assets/events/coding-triathlon/day3_prize_1.jpg",
      "/assets/events/coding-triathlon/day3_prize_2.jpg",
    ],
  },
  {
    type: "gallery",
    registrationOpen: false,
    registrationKind: "team",
    title: "Algosphere",
    date: "22 Mar – Apr 2025",
    summary:
      "AI & Data Analytics hackathon — 24 students, live judging, ₹6,000+ prize pool.",
    facts: ["24 Students", "₹6,000+ Prize Pool", "Multi-Round Format"],
    sections: [
      {
        heading: "Overview",
        body: "ALGOSPHERE'25, presented by AIvolutions × DataAnalytix, was MAIT's AI & Data Analytics hackathon, bringing together 24 students across AI&DS, CSE-AI, and CSE-DS for a multi-round challenge in innovative thinking and real-world problem-solving.",
      },
      {
        heading: "Rounds & Judging",
        body: "Registrations closed on 12th March 2025, followed by a preliminary round on 22nd March testing conceptual clarity and analytical thinking. The final round, held in the first week of April, saw shortlisted teams present fully developed solutions in Ethical AI, Smart Systems, and Data-Centric Innovation through live coding and real-time presentations, guided by dedicated mentors and evaluated live by a panel of expert judges.",
      },
      {
        heading: "Prizes & Credits",
        body: "With a prize pool of ₹6,000+, winning teams were recognized for innovation, technical execution, and collaborative spirit. The event was made possible by faculty coordinators Dr. Anshu Khurana, Mr. Nitish Uppal, Dr. Nitin Garg, and Ms. Tina Dudeja, under the guidance of Dr. Vinay Kumar Saini, Head of the CSE-AI & DS Department.",
      },
    ],
    imgUrl: "/assets/events/algosphere/report_1.jpg",
    id: "DIR_ALGO",
    gallery: [
      "/assets/events/algosphere/report_1.jpg",
      "/assets/events/algosphere/report_3.jpg",
      "/assets/events/algosphere/report_5.jpg",
    ],
  },
  {
    type: "workshop",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Metaverse — Game Development",
    date: "25 Nov 2024",
    summary:
      "A hands-on dive into game dev fundamentals and immersive Metaverse experiences.",
    facts: ["Hands-On Workshop", "VR / Metaverse Demo"],
    sections: [
      {
        heading: "Overview",
        body: "On 25th November 2024, AIvolutions hosted \"Metaverse — Game Development\", bringing together tech enthusiasts, coders, and gamers for an interactive deep dive into game development and immersive virtual environments.",
      },
      {
        heading: "What Happened",
        body: "Dr. Vinay Kumar Saini opened the session emphasizing hands-on learning and the integration of AI with next-generation technologies. Participants were then introduced to game design principles, animation and interactive graphics basics, and AI's role in adaptive game environments — including a live walkthrough of a Metaverse-based virtual world.",
      },
      {
        heading: "Hands-On & Credits",
        body: "The hands-on portion had teams collaborating on creative ideas and playing games together in real time, reinforcing the session's blend of learning and play. The event was guided by faculty coordinators Dr. Nitin Garg, Ms. Tina Dudeja, and Dr. Anshu Khurana, and organized by the AIVOLUTIONARIES core team.",
      },
    ],
    imgUrl: "/assets/events/metaverse/group.jpg",
    id: "WRK_META",
    gallery: [
      "/assets/events/metaverse/group.jpg",
      "/assets/events/metaverse/vr_demo.jpg",
      "/assets/events/metaverse/address.jpg",
    ],
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Enterprise Application Suite",
    date: "20 Feb 2025",
    summary:
      "An STMicroelectronics expert on how large enterprises run on ERP — architecture to career paths.",
    facts: ["Industry Keynote", "STMicroelectronics", "ERP Deep-Dive"],
    sections: [
      {
        heading: "Overview",
        body: "On 20th February 2025, AIvolutions hosted \"Introduction to Enterprise Application Suite\", an industry session on Enterprise Resource Planning (ERP) software featuring a guest speaker from STMicroelectronics, a global technology company.",
      },
      {
        heading: "The Keynote",
        body: "Keynote speaker Ms. Parul Mehndiratta, Business Enterprise Architect at STMicroelectronics, walked students through ERP fundamentals and architecture, its role in managing finance, HR, and supply chain, the shift toward cloud-based and AI-integrated ERP, and real-world examples of how multinational corporations deploy these systems at scale — along with career guidance for students eyeing the enterprise software domain.",
      },
      {
        heading: "Wrap-Up & Credits",
        body: "An open Q&A followed, and all attendees received participation certificates and AIvolutions membership access. The session was organized under the guidance of Dr. Vinay Kumar Saini, with support from Dr. Nitin Garg, Dr. Nitish Uppal, Ms. Tina Dudeja, and Dr. Anshu Khurana.",
      },
    ],
    imgUrl: "/assets/events/erp-suite/keynote.jpg",
    id: "WEB_ERP",
    gallery: [
      "/assets/events/erp-suite/keynote.jpg",
      "/assets/events/erp-suite/handover.jpg",
      "/assets/events/erp-suite/session.jpg",
    ],
  },
  {
    type: "visit",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Industrial Visit — DUCAT Pitampura",
    date: "18 Oct 2024",
    summary:
      "Hands-on AI/ML/NLP session and live problem-solving at DUCAT's industry training campus.",
    facts: ["Industrial Visit", "ML · CV · NLP", "Live Problem-Solving"],
    sections: [
      {
        heading: "Overview",
        body: "On 18th October 2024, students from MAIT's Department of Artificial Intelligence visited DUCAT Pitampura, a premier IT training institute, to explore real-world applications of AI — including Machine Learning, Computer Vision, Deep Learning, and Natural Language Processing.",
      },
      {
        heading: "Hands-On Session",
        body: "The session opened with a deep dive into ML (supervised/unsupervised learning), Computer Vision (CNNs, object detection), Deep Learning, and NLP (chatbots, sentiment analysis). Students then split into teams for a hands-on, real-time problem-solving challenge, applying the concepts they'd just learned to a live problem statement.",
      },
      {
        heading: "Feedback & Credits",
        body: "Each team presented their solutions to DUCAT trainers and industry experts, receiving feedback on algorithm accuracy, deployment practices, and scalability — bridging classroom theory with industry expectations. The visit was made possible through the guidance of Dr. Vinay Kumar Saini and Dr. Nitin Garg.",
      },
    ],
    imgUrl: "/assets/events/ducat-visit/session.jpg",
    id: "VST_DUCAT",
    gallery: [
      "/assets/events/ducat-visit/session.jpg",
      "/assets/events/ducat-visit/discussion_1.jpg",
      "/assets/events/ducat-visit/discussion_2.jpg",
    ],
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Orientation 2024",
    date: "29 Sep 2024",
    summary:
      "Kickstarting the journey into AIVOLUTIONS — core team intros, guest talks, and the year's roadmap.",
    facts: ["Society Kickoff", "Core Team Intro", "Open Q&A"],
    sections: [
      {
        heading: "Overview",
        body: "Held on 29th September 2024, the AIvolutions Orientation Event marked the beginning of a new chapter for the AI society at MAIT — welcoming new members, introducing the core team, and sharing the society's vision for the year ahead.",
      },
      {
        heading: "Highlights",
        body: "Dr. Vinay Saini, Head of the AI & DS Department, opened with an address on hands-on learning and industry exposure, followed by the core team unveiling the year's lineup: AI hackathons, \"Code in the Dark\" coding competitions, technical workshops (including a special Microsoft session), and robotics/AI integration projects. Guest speaker Ms. Tushika (Founder, 15FORTEEN) shared strategies for balancing academics with co-curricular pursuits, and senior member Jinal Gupta spoke about her own growth through the society.",
      },
      {
        heading: "Closing",
        body: "The event closed with an open Q&A and a strong foundation set for the year, leaving new members clear on the society's goals and inspired to get involved.",
      },
    ],
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg",
    id: "WEB_002",
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Preparation Mantra",
    date: "27 May 2025",
    summary:
      "Jinal Gupta's exam-season webinar on smart prep, time management, and scoring technique.",
    facts: ["Exam Prep Webinar", "Time Management", "Live Q&A"],
    sections: [
      {
        heading: "Overview",
        body: "On 27th May 2025, AIvolutions, in collaboration with DataAnalytix, conducted an exclusive webinar titled \"Preparation Mantra — Unlock Your Exam Success!\" to help students navigate end-semester exams with practical, effective strategies.",
      },
      {
        heading: "What Was Covered",
        body: "The session was led by Jinal Gupta, a senior AIvolutions member known for balancing academic excellence with co-curricular activity. She covered smart exam preparation tips, effective time management, maintaining a strong CGPA through consistent performance, and pro techniques for attempting different question types under time pressure.",
      },
      {
        heading: "Impact",
        body: "The webinar left students equipped with tools to approach their examinations with confidence, and reflected AIvolutions' ongoing commitment to supporting academic growth alongside technical learning.",
      },
    ],
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg",
    id: "WEB_001",
  },
];

const TYPE_META = {
  webinar: { label: "WEBINAR", color: "text-blue-400", dot: "bg-blue-400" },
  competition: { label: "COMPETITION", color: "text-purple-400", dot: "bg-purple-400" },
  gallery: { label: "GALLERY", color: "text-amber-400", dot: "bg-amber-400" },
  visit: { label: "INDUSTRIAL VISIT", color: "text-emerald-400", dot: "bg-emerald-400" },
  workshop: { label: "WORKSHOP", color: "text-cyan-400", dot: "bg-cyan-400" },
};

const ANIMATION_VARIANTS = [
  "animate__slideInUp",
  "animate__slideInLeft",
  "animate__slideInRight",
  "animate__fadeIn",
  "animate__zoomIn",
];

export const Events = () => {
  const location = useLocation();
  const [fullscreenEvent, setFullscreenEvent] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [events, setEvents] = useState(EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Deep-link support: the homepage carousel navigates here with
  // { state: { eventId } } so "View Event" opens straight to that event.
  useEffect(() => {
    const eventId = location.state?.eventId;
    if (!eventId) return;
    const match = events.find((e) => e.id === eventId);
    if (match) setFullscreenEvent(match);
  }, [location.state, events]);

  const pastEvents = events.filter((e) => !e.registrationOpen);

  return (
    <section className="relative min-h-screen bg-dark text-white pt-28 pb-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-primary via-transparent to-primary opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <header className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tighter mb-6">
            EVENTS
          </h1>
          <p className="font-mono text-xs text-muted tracking-widest max-w-2xl mx-auto leading-relaxed">
            Every hackathon, workshop, and visit — documented in full.
            Click any card for the full story and photos.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 font-mono text-sm text-muted">
            Loading events…
          </div>
        ) : error ? (
          <div className="text-center py-20 font-mono text-sm text-red-400">
            Failed to load events. Showing cached data.
          </div>
        ) : (
          <>
            {pastEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-6 h-px bg-primary/60" />
                  <h2 className="font-display font-extrabold text-3xl md:text-4xl uppercase tracking-tight text-white">
                    Past Events
                  </h2>
                </div>
                <EventGrid events={pastEvents} onGalleryClick={setFullscreenEvent} />
              </div>
            )}
          </>
        )}
      </div>

      <FullscreenGallery
        event={fullscreenEvent}
        loadedImages={loadedImages}
        onMarkLoaded={(id) => setLoadedImages((p) => ({ ...p, [id]: true }))}
        onClose={() => setFullscreenEvent(null)}
        onRegisterClick={(evt) => {
          setFullscreenEvent(null);
          setRegisteringEvent(evt);
        }}
      />

      <EventRegistrationModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
      />
    </section>
  );
};

const EventGrid = ({ events: list, onGalleryClick }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {list.map((event, index) => (
      <TrackVisibility key={event.id} once partialVisibility offset={50}>
        {({ isVisible }) => (
          <li
            className={`relative group transition-all duration-500 ${
              event.featured ? "md:col-span-2" : ""
            } ${
              isVisible
                ? `${ANIMATION_VARIANTS[index % ANIMATION_VARIANTS.length]} animate__slow`
                : "opacity-0 translate-y-8"
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <EventCard
              event={event}
              meta={TYPE_META[event.type]}
              alternate={index % 2 === 1}
              onGalleryClick={() => onGalleryClick(event)}
            />
          </li>
        )}
      </TrackVisibility>
    ))}
  </ul>
);

const FullscreenGallery = ({ event, loadedImages, onMarkLoaded, onClose, onRegisterClick }) => {
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    if (!event) return;
    const onEsc = (e) => {
      if (e.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [event, onClose, zoomedImage]);

  if (!event) return null;

  const handleImgLoad = (src) => {
    if (!loadedImages[src]) onMarkLoaded(src);
  };

  const close = () => onClose();

  const hasGallery = event.gallery && event.gallery.length > 1;
  const images = hasGallery ? event.gallery : [event.imgUrl];

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
        onClick={close}
      >
        <button
          onClick={close}
          className="absolute top-6 right-6 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
        >
          CLOSE ×
        </button>

        <div
          className="w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-xl border border-gridline"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero: first image shown in full, no cropping. A blurred, scaled
              copy of the same image fills the letterbox space instead of flat black. */}
          <div className="bg-surface">
            <div
              className="relative flex items-center justify-center h-[40vh] md:h-[55vh] overflow-hidden cursor-zoom-in"
              onClick={() => setZoomedImage(images[0])}
            >
              {!loadedImages[images[0]] && (
                <div className="absolute inset-0 bg-gridline animate-pulse flex items-center justify-center z-10">
                  <span className="font-mono text-[9px] text-muted">LOADING</span>
                </div>
              )}
              <img
                src={images[0]}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60 transition-opacity duration-500 ${
                  loadedImages[images[0]] ? "opacity-60" : "opacity-0"
                }`}
              />
              <img
                src={images[0]}
                alt={event.title}
                className={`relative max-w-full max-h-full object-contain mx-auto shadow-2xl transition-all duration-500 ${
                  loadedImages[images[0]] ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                }`}
                onLoad={() => handleImgLoad(images[0])}
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight text-center px-6">
              {event.title}
            </h2>

            {(event.date || TYPE_META[event.type]) && (
              <div className="flex items-center justify-center gap-3 mt-3 pb-6 font-mono text-[10px] tracking-widest uppercase text-muted">
                {TYPE_META[event.type] && (
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${TYPE_META[event.type].dot}`} />
                    <span className={TYPE_META[event.type].color}>{TYPE_META[event.type].label}</span>
                  </span>
                )}
                {event.date && (
                  <>
                    <span className="text-gridline">•</span>
                    <span>{event.date}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-surface/30 p-6 md:p-10">
            {event.registrationOpen && (
              <div className="max-w-2xl mx-auto mb-10">
                <button
                  onClick={() => onRegisterClick(event)}
                  className="w-full py-4 border border-primary bg-primary/10 text-white font-mono text-sm tracking-widest uppercase hover:bg-primary transition-all duration-300"
                >
                  Register For This Event <span className="ml-1">→</span>
                </button>
              </div>
            )}

            {event.facts && event.facts.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-10">
                {event.facts.map((fact, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            )}

            {event.sections && (
              <div className="max-w-2xl mx-auto">
                {event.sections.map((section, idx) => (
                  <div key={idx} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-6 h-px bg-primary/60" />
                      <h4 className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-white">
                        {section.heading}
                      </h4>
                    </div>
                    <p className="text-sm md:text-[15px] text-white/70 font-sans leading-[1.9] tracking-wide">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {hasGallery && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px bg-primary/60" />
                  <h4 className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-white">
                    In Photos
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-5">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[4/3] border border-gridline overflow-hidden bg-dark rounded-lg cursor-zoom-in ${
                      idx === images.length - 1 && images.length % 2 !== 0 ? "col-span-2" : ""
                    }`}
                    onClick={() => setZoomedImage(img)}
                  >
                    {!loadedImages[img] && (
                      <div className="absolute inset-0 bg-gridline animate-pulse flex items-center justify-center z-10">
                        <span className="font-mono text-[9px] text-muted">
                          LOADING
                        </span>
                      </div>
                    )}
                    <img
                      src={img}
                      alt=""
                      aria-hidden="true"
                      className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50 transition-opacity duration-500 ${
                        loadedImages[img] ? "opacity-50" : "opacity-0"
                      }`}
                    />
                    <img
                      src={img}
                      alt={`${event.title} gallery ${idx + 1}`}
                      className={`relative w-full h-full object-contain transition-all duration-500 ${
                        loadedImages[img] ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                      }`}
                      onLoad={() => handleImgLoad(img)}
                    />
                    <div className="absolute bottom-1 right-1 font-mono text-[7px] text-white/20 bg-black/30 px-2 py-0.5 rounded z-10">
                      IMG_{idx.toString().padStart(3, "0")}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="max-w-[90vw] max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
          >
            CLOSE ×
          </button>
        </div>
      )}
    </>
  );
};

const EventCard = ({ event, meta, alternate, onGalleryClick }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onGalleryClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onGalleryClick()}
      className={`relative h-full border transition-all duration-500 bg-surface overflow-hidden cursor-pointer ${
        event.featured
          ? "border-primary shadow-[0_0_35px_rgba(249,115,22,0.25)]"
          : event.registrationOpen
          ? "border-green-500/60 shadow-[0_0_35px_rgba(34,197,94,0.15)]"
          : "border-gridline group-hover:border-primary"
      }`}
    >
      {event.featured && (
        <span className="absolute top-4 left-4 z-20 font-mono text-[9px] tracking-widest uppercase text-white bg-primary px-3 py-1 rounded-full shadow-lg">
          ★ Flagship Event
        </span>
      )}

      {event.registrationOpen && (
        <span className="absolute top-4 right-4 z-20 flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-white bg-green-600 px-3 py-1 rounded-full shadow-lg">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          Registration Open
        </span>
      )}

      <div className="relative overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gridline animate-pulse flex items-center justify-center z-10">
            <span className="font-mono text-[9px] text-muted">LOADING</span>
          </div>
        )}
        <div
          className={`${event.featured ? "aspect-[21/9]" : "aspect-[16/10]"} transition-all duration-700 ${
            imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          }`}
        >
          <img
            src={event.imgUrl}
            alt={event.title}
            className={`w-full h-full object-cover filter transition-all duration-700 group-hover:scale-105 ${
              alternate && !event.featured ? "grayscale group-hover:grayscale-0" : ""
            } ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-2 h-2 rounded-full ${meta.dot} shadow-[0_0_6px_currentColor]`}
          />
          <span className={`font-mono text-[9px] tracking-widest uppercase ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        <h3
          className={`font-display font-bold text-white uppercase mb-3 group-hover:text-primary transition-colors duration-300 ${
            event.featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          {event.title}
        </h3>

        <p
          className={`text-muted font-sans leading-relaxed mb-4 flex-grow ${
            event.featured ? "text-base md:max-w-2xl" : "text-sm"
          }`}
          style={{ display: "-webkit-box", WebkitLineClamp: event.featured ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {event.summary}
        </p>

        <span className="mt-2 font-mono text-xs uppercase tracking-widest text-primary group-hover:text-white transition-colors duration-300">
          Read the full story
          <span className="ml-1">→</span>
        </span>
      </div>
    </div>
  );
};
