import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import Preloader from './components/ui/Preloader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const ServiceCategory = lazy(() => import('./pages/ServiceCategory'));

const SectionFallback = () => (
  <div className="flex h-[40vh] items-center justify-center bg-brand-bg">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
  </div>
);

let hasPreloaded = false;



function AppContent() {
  const [loading, setLoading] = useState(() => !hasPreloaded);
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

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

  useEffect(() => {
    const lenis = lenisRef.current;
    if (loading) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      lenis?.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loading]);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    return () => { ScrollTrigger.killAll(); };
  }, []);

  useEffect(() => {
    if (loading) return;

    const lenis = lenisRef.current;
    
    if (location.hash) {
      const id = location.hash.slice(1);
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          if (lenis) {
            // Use Lenis for smooth scrolling, adding offset for fixed navbar
            lenis.scrollTo(el, { offset: -80, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (attempts < 120) {
          // Increase attempts to 120 frames (~2 seconds) for lazy-loaded pages
          attempts++;
          requestAnimationFrame(tryScroll);
        }
      };
      // Give React router and lazy components a tiny moment to mount before searching
      setTimeout(tryScroll, 100);
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [location.pathname, location.hash, loading]);

  const handlePreloaderDone = () => {
    hasPreloaded = true;
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text cursor-default">
      {!hasPreloaded && loading && <Preloader onDone={handlePreloaderDone} duration={3000} />}
      <CustomCursor />
      <Navbar />
      <Suspense fallback={<SectionFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:category" element={<ServiceCategory />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
