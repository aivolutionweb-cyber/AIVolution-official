import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TrackVisibility from "react-on-screen";
import "animate.css";
import { fetchEvents } from "../services/eventsService";
import { EventRegistrationModal } from "./EventRegistrationModal";

import { EVENTS } from "../data/events";

// Re-exported for backwards compatibility with existing imports.
export { EVENTS };

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
    <section className="relative min-h-screen bg-dark text-white pt-24 sm:pt-28 pb-24 sm:pb-40 overflow-hidden">
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

      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-7xl">
        <header className="text-center mb-12 sm:mb-20">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tighter mb-4 sm:mb-6 px-2">
            EVENTS
          </h1>
          <p className="font-mono text-[0.7rem] sm:text-xs text-muted tracking-widest max-w-2xl mx-auto leading-relaxed px-2">
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
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
        onClick={close}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          CLOSE ×
        </button>

        <div
          className="w-full max-w-5xl max-h-[90vh] sm:max-h-[88vh] overflow-y-auto rounded-xl border border-gridline"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero: first image shown in full, no cropping. A blurred, scaled
              copy of the same image fills the letterbox space instead of flat black. */}
          <div className="bg-surface">
            <div
              className="relative flex items-center justify-center h-[32vh] sm:h-[40vh] md:h-[55vh] overflow-hidden cursor-zoom-in"
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
                decoding="async"
                className={`relative max-w-full max-h-full object-contain mx-auto shadow-2xl transition-[opacity,filter] duration-500 ${
                  loadedImages[images[0]] ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                }`}
                onLoad={() => handleImgLoad(images[0])}
              />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight text-center px-4 sm:px-6">
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

          <div className="bg-surface/30 p-4 sm:p-6 md:p-10">
            {event.registrationOpen && (
              <div className="max-w-2xl mx-auto mb-10">
                <button
                  onClick={() => onRegisterClick(event)}
                  className="w-full py-4 border border-primary bg-primary/10 text-white font-mono text-sm tracking-widest uppercase hover:bg-primary transition-colors duration-300"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50 transition-opacity duration-500 ${
                        loadedImages[img] ? "opacity-50" : "opacity-0"
                      }`}
                    />
                    <img
                      src={img}
                      alt={`${event.title} gallery ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className={`relative w-full h-full object-contain transition-[opacity,filter] duration-500 ${
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
      className={`relative h-full border transition-[border-color,box-shadow] duration-500 bg-surface overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:border-primary ${
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
          className={`${event.featured ? "aspect-[21/9]" : "aspect-[16/10]"} transition-[opacity,filter] duration-700 ${
            imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          }`}
        >
          <img
            src={event.imgUrl}
            alt={event.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover filter transition-[opacity,transform,filter] duration-700 group-hover:scale-105 ${
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

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
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
