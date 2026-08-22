import EM from "../assets/icons/Event.png";
import Tech from "../assets/icons/tech.png";
import SM from "../assets/icons/social-media.png";
import photo from "../assets/icons/photo.png";
import content from "../assets/icons/Content.png";
import pr from "../assets/icons/pr.png";

export const Skills = () => {
  const departments = [
    { title: "Tech & Dev", icon: Tech, id: "MOD_01" },
    { title: "Social Media", icon: SM, id: "MOD_02" },
    { title: "Photo & Video", icon: photo, id: "MOD_03" },
    { title: "Event Mgmt", icon: EM, id: "MOD_04" },
    { title: "Design & Creative", icon: content, id: "MOD_05" },
    { title: "Public Relations", icon: pr, id: "MOD_06" },
  ];

  return (
    <section className="relative py-24 bg-dark border-b border-gridline" id="skills">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="border-b border-gridline pb-4 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
              // CORE_SYSTEMS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
              DEPARTMENTS
            </h2>
          </div>
          <p className="text-muted font-sans text-sm md:text-base max-w-md border-l-2 border-primary pl-4">
            AIvolution's operational modules focusing on research, development, and strategic execution.
          </p>
        </div>

        {/* System Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gridline border border-gridline">
          {departments.map((dept, index) => (
            <div 
              key={index} 
              className="group relative bg-dark p-8 hover:bg-surface transition-colors duration-300 flex flex-col justify-between min-h-[280px]"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-primary text-xs tracking-widest bg-primary/10 px-2 py-1 border border-primary/20">
                  {dept.id}
                </span>
                {/* Crosshair decoration */}
                <div className="text-gridline text-xs opacity-50 font-mono">+</div>
              </div>
              
              {/* Icon Container */}
              <div className="mb-6 flex items-center justify-start h-16">
                <img 
                  src={dept.icon} 
                  alt={dept.title} 
                  className="h-full w-auto object-contain filter grayscale group-hover:grayscale-0 group-hover:contrast-150 transition-all duration-300"
                />
              </div>
              
              {/* Title & Status */}
              <div className="border-t border-gridline/50 pt-4 group-hover:border-primary/50 transition-colors">
                <h5 className="text-xl font-display font-bold text-white tracking-wide mb-1 uppercase">
                  {dept.title}
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500"></div>
                  <span className="font-mono text-[10px] text-muted tracking-widest uppercase">Operational</span>
                </div>
              </div>

              {/* Hover Frame Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary pointer-events-none transition-colors duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};