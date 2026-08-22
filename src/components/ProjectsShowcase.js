import React from 'react';

export const ProjectsShowcase = () => {
    const projects = [
        {
            id: "PRJ_001",
            title: "NEURAL_NET_VISUALIZER",
            description: "A real-time web interface for visualizing backpropagation in custom neural network architectures. Built for educational demonstrations.",
            stack: ["React", "D3.js", "TensorFlow.js"],
            repoLink: "#",
            status: "DEPLOYED"
        },
        {
            id: "PRJ_002",
            title: "MAIT_BOT_V2",
            description: "An NLP-powered discord bot designed to answer student queries, fetch syllabus data, and notify about upcoming exams.",
            stack: ["Python", "Discord.py", "OpenAI API"],
            repoLink: "#",
            status: "MAINTENANCE"
        },
        {
            id: "PRJ_003",
            title: "DATA_SYNTHESIZER",
            description: "A command-line tool to generate high-quality tabular mock data for machine learning testing using generative adversarial networks.",
            stack: ["PyTorch", "Pandas", "CLI"],
            repoLink: "#",
            status: "IN_DEV"
        }
    ];

    return (
        <section className="py-24 bg-dark relative border-b border-gridline" id="projects">
            <div className="container mx-auto px-6">
                
                <div className="border-b border-gridline pb-4 mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        // R&D_DIVISION
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
                        PROJECT DIRECTORY
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gridline border border-gridline">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-dark p-8 flex flex-col group hover:bg-surface transition-colors duration-300">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-xs tracking-widest bg-dark border border-gridline px-2 py-1 text-muted group-hover:text-primary transition-colors">
                                    {project.id}
                                </span>
                                <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border ${project.status === 'DEPLOYED' ? 'border-green-500/50 text-green-500' : project.status === 'IN_DEV' ? 'border-yellow-500/50 text-yellow-500' : 'border-red-500/50 text-red-500'}`}>
                                    [{project.status}]
                                </span>
                            </div>

                            {/* Title & Desc */}
                            <h3 className="text-2xl font-display font-bold text-white uppercase mb-4 tracking-tight">
                                {project.title}
                            </h3>
                            <p className="text-muted font-sans text-sm leading-relaxed flex-grow mb-8 border-l-2 border-gridline pl-4 group-hover:border-primary transition-colors">
                                {project.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.stack.map((tech, i) => (
                                    <span key={i} className="font-mono text-[10px] text-muted tracking-widest uppercase border border-gridline px-2 py-1 bg-surface/50 group-hover:border-primary/30 transition-colors">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Action */}
                            <a href={project.repoLink} className="w-full text-center py-4 border border-gridline text-white font-mono text-xs tracking-widest uppercase hover:bg-primary hover:border-primary transition-all duration-300 block">
                                ACCESS_REPOSITORY
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
