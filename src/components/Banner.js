import { useState, useEffect, useCallback } from "react";
import headerImg from "../assets/img/new_logo.jpg";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';

const toRotate = [ "SOCIETY", "RESEARCH LAB", "INNOVATION HUB", "DEVELOPMENT FORCE" ];

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(250 - Math.random() * 100);
  const period = 1500;

  const tick = useCallback(() => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(400);
    }
  }, [isDeleting, loopNum, text]);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);
    return () => clearInterval(ticker);
  }, [delta, tick]);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-grid" id="home">
      
      <div className="absolute inset-0 z-0 pointer-events-none border-x border-gridline container mx-auto px-6">
        <div className="w-full h-full border-x border-gridline opacity-50 flex justify-between">
          <div className="h-full border-r border-gridline w-1/3"></div>
          <div className="h-full border-r border-gridline w-1/3"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center">
        
        {/* Terminal Header */}
        <div className="w-full border-b border-gridline pb-4 mb-8 sm:mb-12 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-end animate__animated animate__fadeInDown">
          <span className="font-mono text-muted text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase break-words">
            SYS.INIT // MAIT.DELHI // AIVOLUTION_CORE_V2.0
          </span>
          <span className="font-mono text-primary text-xs tracking-widest bg-primary/10 px-2 py-1 border border-primary/20 self-start sm:self-auto">
            STATUS: ONLINE
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="w-full lg:w-7/12 animate__animated animate__fadeInLeft">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white mb-6 uppercase tracking-tight leading-[1.02] break-words">
              WE ARE A <br/>
              <span className="text-primary block mt-2">
                {text}<span className="border-r-[6px] border-white ml-2 animate-pulse"></span>
              </span>
            </h1>
            
            <div className="border-l-4 border-primary pl-6 py-2 mt-8 mb-12 max-w-2xl bg-surface/50 backdrop-blur-sm border border-gridline p-6 shadow-2xl">
              <p className="text-muted font-sans text-lg md:text-xl leading-relaxed mb-4">
                The premier <strong className="text-white font-mono font-normal bg-white/5 px-1">Artificial Intelligence Society</strong> of Maharaja Agrasen Institute of Technology. 
              </p>
              <p className="text-muted font-sans text-base leading-relaxed">
                Beyond just a club, we are an accelerator for student-led innovation. We build complex neural architectures, deploy enterprise-grade applications, and train the next generation of engineers to solve real-world problems through data and machine learning.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="https://whatsapp.com/channel/0029Vb9S7lj8F2pN7ghfV00Q" target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center group gap-4 font-mono text-sm tracking-widest uppercase bg-white text-black px-8 py-4 border border-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <span className="font-bold">INITIALIZE_MEMBERSHIP</span> 
                <ArrowRightCircle size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </a>
              <a href="#projects" 
                className="inline-flex items-center group gap-4 font-mono text-sm tracking-widest uppercase bg-dark text-white px-8 py-4 border border-gridline hover:border-primary transition-all duration-300">
                <span className="font-bold">VIEW_PROJECTS</span> 
              </a>
            </div>
          </div>

          <div className="w-full lg:w-5/12 animate__animated animate__fadeInRight flex justify-center lg:justify-end">
            <div className="relative p-4 border border-gridline bg-surface/30 backdrop-blur-md w-full max-w-[400px]">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1"></div>
              
              <div className="w-full aspect-square border border-gridline/50 overflow-hidden flex items-center justify-center bg-dark">
                <img src={headerImg} alt="Logo" className="w-[80%] h-auto drop-shadow-[0_0_40px_rgba(255,59,0,0.3)] filter contrast-125 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="mt-4 flex justify-between font-mono text-[10px] text-muted tracking-widest uppercase">
                <span>OBJ_01: AI_CORE_NODE</span>
                <span>RENDER_ENGINE: ACTIVE</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};