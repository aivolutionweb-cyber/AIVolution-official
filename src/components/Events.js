import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import 'animate.css';

export const Events = () => {
    const [activeTab, setActiveTab] = useState('first'); 
    const [expandedEvent, setExpandedEvent] = useState(null); 

    const events = [
        {
            title: "AI & Future Tech Summit",
            description: "Deep dive into the future of Artificial Intelligence and what it means for humanity.",
            imgUrl: "/assets/events/event1.svg", 
            id: "EVT_FUT"
        },
        {
            title: "Generative AI Hackathon",
            description: "Build the next generation of AI tools in this 48-hour coding challenge.",
            imgUrl: "/assets/events/event2.svg",
            id: "EVT_GEN"
        },
        {
            title: "Machine Learning Workshop",
            description: "A hands-on workshop to get you started with ML models and data processing.",
            imgUrl: "/assets/events/event3.svg",
            id: "EVT_MLW"
        },
    ];

    const webProjects = [
        { title: "Preparation Mantra", description: "Webinar", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg" },
        { title: "Orientation 2024", description: "Webinar", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg" },
        { title: "Enterprises Application Suite", description: "Webinar", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%203.jpeg" },
    ];

    const mobileProjects = [
        { title: "Algosphere", description: "Competition", imgUrl: "/assets/events/algosphere/img.png" },
        { title: "Codex Hackathon", description: "Hackathon", imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg" },
    ];

    const previousEvents = [
        {
            title: "Codex Hackathon 2025",
            description: "60+ teams competed at MAIT. Winners: RADICALS (1st), Digital Destroyers (2nd), and NexaGen (3rd).",
            imgUrl: "/assets/events/codex_thumbnail.jpg",
            id: "DIR_CODEX",
            gallery: [
               "/assets/events/codex/pic_1.jpg", "/assets/events/codex/pic-3.jpg", "/assets/events/codex/pic_4.jpg",
               "/assets/events/codex/pic_6.jpg", "/assets/events/codex/pic_17.jpg", "/assets/events/codex/pic_5.jpg",
               "/assets/events/codex/pic_13.jpg", "/assets/events/codex/pic_2.jpg", "/assets/events/codex/pic_12.jpg",
               "/assets/events/codex/pic_15.jpg", "/assets/events/codex/pic_14.jpg", "/assets/events/codex/pic_16.jpg",
               "/assets/events/codex/pic_18.jpg", "/assets/events/codex/pic_19.jpg", "/assets/events/codex/pic_20.jpg"
            ]
        },
        {
            title: "Algosphere",
            description: "Participants tackled real-world challenges over multiple rigorous rounds.",
            imgUrl: "/assets/events/algosphere/pic_1.jpg",
            id: "DIR_ALGO",
            gallery: [
                "/assets/events/algosphere/pic_1.jpg", "/assets/events/algosphere/pic_2.jfif",
                "/assets/events/algosphere/pic_3.jfif", "/assets/events/algosphere/pic_4.jfif",
            ]
        },
        {
            title: "Enterprises Application Suite",
            description: "An expert from STMicroelectronics came for sharing her deep knowledge about ERP software.",
            imgUrl: "/assets/events/webinar/pic-1.jfif",
            id: "DIR_ERP",
            gallery: [
                "/assets/events/webinar/pic-1.jfif", "/assets/events/webinar/pic-2.jfif",
                "/assets/events/webinar/pic-3.jfif", "/assets/events/webinar/pic-4.jfif",
                "/assets/events/webinar/pic-5.jfif",
            ]
        },
    ];

    const toggleGallery = (index) => {
        setExpandedEvent(expandedEvent === index ? null : index);
    };

    return (
        <section className="relative pt-24 pb-32 bg-dark" id="events">
            <div className="container mx-auto px-6 relative z-10">
                
                {/* UPCOMING EVENTS */}
                <div className="border-b border-gridline pb-4 mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// EVENT_SCHEDULER"}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
                        UPCOMING EVENTS
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gridline border border-gridline mb-32">
                    {events.map((event, index) => (
                        <div key={index} className="bg-dark p-8 flex flex-col group hover:bg-surface transition-colors duration-300">
                            <div className="flex justify-between items-center border-b border-gridline pb-4 mb-6">
                                <span className="font-mono text-primary text-xs tracking-widest">{event.id}</span>
                                <span className="w-2 h-2 bg-primary animate-pulse"></span>
                            </div>
                            <div className="h-16 mb-6 flex items-center justify-start opacity-70 group-hover:opacity-100 transition-opacity">
                                <img src={event.imgUrl} alt={event.title} className="h-full object-contain filter invert"/>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white uppercase mb-4">{event.title}</h3>
                            <p className="text-muted font-sans text-sm leading-relaxed mb-8 flex-grow">{event.description}</p>
                            <button className="w-full py-4 border border-white text-white font-mono text-xs uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                                INITIALIZE_REGISTRATION
                            </button>
                        </div>
                    ))}
                </div>


                {/* ACTIVITY ARCHIVE */}
                <div className="border-b border-gridline pb-4 mb-12">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// ARCHIVE_DATABASE"}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
                        ACTIVITY ARCHIVE
                    </h2>
                </div>

                {/* Tab Buttons */}
                <div className="flex mb-12 border-b border-gridline">
                    <button 
                        onClick={() => setActiveTab('first')} 
                        className={`px-8 py-4 font-mono text-sm tracking-widest uppercase transition-all border-b-2 ${activeTab === 'first' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-white'}`}
                    >
                        [ WEBINARS ]
                    </button>
                    <button 
                        onClick={() => setActiveTab('second')} 
                        className={`px-8 py-4 font-mono text-sm tracking-widest uppercase transition-all border-b-2 ${activeTab === 'second' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-white'}`}
                    >
                        [ COMPETITIONS ]
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 animate__animated animate__fadeIn">
                    {(activeTab === 'first' ? webProjects : mobileProjects).map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>


                {/* PHOTO GALLERY */}
                <div className="border-b border-gridline pb-4 mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// VISUAL_DATA"}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
                        EVENT GALLERY
                    </h2>
                </div>

                <div className="flex flex-col gap-16">
                    {previousEvents.map((event, index) => {
                        const isExpanded = expandedEvent === index;
                        return (
                            <div key={index} className="border border-gridline bg-surface/30">
                                <div 
                                    className="relative h-[300px] md:h-[400px] cursor-pointer group overflow-hidden"
                                    onClick={() => toggleGallery(index)}
                                >
                                    <img src={event.imgUrl} alt="Event Cover" className="w-full h-full object-cover filter grayscale opacity-40 group-hover:opacity-60 transition-all duration-700" />
                                    
                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="font-mono text-xs tracking-widest bg-dark border border-gridline px-3 py-1 text-muted group-hover:text-primary transition-colors">
                                                {event.id}
                                            </span>
                                            <span className="font-mono text-xs tracking-widest text-white border border-white px-3 py-1 bg-black/50 backdrop-blur-sm group-hover:bg-primary group-hover:border-primary transition-colors">
                                                {isExpanded ? "CLOSE_DIR" : "OPEN_DIR"}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight mb-4 drop-shadow-md">{event.title}</h3>
                                            <p className="text-gray-300 font-sans max-w-2xl text-sm md:text-base border-l-2 border-primary pl-4 bg-dark/50 p-2 backdrop-blur-sm">{event.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && event.gallery && (
                                    <div className="p-6 border-t border-gridline bg-dark">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate__animated animate__fadeIn">
                                            {event.gallery.map((img, idx) => (
                                                <div key={idx} className="aspect-square border border-gridline bg-surface overflow-hidden group/img relative">
                                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover filter grayscale group-hover/img:grayscale-0 transition-all duration-500" />
                                                    <div className="absolute top-2 left-2 font-mono text-[9px] text-white mix-blend-difference">IMG_{idx.toString().padStart(3, '0')}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}