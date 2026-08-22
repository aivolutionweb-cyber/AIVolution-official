import React from 'react';
import CountUp from 'react-countup';
import TrackVisibility from 'react-on-screen';

export const Stats = () => {
    const stats = [
        { label: "ACTIVE_MEMBERS", value: 350, prefix: ">", suffix: "+" },
        { label: "LINES_OF_CODE", value: 150, prefix: "", suffix: "K+" },
        { label: "MODELS_TRAINED", value: 45, prefix: "", suffix: "" },
        { label: "EVENTS_HOSTED", value: 24, prefix: "", suffix: "" },
    ];

    return (
        <section className="py-24 bg-dark border-b border-gridline relative z-10">
            <div className="container mx-auto px-6">
                
                <div className="border-b border-gridline pb-4 mb-16">
                    <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
                        // TELEMETRY_DATA
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">
                        SYSTEM IMPACT
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gridline border border-gridline">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-dark p-8 md:p-12 flex flex-col items-center justify-center text-center group hover:bg-surface transition-colors duration-300">
                            <TrackVisibility once offset={100}>
                                {({ isVisible }) => (
                                    <div className="font-mono text-4xl md:text-6xl text-white font-bold mb-4 group-hover:text-primary transition-colors">
                                        <span className="text-primary/50 text-3xl md:text-5xl mr-1">{stat.prefix}</span>
                                        {isVisible ? <CountUp end={stat.value} duration={3} /> : "0"}
                                        <span className="text-primary/50 text-3xl md:text-5xl ml-1">{stat.suffix}</span>
                                    </div>
                                )}
                            </TrackVisibility>
                            <div className="font-mono text-xs md:text-sm text-muted tracking-widest uppercase border-t border-gridline pt-4 w-full group-hover:border-primary/50 transition-colors">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
