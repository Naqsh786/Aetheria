import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function MagneticButton({ children, className = '', strength = 0.35, as, ...props }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const Tag = as || 'button';

  return (
    <motion.div
      style={{ x: springX, y: springY, scale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <Tag ref={ref} className={className} {...props}>
        {children}
      </Tag>
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(216,180,226,0.15), transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}
