import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EVENTS } from '../../data/events';
import { SectionHeading, SnapRow, pressable } from './primitives';

const TYPE_LABEL = {
  webinar: 'Webinar',
  competition: 'Competition',
  gallery: 'Gallery',
  visit: 'Industrial visit',
  workshop: 'Workshop',
};

// Mobile counterpart of EventHighlights. The desktop version is a pinned
// 3D helix: eight cards on a preserve-3d cylinder, each drawing two copies
// of its image (one blurred), rotated by a scrubbed tween. On a phone the
// side cards clipped the viewport and the blurred copies cost a full
// repaint per scroll frame. Here it's a swipeable snap row of flat cards.
export const EventsMobile = () => {
  const navigate = useNavigate();

  return (
    <section className="border-t border-white/5 bg-black py-16 sm:py-20">
      <div className="mx-auto flex max-w-5xl items-end justify-between gap-4 px-5 sm:px-8">
        <SectionHeading label="// FIELD_LOG" title="Events" />
        <Link
          to="/events"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest text-[#f97316]"
        >
          All events <span aria-hidden="true">→</span>
        </Link>
      </div>

      <SnapRow className="mt-8" ariaLabel="Event highlights">
        {EVENTS.map((evt, i) => (
          <button
            key={evt.id}
            type="button"
            role="listitem"
            onClick={() => navigate('/events', { state: { eventId: evt.id } })}
            className={`reveal w-[72vw] max-w-[300px] shrink-0 snap-start text-left sm:w-[280px] ${pressable}`}
            style={{ '--reveal-i': Math.min(i, 2) + 1 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#f97316]/40 bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <img
                src={evt.imgUrl}
                alt={evt.title}
                // The first two cards are in view on load; the rest only
                // download once the row is scrolled.
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-[#f97316]">
                  {TYPE_LABEL[evt.type] || evt.type}
                  {evt.date ? ` · ${evt.date}` : ''}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-white">
                  {evt.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </SnapRow>
    </section>
  );
};
