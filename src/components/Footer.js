import logo from "../assets/img/new_logo_nobg.png";
import navIcon1 from "../assets/img/nav-icon1.svg"; // LinkedIn
import navIcon3 from "../assets/img/nav-icon3.svg"; // Instagram

export const Footer = () => {
  return (
    <footer className="bg-dark border-t border-gridline pt-20 pb-8">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gridline pt-12 pb-12">
          
          <div className="col-span-1 md:col-span-1">
            <img 
              src={logo} 
              alt="AIvolution Logo" 
              className="h-12 w-auto object-contain mb-6 opacity-80 hover:opacity-100 transition-opacity" 
            />
            <p className="text-muted font-sans text-sm leading-relaxed max-w-sm">
              AIvolution is the official Artificial Intelligence Society of Maharaja Agrasen Institute of Technology. We build, research, and deploy modern AI solutions while fostering a community of elite engineers.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-6 border-l-2 border-primary pl-3">
              SYSTEM_LINKS
            </h4>
            <ul className="space-y-3 font-mono text-xs tracking-widest text-muted">
              <li><a href="#projects" className="hover:text-primary transition-colors">>> PROJECT_DIRECTORY</a></li>
              <li><a href="#team" className="hover:text-primary transition-colors">>> PERSONNEL_ROSTER</a></li>
              <li><a href="#events" className="hover:text-primary transition-colors">>> EVENT_LOGS</a></li>
              <li><a href="#skills" className="hover:text-primary transition-colors">>> CORE_SYSTEMS</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:text-right flex flex-col md:items-end">
            <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-6 border-r-2 border-primary pr-3 hidden md:block">
              COMMUNICATION_CHANNELS
            </h4>
            <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-6 border-l-2 border-primary pl-3 md:hidden">
              COMMUNICATION_CHANNELS
            </h4>
            <div className="flex gap-4 mb-8">
              <SocialIcon href="https://www.linkedin.com/company/aivolutionaries/" icon={navIcon1} />
              <SocialIcon href="https://www.instagram.com/ai.volutions_/" icon={navIcon3} />
            </div>
            <p className="font-mono text-muted text-[10px] tracking-widest uppercase">
              MAHARAJA AGRASEN INSTITUTE OF TECHNOLOGY <br/>
              SECTOR 22, ROHINI, DELHI - 110086
            </p>
          </div>

        </div>

        <div className="border-t border-gridline pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted font-mono text-[10px] tracking-widest uppercase">
              COPYRIGHT © 2025 AIVOLUTION. ALL RIGHTS RESERVED.
            </p>
            <p className="text-primary font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse inline-block"></span>
              ALL SYSTEMS OPERATIONAL
            </p>
        </div>
      </div>
    </footer>
  )
}

// Reusable Social Icon Component
const SocialIcon = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-12 h-12 flex items-center justify-center border border-gridline transition-all duration-300 hover:bg-primary hover:border-primary group bg-surface"
  >
    <img 
      src={icon} 
      alt="" 
      className="w-5 h-5 filter grayscale brightness-200 group-hover:brightness-100 group-hover:filter-none group-hover:invert transition-all" 
    />
  </a>
);