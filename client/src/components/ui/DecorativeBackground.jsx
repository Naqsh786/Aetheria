import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * A reusable decorative background component for adding visual energy to sections.
 * Types:
 * - 'glow': A soft radial gradient blob.
 * - 'arc': A thin decorative SVG curved line.
 * - 'dots': A subtle dot grid.
 */
const DecorativeBackground = ({ 
  type = 'glow', 
  color = 'brand-accent', // 'brand-accent' or 'brand-gold'
  position = 'top-left',  // e.g. 'top-0 left-0', 'bottom-0 right-0'
  opacity = 'opacity-10',
  className = ''
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !elementRef.current || type === 'dots') return;

    // Apply a subtle parallax drift on scroll
    const direction = position.includes('bottom') ? 1 : -1;
    
    let ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        y: 100 * direction,
        rotation: type === 'arc' ? 15 * direction : 0,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5 // Smooth scrub
        }
      });
    }, elementRef);

    return () => ctx.revert();
  }, [type, position]);

  // Positional helper classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-0 left-0 -translate-x-1/2 -translate-y-1/2';
      case 'top-right': return 'top-0 right-0 translate-x-1/2 -translate-y-1/2';
      case 'bottom-left': return 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2';
      case 'bottom-right': return 'bottom-0 right-0 translate-x-1/2 translate-y-1/2';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return position; // Allow custom classes like 'top-10 -right-20'
    }
  };

  const baseClasses = `absolute pointer-events-none -z-10 ${getPositionClasses()} ${className}`;

  if (type === 'glow') {
    const bgColor = color === 'brand-gold' ? 'bg-brand-gold' : 'bg-brand-accent';
    return (
      <div 
        ref={elementRef}
        className={`${baseClasses} w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] md:blur-[160px] ${bgColor} ${opacity}`} 
      />
    );
  }

  if (type === 'arc') {
    const strokeColor = color === 'brand-gold' ? '#F4E7C3' : '#D8B4E2';
    return (
      <div ref={elementRef} className={`${baseClasses} ${opacity}`}>
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[300px] md:w-[500px] h-auto">
          <path d="M 0 400 A 400 400 0 0 1 400 0" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 8" />
        </svg>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] ${opacity} ${className}`} />
    );
  }

  return null;
};

export default DecorativeBackground;
