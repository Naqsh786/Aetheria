import { useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

export default function ScrollProgress({ lenisRef }) {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = (e) => {
      const lenis = e.detail;
      if (lenis && lenis.limit) {
        const p = lenis.scroll / lenis.limit;
        setProgress(p);
        scaleX.set(p);
      }
    };

    window.addEventListener('lenis-scroll', onScroll, { passive: true });
    return () => window.removeEventListener('lenis-scroll', onScroll);
  }, [scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #a06cd5, #D8B4E2, #f5e0ff, #D8B4E2, #a06cd5)',
      }}
    />
  );
}
