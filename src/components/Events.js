import { useState, useEffect } from "react";
import TrackVisibility from "react-on-screen";
import "animate.css";
import { fetchEvents } from "../services/eventsService";

const EVENTS = [
  {
    type: "webinar",
    title: "Preparation Mantra",
    description:
      "Foundational webinar setting the right mindset for aspiring AI practitioners.",
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg",
    id: "WEB_001",
  },
  {
    type: "webinar",
    title: "Orientation 2024",
    description:
      "Kickstarting the journey into AIVOLUTIONS with an overview of tracks and goals.",
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg",
    id: "WEB_002",
  },
  {
    type: "competition",
    title: "Codex Hackathon",
    description:
      "48-hour buildathon crafting next-gen AI prototypes and demos.",
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg",
    id: "CMP_002",
  },
  {
    type: "gallery",
    title: "Algosphere",
    description:
      "Algorithmic puzzle challenge testing speed, accuracy, and strategy. Participants tackled real-world challenges over multiple rigorous rounds.",
    imgUrl: "/assets/events/algosphere/pic_1.jpg",
    id: "DIR_ALGO",
    gallery: [
      "/assets/events/algosphere/pic_1.jpg",
      "/assets/events/algosphere/pic_2.jfif",
      "/assets/events/algosphere/pic_3.jfif",
      "/assets/events/algosphere/pic_4.jfif",
    ],
  },
];

const TYPE_META = {
  webinar: { label: "WEBINAR", color: "text-blue-400", dot: "bg-blue-400" },
  competition: { label: "COMPETITION", color: "text-purple-400", dot: "bg-purple-400" },
  gallery: { label: "GALLERY", color: "text-amber-400", dot: "bg-amber-400" },
};

const ANIMATION_VARIANTS = [
  "animate__slideInUp",
  "animate__slideInLeft",
  "animate__slideInRight",
  "animate__fadeIn",
  "animate__zoomIn",
];

export const Events = () => {
  const [fullscreenEvent, setFullscreenEvent] = useState(null);
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
          <span className="font-mono text-[9px] text-muted tracking-widest uppercase mb-4 block">
            {"// EVENT_FEED"}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tighter mb-6">
            EVENTS
          </h1>
          <p className="font-mono text-xs text-muted tracking-widest max-w-2xl mx-auto leading-relaxed">
            A living feed of community sessions — each card holds a moment in
            time. Hover to reveal more, click to explore.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center py-20 font-mono text-sm text-muted">
              Loading events…
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-20 font-mono text-sm text-red-400">
              Failed to load events. Showing cached data.
            </div>
          ) : (
            events.map((event, index) => (
              <TrackVisibility key={event.id} once partialVisibility offset={50}>
                {({ isVisible }) => (
                  <li
                    className={`relative group transition-all duration-500 ${
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
                      onGalleryClick={() => setFullscreenEvent(event)}
                    />
                  </li>
                )}
              </TrackVisibility>
            ))
          )}
        </ul>
      </div>

      <FullscreenGallery
        event={fullscreenEvent}
        loadedImages={loadedImages}
        onMarkLoaded={(id) => setLoadedImages((p) => ({ ...p, [id]: true }))}
        onClose={() => setFullscreenEvent(null)}
      />
    </section>
  );
};

const FullscreenGallery = ({ event, loadedImages, onMarkLoaded, onClose }) => {
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

        <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-8 text-center">
          {event.title}
        </h2>

        <div
          className="w-full max-w-6xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {event.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative border border-gridline overflow-hidden bg-dark rounded-lg cursor-zoom-in"
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
                  alt={`${event.title} gallery ${idx + 1}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    loadedImages[img] ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                  }`}
                  onLoad={() => handleImgLoad(img)}
                />
                <div className="absolute bottom-1 right-1 font-mono text-[7px] text-white/20 bg-black/30 px-2 py-0.5 rounded">
                  IMG_{idx.toString().padStart(3, "0")}
                </div>
              </div>
            ))}
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
      className={`relative h-full border transition-all duration-500 bg-surface overflow-hidden border-gridline group-hover:border-primary`}
    >
      <div className="relative overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gridline animate-pulse flex items-center justify-center z-10">
            <span className="font-mono text-[9px] text-muted">LOADING</span>
          </div>
        )}
        <div
          className={`aspect-[16/10] transition-all duration-700 ${
            imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          }`}
        >
          <img
            src={event.imgUrl}
            alt={event.title}
            className={`w-full h-full object-cover filter transition-all duration-700 group-hover:scale-105 ${
              alternate ? "grayscale group-hover:grayscale-0" : ""
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
          <span className="font-mono text-[8px] text-muted">{event.id}</span>
        </div>

        <h3 className="text-xl font-display font-bold text-white uppercase mb-3 group-hover:text-primary transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-sm text-muted font-sans leading-relaxed mb-4 flex-grow">
          {event.description}
        </p>

        {event.type === "gallery" && (
          <button
            onClick={onGalleryClick}
            className="mt-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-white transition-colors duration-300"
          >
            View gallery
            <span className="ml-1">+</span>
          </button>
        )}
      </div>
    </div>
  );
};
