import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Hide cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // QuickTo setters for ultra-smooth 60fps tracking
    const xDotSet = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const yDotSet = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });

    const xRingSet = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yRingSet = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      xDotSet(clientX);
      yDotSet(clientY);
      xRingSet(clientX);
      yRingSet(clientY);
    };

    // Hover detection on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
      if (target) {
        gsap.to(ring, {
          scale: 1.8,
          backgroundColor: 'rgba(216, 180, 226, 0.15)',
          borderColor: 'rgba(216, 180, 226, 0.8)',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1.5,
          backgroundColor: '#FFFFFF',
          duration: 0.3
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
      if (target) {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(216, 180, 226, 0.4)',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: '#D8B4E2',
          duration: 0.3
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to([dot, ring], { scale: 0.8, duration: 0.15 });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.15 });
      gsap.to(dot, { scale: 1, duration: 0.15 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer Trailing Ring */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border border-brand-accent/40 pointer-events-none z-[9999] transition-opacity duration-300 hidden md:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      {/* Inner Precision Dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(216,180,226,0.8)] pointer-events-none z-[9999] transition-opacity duration-300 hidden md:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
};
