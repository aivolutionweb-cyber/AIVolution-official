import { Link, useLocation } from 'react-router-dom';
import { InstagramIcon, LinkedInIcon } from './icons';
import { FooterArt } from './home/FooterArt';
import { BrandMark } from './BrandMark';

const INSTAGRAM = 'https://www.instagram.com/aivolutions.mait?stkn=MTAwbGdpdHI0enA0bQ%3D%3D';
const LINKEDIN = 'https://www.linkedin.com/company/aivolutionaries/';

// Notebook footer (every route): the "last page" with the ID card, then a hand-written sign-off.
const PaperFooter = () => {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  return (
    <footer className="nb relative bg-paper text-ink overflow-hidden">
      {/* tear line, repo stats, cards and the ID card; remounts per route so the card drops on every page */}
      <FooterArt key={pathname} />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-2 pb-10">
        <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <BrandMark size="lg" />
            <div>
              <p className="font-hand text-2xl leading-none">built by the Tech &amp; Dev team, with too much coffee.</p>
              <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-pencil mt-2">© {year} AIvolutions · the official AI society of MAIT</p>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-pencil">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-mint animate-pulse" />all systems operational</span>
            <span className="text-pen font-bold">⎇ main</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Dark footer for every other route.
const DarkFooter = () => (
  <footer className="relative bg-black text-white overflow-hidden">
    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f97316]/40 to-transparent"></div>
    <div className="container mx-auto px-5 sm:px-6 md:px-16 lg:px-32 pt-8 pb-10 sm:pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
        <div>
          <img src="/main-logo-small.webp" alt="AIvolution Logo" width="240" height="199" loading="lazy" decoding="async" className="h-12 sm:h-14 w-auto object-contain mb-4 sm:mb-5 opacity-90" />
          <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-md">
            The official AI Society of Maharaja Agrasen Institute of Technology.
            <br />Building the next generation of engineers.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-all duration-300" aria-label="Instagram">
            <InstagramIcon className="w-5 h-5 text-gray-500 group-hover:text-[#f97316] transition-colors" />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-all duration-300" aria-label="LinkedIn">
            <LinkedInIcon className="w-5 h-5 text-gray-500 group-hover:text-[#f97316] transition-colors" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
        <div>
          <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6">Navigate</h4>
          <ul className="space-y-4">
            <li><Link to="/team" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Team</Link></li>
            <li><Link to="/events" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Events</Link></li>
            <li><Link to="/#contributors" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Faculty</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6">Connect</h4>
          <ul className="space-y-4">
            <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Instagram</a></li>
            <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">LinkedIn</a></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-2 md:text-right">
          <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6 md:text-right">Location</h4>
          <p className="text-gray-500 text-sm font-sans leading-relaxed">
            Maharaja Agrasen Institute of Technology
            <br />
            Sector 22, Rohini, Delhi — 110086
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 z-10 relative text-center md:text-left">
        <p className="text-gray-600 font-sans text-xs">© {new Date().getFullYear()} AIvolution. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-gray-600 font-sans text-xs">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export const Footer = ({ variant = 'dark' }) => (variant === 'paper' ? <PaperFooter /> : <DarkFooter />);
