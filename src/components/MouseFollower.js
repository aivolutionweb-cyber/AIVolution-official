import React, { useState, useEffect, useRef } from 'react';

const MouseFollower = () => {
  const dotRef = useRef(null);
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
    const dot = dotRef.current;
    if (!dot) return;

    // Drive the dot straight through the DOM: mousemove fires 60–120×/s and
    // routing it through React state re-rendered this component (and forced
    // layout via left/top) on every single event. A composited transform
    // costs nothing by comparison.
    let visible = false;
    const handleMouseMove = (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
      }
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => { visible = false; dot.style.opacity = '0'; };
    const handleMouseEnter = () => { visible = true; dot.style.opacity = '1'; };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-opacity duration-300 ease-in-out opacity-0"
      style={{
        // Using a simple, subtle white dot with a very thin border
        width: '8px',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 1)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        willChange: 'transform',
      }}
    />
  );
};

export default MouseFollower;
