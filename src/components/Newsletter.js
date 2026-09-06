import { useState, useEffect } from "react";

export const Newsletter = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (status === "success") clearFields();
  }, [status]);

  // Fixes the 'unused-vars' warning by ensuring logic is applied correctly
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.indexOf("@") > -1) {
      onValidated({
        EMAIL: email,
      });
    }
  };

  const clearFields = () => {
    setEmail("");
  };

  return (
    <div className="w-full">
  
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[40px] md:rounded-[60px] p-8 md:p-16 shadow-2xl relative z-10 -mt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
    
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-bold font-mono leading-tight">
              Join Our WhatsApp Group & Access All Our Resources
            </h3>
            
    
            <div className="mt-4 min-h-[1.5rem]">
              {status === "sending" && (
                <p className="text-blue-400 font-mono text-sm animate-pulse">Sending...</p>
              )}
              {status === "error" && (
                <p className="text-red-400 font-mono text-sm">{message}</p>
              )}
              {status === "success" && (
                <p className="text-green-400 font-mono text-sm">{message}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">

              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-all"
              />
              
        
              <div className="relative group">
                <a 
                  href="https://whatsapp.com/channel/0029Vb9S7lj8F2pN7ghfV00Q?mode=ems_copy_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button 
                    type="submit"
                    className="w-full whitespace-nowrap bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(163,27,246,0.5)] transition-all duration-300 transform hover:scale-105"
                  >
                    Get Access!
                  </button>
                </a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};