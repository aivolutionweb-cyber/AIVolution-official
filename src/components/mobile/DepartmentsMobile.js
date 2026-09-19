import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../../data/departments';
import { SectionHeading, ArrowIcon, pressable } from './primitives';

// Mobile counterpart of Skills. The desktop version pins a 400vw track and
// scrubs it sideways while morphing a 200vw blurred SVG beam; on a phone the
// cards were cut off at both edges and the beam re-rasterised every frame.
// Here each department is a tappable card in a normal vertical list.
export const DepartmentsMobile = () => (
  <section id="skills" className="border-t border-white/5 bg-black px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-5xl">
      <SectionHeading label="// FOUR TEAMS. ONE SYSTEM." title="The Departments" />

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {DEPARTMENTS.map((dept, i) => (
          <Link
            key={dept.key}
            to={`/team?dept=${dept.key}`}
            className={`reveal group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 active:bg-white/[0.07] ${pressable}`}
            style={{ '--reveal-i': (i % 2) + 1 }}
          >
            <span
              className="pointer-events-none absolute -right-1 -top-5 select-none font-display text-[5.5rem] font-extrabold leading-none text-white/[0.04]"
              aria-hidden="true"
            >
              {`0${i + 1}`}
            </span>

            <span className="font-mono text-[0.65rem] tracking-widest text-[#f97316]">{dept.id}</span>
            <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {dept.title}
            </h3>
            <div className="mt-3 h-1 w-12 rounded-full bg-[#f97316]" aria-hidden="true" />
            <p className="mt-4 text-[15px] leading-relaxed text-gray-400">{dept.desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-white/60">
              View team
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
