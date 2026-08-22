// import { useState } from "react";
// import { ProjectCard } from "./ProjectCard";
// import colorSharp2 from "../assets/img/color-sharp2.png";
// import 'animate.css';
// import TrackVisibility from 'react-on-screen';

// export const Projects = () => {
//   const [activeTab, setActiveTab] = useState('first');

//   const webProjects = [
//     {
//       title: "Preparation Mantra",
//       description: "Webinar Event",
//       imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg?updatedAt=1758033819638",
//     },
//     {
//       title: "Orientation 2024",
//       description: "Webinar Event",
//       imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg?updatedAt=1758033819547",
//     },
//     {
//       title: "Enterprises Application Suite",
//       description: "Webinar Event",
//       imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%203.jpeg?updatedAt=1758033819463",
//     },
//   ];

//   const mobileProjects = [
//     {
//       title: "Codex Hackathon",
//       description: "Competition Event",
//       imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg?updatedAt=1758033819552",
//     },
//   ];

//   return (
//     <section className="relative py-24 bg-dark text-white overflow-hidden" id="projects">
//       <div className="container mx-auto px-4 relative z-10">
//         <TrackVisibility partialVisibility once offset={100}>
//           {({ isVisible }) => (
//             <div className={isVisible ? "animate__animated animate__fadeIn" : "opacity-0"}>
              
//               {/* Header Section */}
//               <div className="text-center mb-16">
//                 <h2 className="text-5xl md:text-6xl font-bold font-mono mb-4 text-white">Events</h2>
//                 <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto border-l-4 border-primary/50 pl-4 bg-white/5 py-2 inline-block">
//                   Explore AIvolution's AI-focused events and initiatives!
//                 </p>
//               </div>

//               {/* Professional Tab Switcher */}
//               <div className="flex justify-center mb-12">
//                 <div className="bg-white/5 border border-white/10 rounded-full p-1 flex relative overflow-hidden backdrop-blur-md shadow-inner">
                  
//                   <button
//                     onClick={() => setActiveTab('first')}
//                     className={`relative z-10 px-6 md:px-10 py-3 rounded-full text-base md:text-lg font-bold transition-all duration-300 flex items-center gap-2 ${
//                       activeTab === 'first' 
//                         ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl scale-105' 
//                         : 'text-gray-400 hover:text-white hover:bg-white/5'
//                     }`}
//                   >
//                     <span>📺</span> Webinars
//                   </button>

//                   <button
//                     onClick={() => setActiveTab('second')}
//                     className={`relative z-10 px-6 md:px-10 py-3 rounded-full text-base md:text-lg font-bold transition-all duration-300 flex items-center gap-2 ${
//                       activeTab === 'second' 
//                         ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl scale-105' 
//                         : 'text-gray-400 hover:text-white hover:bg-white/5'
//                     }`}
//                   >
//                     <span>🏆</span> Competitions
//                   </button>
//                 </div>
//               </div>

//               {/* Event Cards Grid */}
//               <div className="min-h-[400px]">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 animate__animated animate__fadeInUp">
//                   {activeTab === 'first' 
//                     ? webProjects.map((project, index) => <ProjectCard key={index} {...project} />)
//                     : mobileProjects.map((project, index) => <ProjectCard key={index} {...project} />)
//                   }
//                 </div>
//               </div>
            
//             </div>
//           )}
//         </TrackVisibility>
//       </div>

//       {/* Background Glow Decor */}
//       <img 
//         className="absolute right-0 top-[10%] w-[40%] opacity-20 pointer-events-none mix-blend-screen -z-10 blur-2xl" 
//         src={colorSharp2} 
//         alt="" 
//       />
//     </section>
//   );
// };



import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const [activeTab, setActiveTab] = useState('first');

  const webProjects = [
    { title: "Preparation Mantra", description: "Webinar Event", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg" },
    { title: "Orientation 2024", description: "Webinar Event", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg" },
    { title: "Enterprises Application Suite", description: "Webinar Event", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%203.jpeg" },
  ];

  const mobileProjects = [
    { title: "Codex Hackathon", description: "Competition Event", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg" },
  ];

  return (
    <section className="relative py-24 bg-dark text-white" id="projects">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-5xl font-bold font-mono mb-4">Events</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore AIvolution's AI-focused events and initiatives!</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white/5 border border-white/10 rounded-full p-1 flex backdrop-blur-md">
            <button onClick={() => setActiveTab('first')} className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'first' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400'}`}>
              📺 Webinars
            </button>
            <button onClick={() => setActiveTab('second')} className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'second' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400'}`}>
              🏆 Competitions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate__animated animate__fadeInUp">
          {(activeTab === 'first' ? webProjects : mobileProjects).map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};