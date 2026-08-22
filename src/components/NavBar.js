import { useState, useEffect } from "react";
import logo from '../assets/img/new_logo_nobg.png';
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/events') setActiveLink('events');
    else if (location.hash === '#skills') setActiveLink('skills');
    else if (location.hash === '#connect') setActiveLink('connect');
    else setActiveLink('home');
  }, [location]);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
    setIsOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 flex justify-center px-4 md:px-8 pt-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-difference ${scrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"}`}>
      <nav className="w-full max-w-7xl flex items-center justify-between">
        
        {/* Logo Area */}
        <HashLink to="/#home" className="flex items-center group">
          <img 
            src={logo} 
            alt="Logo" 
            className="object-contain h-8 md:h-10 transition-all duration-500 ease-out group-hover:scale-105" 
          />
        </HashLink>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white/80 hover:text-white focus:outline-none transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu - Center Links */}
        <div className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/#home" active={activeLink === 'home'} onClick={() => onUpdateActiveLink('home')}>Home</NavLink>
          <NavLink to="/#skills" active={activeLink === 'skills'} onClick={() => onUpdateActiveLink('skills')}>Departments</NavLink>
          <NavLink to="/events" active={activeLink === 'events'} onClick={() => onUpdateActiveLink('events')}>Events</NavLink>
        </div>

        {/* Desktop Menu - Right Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4 mr-4">
             {/* SVG Icons for Instagram and LinkedIn */}
             <a href="https://www.instagram.com/ai.volutions_/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
             </a>
             <a href="https://www.linkedin.com/company/aivolutionaries/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
             </a>
          </div>

          <HashLink to="/#connect">
            <button className="relative overflow-hidden px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wide uppercase transition-transform hover:scale-105 active:scale-95 flex items-center justify-center group">
              <span className="relative z-10">Connect</span>
              {/* Subtle hover gradient inside the button */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </HashLink>
        </div>

      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-24 left-4 right-4 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 origin-top ${isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center py-8 space-y-6">
            <NavLink to="/#home" active={activeLink === 'home'} onClick={() => onUpdateActiveLink('home')}>Home</NavLink>
            <NavLink to="/#skills" active={activeLink === 'skills'} onClick={() => onUpdateActiveLink('skills')}>Departments</NavLink>
            <NavLink to="/events" active={activeLink === 'events'} onClick={() => onUpdateActiveLink('events')}>Events</NavLink>
            
            <div className="w-12 h-px bg-white/20 my-4"></div>
            
            <div className="flex space-x-8">
               <a href="https://www.instagram.com/ai.volutions_/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white text-sm font-medium tracking-wide uppercase transition-colors">Instagram</a>
               <a href="https://www.linkedin.com/company/aivolutionaries/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white text-sm font-medium tracking-wide uppercase transition-colors">LinkedIn</a>
            </div>

            <HashLink to="/#connect" onClick={() => setIsOpen(false)}>
              <button className="mt-4 px-10 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wide uppercase">
                Connect
              </button>
            </HashLink>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const NavLink = ({ to, active, onClick, children }) => (
  <HashLink 
    smooth 
    to={to} 
    className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${active ? "text-white" : "text-white/60 hover:text-white"}`}
    onClick={onClick}
  >
    {children}
    {/* Animated underline for active/hover state */}
    <span className={`absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full transition-all duration-300 -translate-x-1/2 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"}`}></span>
  </HashLink>
);