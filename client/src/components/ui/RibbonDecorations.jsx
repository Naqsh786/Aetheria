import { memo } from 'react';

// OPTIMIZED: Reduced floating elements, memoized component
const RibbonDecorations = memo(({
  ribbons = false,
  orbs = false,
  energyRings = false,
  laserLine = false,
  twinkles = false,
  orbitRing = false,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {ribbons && (
        <>
          <div className="ribbon-float w-[2px] h-40 top-[10%] left-[8%] opacity-40 hidden lg:block" />
          <div className="ribbon-float w-[1px] h-48 bottom-[20%] right-[12%] opacity-25 hidden lg:block" style={{ animationDelay: '3s' }} />
        </>
      )}

      {orbs && (
        <>
          <div className="glowing-orb w-3 h-3 top-[15%] left-[5%] animate-float-v hidden lg:block" />
          <div className="glowing-orb w-2 h-2 top-[45%] right-[8%] animate-float-h hidden lg:block" style={{ animationDelay: '2s' }} />
        </>
      )}

      {energyRings && (
        <div className="energy-ring w-20 h-20 top-[12%] right-[5%] hidden lg:block" />
      )}

      {laserLine && (
        <div className="laser-line absolute top-1/2 left-0 w-full hidden lg:block" />
      )}

      {twinkles && (
        <>
          <div className="twinkle-star top-[20%] left-[12%]" />
          <div className="twinkle-star top-[40%] right-[18%]" style={{ animationDelay: '1s' }} />
          <div className="twinkle-star bottom-[25%] left-[25%]" style={{ animationDelay: '2s' }} />
        </>
      )}

      {orbitRing && (
        <div className="orbit-ring w-32 h-32 top-[20%] right-[10%] hidden lg:block" />
      )}
    </div>
  );
});

RibbonDecorations.displayName = 'RibbonDecorations';

export default RibbonDecorations;
