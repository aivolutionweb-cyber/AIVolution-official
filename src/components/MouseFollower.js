import React, { useState, useEffect } from 'react';

const MouseFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only show the custom dot on devices with a real mouse/trackpad.
    // On touch phones/tablets there is no hover cursor to follow.
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mq.matches);
    const onChange = (e) => setIsFinePointer(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      className={`pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      style={{
        left: position.x,
        top: position.y,
        // Using a simple, subtle white dot with a very thin border
        width: '8px',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 1)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
      }}
    />
  );
};

export default MouseFollower;