import React from 'react';

export const Vision = () => {
    return (
        <section className="py-24 bg-dark relative border-b border-gridline">
            <div className="container mx-auto px-6">
                
                <div className="border-b border-gridline pb-4 mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        {"// CORE_DIRECTIVES"}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
                        OPERATIONAL MANDATES
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gridline border border-gridline">
                    
                    {/* Card 1 */}
                    <div className="p-10 bg-dark hover:bg-surface transition-colors duration-300 flex flex-col group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="flex justify-between items-start mb-12">
                            <span className="font-mono text-primary text-xs tracking-widest border border-primary/30 bg-primary/10 px-2 py-1">
                                M_01
                            </span>
                            <div className="font-mono text-4xl text-muted opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
                                01
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">MISSION</h3>
                        <p className="text-muted font-sans text-sm leading-relaxed border-l-2 border-gridline pl-4 group-hover:border-primary transition-colors">
                            To democratize AI education and provide every student at MAIT the resources to build futuristic tech.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-10 bg-dark hover:bg-surface transition-colors duration-300 flex flex-col group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="flex justify-between items-start mb-12">
                            <span className="font-mono text-primary text-xs tracking-widest border border-primary/30 bg-primary/10 px-2 py-1">
                                V_02
                            </span>
                            <div className="font-mono text-4xl text-muted opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
                                02
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VISION</h3>
                        <p className="text-muted font-sans text-sm leading-relaxed border-l-2 border-gridline pl-4 group-hover:border-primary transition-colors">
                            To become North India's leading student-run AI community, fostering innovation and open-source contributions.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-10 bg-dark hover:bg-surface transition-colors duration-300 flex flex-col group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="flex justify-between items-start mb-12">
                            <span className="font-mono text-primary text-xs tracking-widest border border-primary/30 bg-primary/10 px-2 py-1">
                                P_03
                            </span>
                            <div className="font-mono text-4xl text-muted opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
                                03
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-4 uppercase text-white">VALUES</h3>
                        <p className="text-muted font-sans text-sm leading-relaxed border-l-2 border-gridline pl-4 group-hover:border-primary transition-colors">
                            Collaboration over competition. Practical learning over rote memorization. Community above all.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};