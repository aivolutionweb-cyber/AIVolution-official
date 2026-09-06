import React from 'react';
import { useSearchParams } from 'react-router-dom';

const departments = [
  { key: 'tech-dev', label: 'Tech & Dev', id: 'MOD_01' },
  { key: 'event-mgmt', label: 'Event Mgmt', id: 'MOD_02' },
  { key: 'design-creative', label: 'Design & Creative', id: 'MOD_03' },
  { key: 'public-relations', label: 'Public Relations', id: 'MOD_04' },
];

const teamMembers = {
  'tech-dev': [
    { name: 'Arjun Mehta', role: 'Lead Developer', img: 'https://i.postimg.cc/1z2vZ3vL/tech-01.jpg' },
    { name: 'Sneha Kapoor', role: 'AI Engineer', img: 'https://i.postimg.cc/1z2vZ3vL/tech-02.jpg' },
    { name: 'Rohan Singh', role: 'Full Stack Dev', img: 'https://i.postimg.cc/1z2vZ3vL/tech-03.jpg' },
    { name: 'Priya Nair', role: 'Mobile Developer', img: 'https://i.postimg.cc/1z2vZ3vL/tech-04.jpg' },
  ],
  'event-mgmt': [
    { name: 'Kunal Verma', role: 'Event Head', img: 'https://i.postimg.cc/1z2vZ3vL/event-01.jpg' },
    { name: 'Aarohi Jain', role: 'Logistics Lead', img: 'https://i.postimg.cc/1z2vZ3vL/event-02.jpg' },
    { name: 'Devansh Rawat', role: 'Operations', img: 'https://i.postimg.cc/1z2vZ3vL/event-03.jpg' },
  ],
  'design-creative': [
    { name: 'Ishaan Gupta', role: 'Creative Head', img: 'https://i.postimg.cc/1z2vZ3vL/design-01.jpg' },
    { name: 'Tanya Bansal', role: 'UI/UX Designer', img: 'https://i.postimg.cc/1z2vZ3vL/design-02.jpg' },
    { name: 'Manav Arora', role: 'Motion Designer', img: 'https://i.postimg.cc/1z2vZ3vL/design-03.jpg' },
    { name: 'Riya Malhotra', role: 'Graphic Designer', img: 'https://i.postimg.cc/1z2vZ3vL/design-04.jpg' },
    { name: 'Krishna Sharma', role: 'Brand Designer', img: 'https://i.postimg.cc/1z2vZ3vL/design-05.jpg' },
  ],
  'public-relations': [
    { name: 'Ananya Joshi', role: 'PR Head', img: 'https://i.postimg.cc/1z2vZ3vL/pr-01.jpg' },
    { name: 'Vikram Rathore', role: 'Outreach Lead', img: 'https://i.postimg.cc/1z2vZ3vL/pr-02.jpg' },
    { name: 'Simran Kaur', role: 'Communications', img: 'https://i.postimg.cc/1z2vZ3vL/pr-03.jpg' },
  ],
};

export const TeamPage = () => {
  const [searchParams] = useSearchParams();
  const activeDept = searchParams.get('dept') || 'tech-dev';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-16">
          <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
            {'// OUR PEOPLE'}
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
            Meet Our Team
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            The minds behind AIVolution. Organized by department, united by vision.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {departments.map((dept) => (
            <a
              key={dept.key}
              href={`/team?dept=${dept.key}`}
              className={`px-6 py-3 rounded-full border text-sm font-medium tracking-wide transition-all duration-300 ${
                activeDept === dept.key
                  ? 'bg-[#f97316] border-[#f97316] text-black'
                  : 'border-white/10 text-white hover:border-[#f97316]/50 hover:text-[#f97316]'
              }`}
            >
              {dept.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers[activeDept]?.map((member, idx) => (
            <div
              key={idx}
              className="group relative w-full aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-colors duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end pointer-events-none z-10">
                <p className="font-mono text-[10px] md:text-xs text-[#ea580c] tracking-[0.15em] uppercase">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
