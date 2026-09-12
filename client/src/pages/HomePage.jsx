import { useRef, useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import TechMarquee from '../components/sections/TechMarquee';
import MarqueeBand from '../components/ui/MarqueeBand';
import StatsRow from '../components/sections/StatsRow';
import WhoWeAre from '../components/sections/WhoWeAre';

const WhyUs = lazy(() => import('../components/sections/WhyUs'));
const SelectedWork = lazy(() => import('../components/sections/SelectedWork'));
const Process = lazy(() => import('../components/sections/Process'));
const CTA = lazy(() => import('../components/sections/CTA'));

const SectionFallback = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
  </div>
);

const HomePage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.page-blob').forEach((blob) => {
        gsap.to(blob, {
          y: () => Math.random() * 100 - 50,
          x: () => Math.random() * 60 - 30,
          duration: () => 6 + Math.random() * 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="relative w-full overflow-hidden">
      <Navbar />

      <div className="page-blob absolute top-[30%] left-[2%] w-72 h-72 bg-brand-accent/5 shape-blob blur-[100px] pointer-events-none z-0" />

      <main>
        <Hero />
        <TechMarquee />
        <MarqueeBand />
        <WhoWeAre />
        <StatsRow />
        <Suspense fallback={<SectionFallback />}>
          <WhyUs />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SelectedWork />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Process />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
