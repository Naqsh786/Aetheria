import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import DecorativeBackground from '../ui/DecorativeBackground';
import RibbonDecorations from '../ui/RibbonDecorations';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { NODES } from '../ui/agencyCoreData';
import AgencyCore from '../ui/AgencyCore';
import AgencyCoreMobile from '../ui/AgencyCoreMobile';

gsap.registerPlugin(ScrollTrigger);

// The 4 capabilities shown in the interactive list. They map 1:1 to the
// 5 orbital nodes in the visual: index 0 (Strategy) is the intro stage,
// then 1..4 are these four. The order matches NODES[1..4] so hovering
// any list item lights up the corresponding node in the model.
const capabilities = [
  {
    index: 1,
    nodeIndex: 1,
    no: '01',
    name: 'Creative Direction',
    desc: 'Editorial design systems, brand expression, and high-fidelity interfaces.',
  },
  {
    index: 2,
    nodeIndex: 2,
    no: '02',
    name: 'Full-Stack Engineering',
    desc: 'Scalable, end-to-end product engineering — frontend, backend, infrastructure.',
  },
  {
    index: 3,
    nodeIndex: 3,
    no: '03',
    name: 'AI & Automation',
    desc: 'Intelligent agents, workflow automation, and production AI systems.',
  },
  {
    index: 4,
    nodeIndex: 4,
    no: '04',
    name: 'Digital Growth',
    desc: 'Performance, analytics, and experimentation to compound outcomes over time.',
  },
];

const WhoWeAre = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  const visualRef = useRef(null);
  const visualContainerRef = useRef(null);
  const listRef = useRef(null);
  const activeCapRef = useRef(1);

  const [activeCap, setActiveCap] = useState(1);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Hover handlers
  const onCapHover = useCallback((idx) => {
    if (visualRef.current?.setHover) {
      visualRef.current.setHover(idx);
    }
  }, []);
  const onCapLeave = useCallback(() => {
    if (visualRef.current?.setHover) {
      visualRef.current.setHover(-1);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scroll-driven active node (0..4 across the stage)
      // On desktop the visual is PINNED to the viewport center, so the user can
      // scroll through the capability list and the visual stays put. Progress is
      // driven by how much of the list has scrolled past the pinned visual.
      // On mobile there is no pin — progress is driven by the list's own scroll
      // position relative to the viewport.
      const visualEl = visualContainerRef.current;
      const listEl = listRef.current;
      const stageEl = stageRef.current;

      if (visualEl && listEl && stageEl) {
        ScrollTrigger.create({
          trigger: isDesktop ? listEl : stageEl,
          start: isDesktop ? 'top 80%' : 'top 80%',
          // On desktop: visual is CSS-sticky to top-24, so it stays in view
          // naturally. ScrollTrigger end = when the list bottom passes the
          // sticky position, so progress covers exactly the time the user
          // is "reading" the visual with the list. We end slightly earlier
          // (bottom 30% instead of bottom top) so the 4th stage activates
          // before the user has to scroll to the absolute bottom.
          // On mobile: use the stage's natural scroll range.
          end: isDesktop ? 'bottom 30%' : 'bottom 60%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // Continuous value 0..4 for the visual flow. Offset by 1 so the
            // visual starts with node 1 (Creative Direction) already active
            // as soon as the user enters the section.
            const continuous = 1 + p * 3;

            // Dominant stage index. The visual starts directly with the
            // first discipline (Creative Direction) and progresses through
            // the remaining three as the user scrolls. Thresholds are
            // compressed toward the start so the 4th stage (Digital Growth)
            // activates well before the user reaches the end of the section.
            const idx = p > 0.62 ? 4 : p > 0.44 ? 3 : p > 0.28 ? 2 : 1;

            // Push continuous progress to the visual for smooth flow
            if (visualRef.current?.setScrollProgress) {
              visualRef.current.setScrollProgress(continuous);
            }

            // Update dominant stage (dedup'd)
            if (idx !== activeCapRef.current) {
              activeCapRef.current = idx;
              setActiveCap(idx);
              if (visualRef.current?.setActive) {
                visualRef.current.setActive(idx);
              }
            }
          },
        });
      }

      // 2. Editorial text reveal on enter (mask slide up)
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll('.reveal-mask-inner');
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. Subtle parallax on the background glow
      if (sectionRef.current) {
        const glows = sectionRef.current.querySelectorAll('[data-parallax-bg]');
        glows.forEach((g) => {
          const strength = parseFloat(g.dataset.parallaxBg) || 0.15;
          gsap.to(g, {
            yPercent: -strength * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  const VisualComponent = isDesktop ? AgencyCore : AgencyCoreMobile;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative text-brand-text bg-section-fade-bottom"
    >
      {/* Wave top edge */}
      <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 80L1440 80L1440 30C1200 60 960 0 720 30C480 60 240 10 0 40Z" fill="#0A0A0B" />
        </svg>
      </div>

      <DecorativeBackground type="glow" color="brand-accent" position="bottom-left" opacity="opacity-25" />
      <DecorativeBackground type="arc" color="brand-gold" position="top-right" opacity="opacity-25" />

      <div
        aria-hidden="true"
        data-parallax-bg="0.2"
        className="absolute top-[10%] right-[5%] w-[420px] h-[420px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <RibbonDecorations twinkles />

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-32 pb-32 md:pt-44 md:pb-44">
        {/* Editorial heading */}
        <div ref={headingRef} className="max-w-5xl">
          <div className="section-title-kdm mb-10">
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3.2rem] font-display font-bold leading-[1.05] text-brand-text">
              Who We Are
            </h2>
          </div>

          <h3 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-display font-bold leading-[1.02] tracking-[-0.02em] text-brand-text">
            <span className="reveal-mask">
              <span className="reveal-mask-inner inline-block">A Creative</span>
            </span>{' '}
            <span className="reveal-mask">
              <span className="reveal-mask-inner inline-block">Technology</span>
            </span>
            <br />
            <span className="reveal-mask">
              <span className="reveal-mask-inner inline-block italic font-light text-brand-accent">Partner.</span>
            </span>
          </h3>

          <p className="mt-10 text-lg md:text-xl lg:text-2xl font-body text-brand-text-muted leading-relaxed max-w-3xl">
            <span className="reveal-mask">
              <span className="reveal-mask-inner inline-block">
                We design, build, automate and grow digital businesses — combining strategy, design, engineering and AI into one connected process.
              </span>
            </span>
          </p>
        </div>

        {/* Stage: interactive visual + capability list */}
        <div ref={stageRef} className="mt-24 md:mt-32 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-stretch">
          {/* Visual — sticky on desktop (CSS handles the pinning), fixed height on mobile */}
          <div className="relative order-1 lg:order-1 lg:h-full">
            <div
              ref={visualContainerRef}
              className="w-full aspect-square max-w-[560px] mx-auto rounded-full glow-anchor lg:sticky lg:top-24"
            >
              <div className="absolute inset-0 rounded-full border border-brand-accent/10" />
              <div className="absolute inset-6 rounded-full border border-brand-accent/5" />
              <VisualComponent ref={visualRef} />

              {/* Center label — large discipline name, smaller eyebrow + counter */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
                <div className="text-center max-w-[80%]">
                  <div className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-brand-accent/70 uppercase mb-3">
                    Now active
                  </div>
                  <div
                    key={activeCap}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.05] tracking-[-0.01em] text-white"
                  >
                    {NODES[activeCap]?.label}
                  </div>
                  <div className="mt-4 text-[10px] sm:text-xs font-mono tracking-[0.3em] text-brand-text-muted/60 uppercase">
                    0{activeCap} <span className="opacity-50">/</span> 04
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capability list */}
          <div ref={listRef} className="order-2 lg:order-2 relative">
            <div className="text-[10px] font-mono tracking-[0.3em] text-brand-accent/70 uppercase mb-8">
              What we connect
            </div>

            <ul className="space-y-0 border-t border-brand-accent/15">
              {capabilities.map((cap) => {
                const isActive = activeCap === cap.nodeIndex;
                return (
                  <li
                    key={cap.index}
                    onMouseEnter={() => onCapHover(cap.nodeIndex)}
                    onMouseLeave={onCapLeave}
                    onFocus={() => onCapHover(cap.nodeIndex)}
                    onBlur={onCapLeave}
                    className={[
                      'group relative border-b border-brand-accent/15 py-6 md:py-7 cursor-default',
                      'transition-colors duration-500',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-6 md:gap-8">
                      <span
                        className={[
                          'font-mono text-xs md:text-sm tracking-widest pt-1 shrink-0 transition-colors duration-500',
                          isActive ? 'text-brand-accent' : 'text-brand-text-muted/50',
                        ].join(' ')}
                      >
                        {cap.no}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={[
                            'font-display font-bold text-xl md:text-2xl lg:text-3xl leading-tight tracking-[-0.01em] transition-colors duration-500',
                            isActive ? 'text-brand-accent' : 'text-brand-text group-hover:text-brand-text/85',
                          ].join(' ')}
                        >
                          {cap.name}
                        </h4>
                        <p
                          className={[
                            'mt-2 text-sm md:text-base font-body leading-relaxed max-w-md transition-all duration-500',
                            isActive
                              ? 'text-brand-text/85 opacity-100 translate-y-0'
                              : 'text-brand-text-muted/70 opacity-70 group-hover:opacity-90 group-hover:translate-y-0.5',
                          ].join(' ')}
                        >
                          {cap.desc}
                        </p>
                      </div>

                      <div
                        className={[
                          'shrink-0 mt-1 transition-all duration-500',
                          isActive
                            ? 'opacity-100 translate-x-0 text-brand-accent'
                            : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 text-brand-text-muted',
                        ].join(' ')}
                      >
                        <ArrowUpRight size={20} />
                      </div>
                    </div>

                    {/* Active indicator bar */}
                    <div
                      aria-hidden="true"
                      className={[
                        'absolute left-0 top-0 h-full w-[2px] bg-brand-accent origin-top transition-transform duration-500',
                        isActive ? 'scale-y-100' : 'scale-y-0',
                      ].join(' ')}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.3, 1)' }}
                    />
                  </li>
                );
              })}
            </ul>

            <p className="mt-10 text-sm font-mono tracking-widest text-brand-text-muted/60 uppercase">
              One system. Five connected disciplines.
            </p>
          </div>
        </div>
      </div>

      {/* Wave bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-20 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 50C1200 20 960 80 720 50C480 20 240 70 0 40Z" fill="#0E0D12" />
        </svg>
      </div>
    </section>
  );
};

export default WhoWeAre;
