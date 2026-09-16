import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { CATEGORY_DATA } from '../data/categoryData';

function MarqueeStrip({ items, speed = 40, reverse = false, color }) {
  return (
    <div className="relative overflow-hidden py-5 z-10">
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
                  style={{ color: `${color}30` }}
                >
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full" style={{ background: `${color}25` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function GradientLine({ color }) {
  return (
    <div className="relative h-px w-full overflow-hidden z-10">
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${color}30 30%, ${color}45 50%, ${color}30 70%, transparent 95%)` }}
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

function FloatingDots({ color }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `${color}30`,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function ServiceItem({ service, index, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-start gap-6 py-7 border-b border-white/[0.04] cursor-default"
    >
                <span className="font-mono text-xs mt-1 shrink-0 w-8" style={{ color: `${color}60` }}>
        {service.icon}
      </span>

      <div className="flex-1">
        <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1 transition-colors duration-300">
          {service.name}
        </h3>
        <p className="text-white/40 text-sm font-medium">{service.desc}</p>
      </div>

      <motion.div
        animate={hovered ? { x: 6, opacity: 1 } : { x: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mt-2"
      >
        <ArrowRight className="w-5 h-5" style={{ color }} />
      </motion.div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"
        style={{ background: `${color}03` }}
      />
    </motion.div>
  );
}

const ServiceCategory = () => {
  const { category } = useParams();
  const data = CATEGORY_DATA[category];
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const numberY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.5], [0.08, 0]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const handleMouse = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  if (!data) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link to="/services" className="text-brand-accent hover:underline">Back to Services</Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;
  const marqueeItems = data.services.map((s) => s.name);

  return (
    <div className="min-h-screen relative" onMouseMove={handleMouse}
      style={{
        background: `
          radial-gradient(ellipse at 20% 15%, ${data.color}10 0%, transparent 40%),
          radial-gradient(ellipse at 80% 25%, ${data.color}08 0%, transparent 35%),
          radial-gradient(ellipse at 50% 75%, ${data.color}06 0%, transparent 40%),
          radial-gradient(ellipse at 30% 55%, ${data.color}04 0%, transparent 50%),
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
          style={{ y: orbY }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          animate={{ x: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[130px] opacity-[0.10]"
            style={{ background: `radial-gradient(circle, ${data.orbColor}, transparent)` }}
          />
        </motion.div>
        <motion.div
          className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full"
          animate={{ x: [0, -50, 0], scale: [1, 0.85, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[150px] opacity-[0.07]"
            style={{ background: `radial-gradient(circle, ${data.orbColor}, transparent)` }}
          />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          animate={{ x: [0, 30, 0], y: [0, -25, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full blur-[160px] opacity-[0.05]"
            style={{ background: `radial-gradient(circle, ${data.orbColor}, transparent)` }}
          />
        </motion.div>
      </div>

      {/* Subtle grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${data.color}80 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden min-h-[80vh] flex items-center z-10">
        <FloatingDots color={data.color} />
        {/* Hero radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${data.color}0c 0%, transparent 50%)` }}
        />
        {/* Giant background letter */}
        <motion.div
          style={{ y: numberY, opacity: numberOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        >
          <span className="font-display text-[18rem] md:text-[28rem] font-black leading-none"
            style={{ color: 'transparent', WebkitTextStroke: `2px ${data.color}` }}
          >
            {data.title.charAt(0)}
          </span>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-12 text-sm"
          >
            <Link to="/services" className="text-white/35 hover:text-white/50 transition-colors font-display">Services</Link>
            <span className="text-white/20">/</span>
            <span style={{ color: `${data.color}cc` }} className="font-display">{data.title}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: data.gradient, boxShadow: `0 10px 40px ${data.color}25` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${data.color}90` }}>
                  {data.tagline}
                </span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="font-display text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tight text-white leading-[0.85]"
                >
                  {data.title}
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 max-w-lg text-white/50 text-base font-medium leading-relaxed"
              >
                {data.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-display font-semibold transition-all hover:shadow-[0_0_30px_rgba(216,180,226,0.3)]"
                  style={{ background: data.gradient, color: '#0A0A0B' }}
                >
                  Start a project
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-1.5"
              >
                {data.capabilities.map((cap, i) => (
                  <motion.span
                    key={cap}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.03, type: 'spring', stiffness: 300, damping: 20 }}
                    className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase border cursor-default transition-all hover:scale-105"
                    style={{
                      borderColor: `${data.color}25`,
                      color: `${data.color}aa`,
                      background: `${data.color}0a`,
                    }}
                  >
                    {cap}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <GradientLine color={data.color} />

      {/* Marquee */}
      <MarqueeStrip items={marqueeItems} speed={30} color={data.color} />

      <GradientLine color={data.color} />

      {/* Services List */}
      <section className="relative py-16 md:py-24 z-10">
        <FloatingDots color={data.color} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 40%, ${data.color}06 0%, transparent 40%)` }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12" style={{ background: `${data.color}25` }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${data.color}90` }}>What We Offer</span>
          </motion.div>

          <div>
            {data.services.map((service, i) => (
              <ServiceItem key={service.name} service={service} index={i} color={data.color} />
            ))}
          </div>
        </div>
      </section>

      <GradientLine color={data.color} />

      {/* Large decorative text */}
      <section className="relative py-8 md:py-12 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${data.color}05 0%, transparent 50%)` }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[4rem] md:text-[6rem] lg:text-[7rem] font-black leading-[0.85] tracking-tight"
              style={{ color: 'transparent', WebkitTextStroke: `1px ${data.color}20` }}
            >
              Our process
            </motion.div>
          </div>
        </div>
      </section>

      <GradientLine color={data.color} />

      {/* Process */}
      <section className="relative py-16 md:py-24 overflow-hidden z-10">
        <FloatingDots color={data.color} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 50%, ${data.color}05 0%, transparent 50%)` }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {data.process.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-8 md:p-10 border-l border-white/[0.08] first:border-l-0 group"
              >
                <div className="overflow-hidden mb-6">
                  <motion.span
                    initial={{ y: '100%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-6xl md:text-7xl font-black block"
                    style={{ color: `${data.color}15` }}
                  >
                    {step.num}
                  </motion.span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>

                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                  style={{ background: `linear-gradient(90deg, ${data.color}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GradientLine color={data.color} />

      {/* Reverse marquee */}
      <MarqueeStrip items={data.capabilities.slice(0, 5)} speed={35} reverse color={data.color} />

      <GradientLine color={data.color} />

      {/* CTA */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to get started?
              </h2>
              <p className="text-white/40 text-sm">Let's discuss how {data.title.toLowerCase()} can transform your business.</p>
            </div>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 font-display text-sm font-semibold overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(216,180,226,0.3)]"
              style={{ background: data.gradient, color: '#0A0A0B' }}
            >
              <span className="relative z-10">Start a Project</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceCategory;
