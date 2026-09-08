import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const departments = [
  { key: 'tech-dev', label: 'Tech & Dev', id: 'MOD_01' },
  { key: 'event-mgmt', label: 'Event Management', id: 'MOD_02' },
  { key: 'design-creative', label: 'Social Media & Content Creation', id: 'MOD_03' },
  { key: 'public-relations', label: 'Public Relations', id: 'MOD_04' },
];

const teamMembers = {
  'tech-dev': [
    { name: 'Ishan', role: 'Developer', img: 'https://i.postimg.cc/VvJdtjPw/Ishan.jpg' },
    { name: 'Diwakar', role: 'Developer', img: 'https://i.postimg.cc/fyy0vGm4/Diwakar.jpg' },
    { name: 'Kriti', role: 'Developer', img: 'https://i.postimg.cc/fyqYnzZ6/kriti.jpg' },
    { name: 'Rahul', role: 'Developer', img: 'https://i.postimg.cc/SNwzWtsy/rahul.jpg' },
    { name: 'Falak', role: 'Developer', img: 'https://i.postimg.cc/m2xH95hW/falak.jpg' },
    { name: 'Aparna', role: 'Tech Lead', img: 'https://i.postimg.cc/MpSVCF8X/aparna.jpg' },
  ],
  'event-mgmt': [
    { name: 'Madhur', role: 'Event Manager', img: 'https://i.postimg.cc/hGRTq3W3/madhur.jpg' },
    { name: 'Parth', role: 'Event Manager', img: 'https://i.postimg.cc/dt7yZKJC/parth.jpg' },
  ],
  'design-creative': [
    { name: 'Apoorva', role: 'Content Creator', img: 'https://i.postimg.cc/PxzBMchy/apoorva.jpg' },
    { name: 'Kshitij', role: 'Content Creator', img: 'https://i.postimg.cc/BQy2mnhG/kshtiij.jpg' },
    { name: 'Naman', role: 'Content Creator', img: 'https://i.postimg.cc/ryZ4ppXB/naman.jpg' },
    { name: 'Pranjal', role: 'Content Creator', img: 'https://i.postimg.cc/nzyCvXFY/pranjal.jpg' },
  ],
  'public-relations': [
    { name: 'Sharad', role: 'PR Lead', img: 'https://i.postimg.cc/tgbZcZW2/sharad.jpg' },
  ],
};

const MemberCard = ({ member }) => {
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      className="group relative w-full aspect-[3/4] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-colors duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
    >
      {member.img ? (
        <img
          src={member.img}
          alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
          <span className="text-4xl font-display font-bold text-white/10 tracking-widest select-none">
            {initials}
          </span>
        </div>
      )}
      {member.img && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
      )}
                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end pointer-events-none z-10">
                  <p className="text-sm md:text-base font-medium text-white/90 text-center">
                    {member.name}
                  </p>
                </div>
    </div>
  );
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
            <Link
              key={dept.key}
              to={`/team?dept=${dept.key}`}
              className={`px-6 py-3 rounded-full border text-sm font-medium tracking-wide transition-all duration-300 ${
                activeDept === dept.key
                  ? 'bg-[#f97316] border-[#f97316] text-black'
                  : 'border-white/10 text-white hover:border-[#f97316]/50 hover:text-[#f97316]'
              }`}
            >
              {dept.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers[activeDept]?.map((member, idx) => (
            <MemberCard key={idx} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};
