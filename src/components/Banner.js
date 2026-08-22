// import { useState, useEffect, useCallback } from "react";
// import headerImg from "../assets/img/cropped_circle_image.png";
// import { ArrowRightCircle } from 'react-bootstrap-icons';
// import 'animate.css';
// import TrackVisibility from 'react-on-screen';

// export const Banner = () => {
//   const [loopNum, setLoopNum] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [text, setText] = useState('');
//   const [delta, setDelta] = useState(300 - Math.random() * 100);
//   // REMOVED: unused 'index' state to fix compiler warning
//   const toRotate = [ "Society", "Community", "Family" ];
//   const period = 2000;

//   // Wrapped tick in useCallback to fix 'missing dependencies' warning
//   const tick = useCallback(() => {
//     let i = loopNum % toRotate.length;
//     let fullText = toRotate[i];
//     let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

//     setText(updatedText);

//     if (isDeleting) {
//       setDelta(prevDelta => prevDelta / 2);
//     }

//     if (!isDeleting && updatedText === fullText) {
//       setIsDeleting(true);
//       setDelta(period);
//     } else if (isDeleting && updatedText === '') {
//       setIsDeleting(false);
//       setLoopNum(loopNum + 1);
//       setDelta(500);
//     }
//   }, [isDeleting, loopNum, text.length, toRotate, period]);

//   useEffect(() => {
//     let ticker = setInterval(() => {
//       tick();
//     }, delta);

//     return () => { clearInterval(ticker) };
//   }, [text, delta, tick]); // Included missing dependencies

//   return (
//     <section className="relative min-h-screen flex items-center py-20 lg:py-32 overflow-hidden" id="home">
      
//       {/* Background Gradient Spotlights */}
//       <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>
//       <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
//           {/* Text Content - Increased width slightly and added padding */}
//           <div className="w-full md:w-6/12 lg:w-7/12 order-2 md:order-1 text-left">
//             <TrackVisibility>
//               {({ isVisible }) =>
//               <div className={isVisible ? "animate__animated animate__fadeIn" : "opacity-0"}>
                
//                 <span className="inline-block px-4 py-2 mb-6 border border-secondary/50 bg-secondary/10 text-secondary font-bold font-mono tracking-widest text-xs md:text-sm uppercase backdrop-blur-sm">
//                   Innovating the Future
//                 </span>
                
//                 <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//                   {`We are `} 
//                   <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2 min-h-[1.2em]">
//                     {text}
//                     <span className="border-r-4 border-white ml-1 animate-pulse"></span>
//                   </span>
//                 </h1>
                
//                 <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl border-l-4 border-primary/50 pl-6 bg-black/10 backdrop-blur-[2px] py-4 rounded-r-xl">
//                   The official Artificial Intelligence Society of MAIT, Delhi. We are a vibrant community of curious, creative, and ambitious minds.
//                 </p>
                
//                 <a 
//                   href="https://chat.whatsapp.com/IAwNmxi4lyG8z52Zh3QTbU?mode=ems_copy_t" 
//                   target="_blank" 
//                   rel="noopener noreferrer" 
//                   className="inline-flex items-center group gap-3 text-lg md:text-xl font-bold text-white transition-all duration-300"
//                 >
//                   <span className="border-b-2 border-transparent group-hover:border-primary group-hover:text-primary transition-all pb-1">Join the Revolution</span> 
//                   <ArrowRightCircle size={25} className="group-hover:translate-x-2 group-hover:text-primary transition-all duration-300" />
//                 </a>
//               </div>}
//             </TrackVisibility>
//           </div>

//           {/* Hero Image - Constrained more strictly to prevent overlap */}
//           <div className="w-full md:w-5/12 lg:w-4/12 flex justify-center order-1 md:order-2">
//             <TrackVisibility>
//               {({ isVisible }) =>
//                 <div className={isVisible ? "animate__animated animate__zoomIn" : "opacity-0"}>
//                   <div className="animate-[float_6s_ease-in-out_infinite] w-full flex justify-center">
//                     <img 
//                       src={headerImg} 
//                       alt="AIvolution Logo" 
//                       className="w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[420px] h-auto object-contain drop-shadow-[0_0_30px_rgba(163,27,246,0.3)] filter contrast-110"
//                     />
//                   </div>
//                 </div>}
//             </TrackVisibility>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

import { useState, useEffect, useCallback } from "react";
import headerImg from "../assets/img/new_logo_nobg.png";
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
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none border-x border-gridline container mx-auto px-6">
        <div className="w-full h-full border-x border-gridline opacity-50 flex justify-between">
          <div className="h-full border-r border-gridline w-1/3"></div>
          <div className="h-full border-r border-gridline w-1/3"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center">
        
        {/* Terminal Header */}
        <div className="w-full border-b border-gridline pb-4 mb-12 flex justify-between items-end animate__animated animate__fadeInDown">
          <span className="font-mono text-muted text-xs tracking-[0.3em] uppercase">
            SYS.INIT // MAIT.DELHI // AIVOLUTION_CORE_V2.0
          </span>
          <span className="font-mono text-primary text-xs tracking-widest bg-primary/10 px-2 py-1 border border-primary/20">
            STATUS: ONLINE
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="w-full lg:w-7/12 animate__animated animate__fadeInLeft">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white mb-6 uppercase tracking-tight leading-none">
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
              <a href="https://chat.whatsapp.com/IAwNmxi4lyG8z52Zh3QTbU" target="_blank" rel="noopener noreferrer" 
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