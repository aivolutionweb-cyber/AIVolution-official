import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      
      {/* Top accent line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f97316]/40 to-transparent"></div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 md:px-16 lg:px-32 pt-8 pb-12">
        
        {/* Top row: Logo + Tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-20">
          <div>
            <img 
              src="/main-logo-no-bg.png" 
              alt="AIvolution Logo" 
              className="h-14 w-auto object-contain mb-5 opacity-90" 
            />
            <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-md">
              The official AI Society of Maharaja Agrasen Institute of Technology.
              <br />Building the next generation of engineers.
            </p>
          </div>
          
          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a 
              href="https://www.instagram.com/aivolutions.mait?stkn=MTAwbGdpdHI0enA0bQ%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#f97316] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/aivolutionaries/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#f97316] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6">Navigate</h4>
            <ul className="space-y-4">
              <li><Link to="/team" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Team</Link></li>
              <li><Link to="/events" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Events</Link></li>
              <li><a href="#faculty" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Faculty</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6">Connect</h4>
            <ul className="space-y-4">
              <li><a href="https://www.instagram.com/aivolutions.mait?stkn=MTAwbGdpdHI0enA0bQ%3D%3D" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/aivolutionaries/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm font-sans transition-colors duration-200">LinkedIn</a></li>
            </ul>
          </div>

          {/* Location */}
          <div className="col-span-2 md:col-span-2 md:text-right">
            <h4 className="font-mono text-[#f97316] text-[10px] tracking-[0.3em] uppercase mb-6 md:text-right">Location</h4>
            <p className="text-gray-500 text-sm font-sans leading-relaxed">
              Maharaja Agrasen Institute of Technology
              <br />
              Sector 22, Rohini, Delhi — 110086
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
          <p className="text-gray-600 font-sans text-xs">
            © {new Date().getFullYear()} AIvolution. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-600 font-sans text-xs">All systems operational</span>
          </div>
        </div>

      </div>

    </footer>
  );
};