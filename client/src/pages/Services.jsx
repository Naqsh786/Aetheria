import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/servicesData';

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null);
  const animated = useRef(false);
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const [display, setDisplay] = useState(() => (isNaN(num) ? value : '0'));

  useEffect(() => {
    if (isNaN(num)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const controls = animate(0, num, {
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setDisplay(Math.round(v).toString()),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function GradientLine() {
  return (
    <div className="relative h-px w-full overflow-hidden z-10">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(160,108,213,0.25) 30%, rgba(216,180,226,0.35) 50%, rgba(160,108,213,0.25) 70%, transparent 95%)' }}
      />
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'lineShimmer 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function MarqueeStrip({ items, speed = 40, reverse = false, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(90deg, #0c0a10, transparent)' }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: 'linear-gradient(270deg, #0c0a10, transparent)' }}
      />
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${speed}s linear infinite`,
        }}
      >
        {[...Array(4)].map((_, setIdx) => (
          <div key={setIdx} className="flex items-center gap-10 shrink-0">
            {items.map((item, i) => (
              <div key={`${setIdx}-${i}`} className="flex items-center gap-5">
                <span className="font-display text-sm font-semibold tracking-wider uppercase"
                  style={{ color: 'rgba(255,255,255,0.20)' }}
                >
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(216,180,226,0.25)' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
      style={{ perspective: '1200px' }}
    >
      <Link to={service.href} className="block">
        <div className="relative overflow-hidden rounded-3xl transition-all duration-700"
          style={{
            minHeight: '420px',
            background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, ${service.color}06 100%)`,
            border: `1px solid ${hovered ? `${service.color}25` : 'rgba(255,255,255,0.05)'}`,
            boxShadow: hovered ? `0 0 80px ${service.color}08, inset 0 0 60px ${service.color}04` : 'none',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at ${mouseX.get()}px ${mouseY.get()}px, ${service.color}15, transparent 40%)`,
            }}
          />

          <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: `linear-gradient(90deg, transparent, ${service.color}80, transparent)` }}
          />

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${service.color} 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 h-full flex flex-col p-8 md:p-10">
            <div className="flex items-start justify-between mb-auto">
              <motion.div
                animate={hovered ? { scale: 1.08, rotate: -3 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: service.gradient, boxShadow: `0 10px 40px ${service.color}30` }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${service.color}60` }}>
                0{index + 1}
              </span>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                {service.title}
              </h3>
              <p className="font-display text-sm font-medium mb-4" style={{ color: `${service.color}cc` }}>
                {service.tagline}
              </p>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                {service.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.04]">
              <div className="flex flex-wrap gap-1.5 mb-5">
                {service.tech.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all hover:scale-105"
                    style={{ borderColor: `${service.color}20`, color: `${service.color}80`, background: `${service.color}08` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: service.color }} />
                  <span className="font-mono text-xs tracking-wider uppercase" style={{ color: `${service.color}80` }}>
                    {service.stats} {service.statsLabel}
                  </span>
                </div>
                <motion.div
                  animate={hovered ? { rotate: 45, scale: 1.1 } : { rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ArrowUpRight className="w-4 h-4 text-white/60" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
            <div className="w-4 h-4 border-t border-r" style={{ borderColor: service.color }} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
            <div className="w-4 h-4 border-b border-l" style={{ borderColor: service.color }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FloatingDots({ color }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: `${color}30`, left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

const Services = () => {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  const handleMouse = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const marqueeItems1 = SERVICES.map((s) => s.title);
  const marqueeItems2 = ['Strategy', 'Design', 'Engineering', 'AI', '3D', 'Marketing', 'Development', 'Automation'];

  return (
    <div ref={sectionRef} className="min-h-screen relative" onMouseMove={handleMouse}
      style={{
        background: `
          radial-gradient(ellipse at 15% 10%, rgba(122, 79, 160, 0.10) 0%, transparent 40%),
          radial-gradient(ellipse at 85% 20%, rgba(216, 180, 226, 0.08) 0%, transparent 35%),
          radial-gradient(ellipse at 50% 80%, rgba(91, 52, 109, 0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 30% 60%, rgba(122, 79, 160, 0.04) 0%, transparent 50%),
          linear-gradient(180deg, #0c0a10 0%, #0A0A0B 30%, #0d0b12 60%, #0A0A0B 100%)
        `
      }}
    >
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: orbY1 }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          animate={{ x: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[130px] opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #a06cd5, transparent)' }}
          />
        </motion.div>
        <motion.div
          style={{ y: orbY2 }}
          className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full"
          animate={{ x: [0, -50, 0], scale: [1, 0.85, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[150px] opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #D8B4E2, transparent)' }}
          />
        </motion.div>
        <motion.div
          style={{ y: orbY3 }}
          className="absolute top-2/3 left-1/3 w-[500px] h-[500px] rounded-full"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[160px] opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #7a4fa0, transparent)' }}
          />
        </motion.div>
      </div>

      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(216,180,226,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden z-10">
        <FloatingDots color="#D8B4E2" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(160,108,213,0.10) 0%, transparent 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-16 bg-brand-accent/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent/80">What We Do</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-display text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tight text-white leading-[0.85]"
            >
              Services
            </motion.h1>
          </div>
          <div className="overflow-hidden mt-1">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="font-display text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tight leading-[0.85]"
              style={{
                background: 'linear-gradient(135deg, #D8B4E2, #a06cd5, #7a4fa0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              & Expertise.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 max-w-md text-white/50 text-base font-medium leading-relaxed"
          >
            Five disciplines. One connected process. We build digital products that stand out.
          </motion.p>
        </div>
      </section>

      <GradientLine />

      <MarqueeStrip items={marqueeItems1} speed={35} className="py-5 z-10 relative" />

      <GradientLine />

      {/* Large decorative text */}
      <section className="relative py-8 md:py-12 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(216,180,226,0.05) 0%, transparent 50%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[4rem] md:text-[6rem] lg:text-[8rem] font-black leading-[0.85] tracking-tight"
              style={{ color: 'transparent', WebkitTextStroke: '1px rgba(216,180,226,0.15)' }}
            >
              We build
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-[4rem] md:text-[6rem] lg:text-[8rem] font-black leading-[0.85] tracking-tight text-right"
              style={{ color: 'transparent', WebkitTextStroke: '1px rgba(216,180,226,0.15)' }}
            >
              digital
            </motion.div>
          </div>
        </div>
      </section>

      <GradientLine />

      {/* Service Cards Grid */}
      <section className="relative py-12 md:py-20 z-10">
        <FloatingDots color="#a06cd5" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(122,79,160,0.06) 0%, transparent 40%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      <GradientLine />

      <MarqueeStrip items={marqueeItems2} speed={45} reverse className="py-5 z-10 relative" />

      <GradientLine />

      {/* Stats strip */}
      <section className="relative py-16 md:py-24 z-10">
        <FloatingDots color="#D8B4E2" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(160,108,213,0.06) 0%, transparent 50%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '500', suffix: '+', label: 'Projects Delivered' },
              { num: '98', suffix: '%', label: 'Client Satisfaction' },
              { num: '5', suffix: '', label: 'Disciplines' },
              { num: '24', suffix: '/7', label: 'Support' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-black text-white mb-2">
                  <AnimatedCounter value={stat.num} suffix={stat.suffix} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GradientLine />

      {/* Bottom CTA */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                Not sure where to start?
              </h2>
              <p className="text-white/40 text-sm">Book a free discovery call. We'll figure it out together.</p>
            </div>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 font-display text-sm font-semibold overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #D8B4E2, #a06cd5)', color: '#0A0A0B' }}
            >
              <span className="relative z-10">Book a Call</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
