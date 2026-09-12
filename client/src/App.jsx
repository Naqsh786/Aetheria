import { useEffect, useState, useRef } from 'react';
import HomePage from './pages/HomePage';
import { CustomCursor } from './components/ui/CustomCursor';
import Preloader from './components/ui/Preloader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);
  const refreshRef = useRef(false);

  /* ===== Lenis smooth scroll, wired to GSAP ScrollTrigger ===== */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined; // native scroll for reduced-motion users
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    // Drive ScrollTrigger from Lenis frames — required for pinned sections.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ===== Lock scroll while the preloader is visible =====
     One single deferred ScrollTrigger.refresh AFTER the preloader has
     fully unmounted — refreshing mid-fade caused the end-of-loader jank
     (it forces a synchronous layout pass over every pinned section
     while the blob is still animating on screen). */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (loading) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
      if (!refreshRef.current) {
        refreshRef.current = true;
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  useEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text cursor-default">
      {loading && <Preloader onDone={() => setLoading(false)} duration={3000} />}
      <CustomCursor />
      <HomePage />
    </div>
  );
}

export default App;
