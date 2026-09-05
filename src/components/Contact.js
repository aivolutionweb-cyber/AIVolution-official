import { useState } from "react";
import contactImg from "../assets/img/contact-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('TRANSMIT_DATA');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("TRANSMITTING...");
    
    try {
        let response = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(formDetails),
        });
        let result = await response.json();
        setFormDetails(formInitialDetails);
        if (result.code === 200) {
            setStatus({ success: true, message: 'DATA_TRANSMITTED_SUCCESSFULLY'});
        } else {
            setStatus({ success: false, message: 'TRANSMISSION_FAILED. RETRY.'});
        }
    } catch (error) {
        setStatus({ success: false, message: 'NETWORK_ERR. RETRY.'});
    } finally {
        setButtonText("TRANSMIT_DATA");
    }
  };

  return (
    <section className="relative py-24 bg-dark border-b border-gridline" id="connect">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="border-b border-gridline pb-4 mb-16">
          <span className="font-mono text-muted text-xs tracking-widest uppercase mb-2 block">
            {"// SECURE_COMMS"}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tight">
            ESTABLISH CONNECTION
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-0 border border-gridline bg-gridline">
          
          {/* Left Side: Image / Decoration */}
          <div className="w-full md:w-1/2 bg-surface p-12 flex items-center justify-center relative overflow-hidden group">
            <TrackVisibility once partialVisibility offset={200}>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : "opacity-0"}>
                   <img 
                    src={contactImg} 
                    alt="Contact Us" 
                    className="w-[80%] mx-auto filter grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                   />
                </div>
              }
            </TrackVisibility>
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>

          {/* Right Side: Terminal Form */}
          <div className="w-full md:w-1/2 bg-dark p-8 md:p-12 flex flex-col justify-center relative">
            
            {/* Blinking Cursor Decoration */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted tracking-widest">STATUS: ONLINE</span>
              <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            </div>

            <TrackVisibility once partialVisibility offset={200}>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : "opacity-0"}>
                  <p className="font-mono text-primary text-xs tracking-widest mb-8 border-l-2 border-primary pl-4">
                    Please input required data points to initiate communication sequence.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div className="relative group/input">
                        <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block group-focus-within/input:text-primary transition-colors">
                          <span className="text-primary mr-1">&gt;</span> FIRST_NAME
                        </label>
                        <input 
                          type="text" 
                          value={formDetails.firstName} 
                          onChange={(e) => onFormUpdate('firstName', e.target.value)} 
                          className="w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300"
                          required 
                        />
                      </div>

                      <div className="relative group/input">
                        <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block group-focus-within/input:text-primary transition-colors">
                          <span className="text-primary mr-1">&gt;</span> LAST_NAME
                        </label>
                        <input 
                          type="text" 
                          value={formDetails.lastName} 
                          onChange={(e) => onFormUpdate('lastName', e.target.value)} 
                          className="w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="relative group/input">
                        <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block group-focus-within/input:text-primary transition-colors">
                          <span className="text-primary mr-1">&gt;</span> EMAIL_ADDR
                        </label>
                        <input 
                          type="email" 
                          value={formDetails.email} 
                          onChange={(e) => onFormUpdate('email', e.target.value)} 
                          className="w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300"
                          required 
                        />
                      </div>

                      <div className="relative group/input">
                        <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block group-focus-within/input:text-primary transition-colors">
                          <span className="text-primary mr-1">&gt;</span> PHONE_NUM (OPTIONAL)
                        </label>
                        <input 
                          type="tel" 
                          value={formDetails.phone} 
                          onChange={(e) => onFormUpdate('phone', e.target.value)}
                          className="w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="relative group/input mt-8">
                      <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-1 block group-focus-within/input:text-primary transition-colors">
                        <span className="text-primary mr-1">&gt;</span> MESSAGE_PAYLOAD
                      </label>
                      <textarea 
                        rows="4" 
                        value={formDetails.message} 
                        onChange={(e) => onFormUpdate('message', e.target.value)} 
                        className="w-full bg-surface border-b-2 border-gridline px-0 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all duration-300 resize-none"
                        required
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 mt-8 border border-white text-white font-mono text-sm tracking-widest uppercase hover:bg-primary hover:border-primary transition-all duration-300 group"
                    >
                      <span className="group-hover:hidden">[{buttonText}]</span>
                      <span className="hidden group-hover:inline">{'>> '}{buttonText}{' <<'}</span>
                    </button>

                    {status.message && (
                      <div className={`mt-6 p-4 border font-mono text-xs uppercase tracking-widest ${status.success ? "bg-green-500/10 border-green-500 text-green-400" : "bg-red-500/10 border-red-500 text-red-400"}`}>
                        <span className="mr-2">{status.success ? "[OK]" : "[ERR]"}</span>
                        {status.message}
                      </div>
                    )}
                  </form>
                </div>
              }
            </TrackVisibility>
          </div>
        </div>
      </div>
    </section>
  )
}