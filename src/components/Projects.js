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
    <section className="relative py-16 sm:py-20 md:py-24 bg-dark text-white" id="projects">
      <div className="container mx-auto px-5 sm:px-4">
        <div className="text-center mb-10 sm:mb-16 animate__animated animate__fadeIn">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">Events</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2">Explore AIvolution's AI-focused events and initiatives!</p>
        </div>

        <div className="flex justify-center mb-10 sm:mb-12 px-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-full p-1 flex flex-col sm:flex-row w-full sm:w-auto backdrop-blur-md gap-1 sm:gap-0">
            <button onClick={() => setActiveTab('first')} className={`px-6 sm:px-8 py-3 rounded-xl sm:rounded-full font-bold text-sm sm:text-base transition-all min-h-[48px] ${activeTab === 'first' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400'}`}>
              📺 Webinars
            </button>
            <button onClick={() => setActiveTab('second')} className={`px-6 sm:px-8 py-3 rounded-xl sm:rounded-full font-bold text-sm sm:text-base transition-all min-h-[48px] ${activeTab === 'second' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400'}`}>
              🏆 Competitions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate__animated animate__fadeInUp">
          {(activeTab === 'first' ? webProjects : mobileProjects).map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};