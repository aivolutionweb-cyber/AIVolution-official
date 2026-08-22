import React from 'react';

export const ProjectCard = ({ title, description, imgUrl }) => {
  return (
    <div className="relative group overflow-hidden cursor-pointer border border-gridline bg-dark flex flex-col h-full hover:border-primary transition-colors duration-300">
      
      {/* Image Container */}
      <div className="w-full aspect-[4/3] bg-surface relative overflow-hidden border-b border-gridline">
        <img 
          src={imgUrl} 
          alt={title} 
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Decorative corner crosshairs */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white opacity-50"></div>
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white opacity-50"></div>
      </div>
    
      {/* Data Container */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-dark group-hover:bg-surface/50 transition-colors duration-300">
        <div>
          <span className="inline-block font-mono text-[10px] tracking-widest text-primary border border-primary/30 bg-primary/10 px-2 py-1 mb-4 uppercase">
            {description}
          </span>
          <h4 className="text-lg md:text-xl font-display font-bold text-white uppercase leading-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h4>
        </div>
      </div>
    </div>
  )
}