import { useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => min + Math.random() * (max - min);

function easeOutExpo(t) {
  return t === 0 ? 0 : 1 - Math.pow(2, -10 * t);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutSine(t) {
  return Math.sin((t * Math.PI) / 2);
}

const ParticleButton = ({
  children,
  href,
  onClick,
  className = '',
  type = 'button',
}) => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const clipRef = useRef(null);
  const btnRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(null);
  const runningRef = useRef(false);
  const tokenRef = useRef(0);
  const hoverRef = useRef(false);
  const spawnTimerRef = useRef(null);

  const spawnBurst = useCallback((cx, cy, bw, bh, count, colors) => {
    for (let i = 0; i < count; i++) {
      const edge = Math.floor(Math.random() * 4);
      let sx, sy;
      switch (edge) {
        case 0: sx = cx - bw / 2 + Math.random() * bw; sy = cy - bh / 2; break;
        case 1: sx = cx + bw / 2; sy = cy - bh / 2 + Math.random() * bh; break;
        case 2: sx = cx - bw / 2 + Math.random() * bw; sy = cy + bh / 2; break;
        default: sx = cx - bw / 2; sy = cy - bh / 2 + Math.random() * bh; break;
      }
      particlesRef.current.push({
        x: sx, y: sy,
        angle: Math.random() * Math.PI * 2,
        speed: rand(1, 5),
        size: rand(1.5, 3.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        born: performance.now(),
        life: rand(700, 1400),
        wave: rand(0.5, 2),
      });
    }
  }, []);

  const spawnHoverParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const btn = btnRef.current;
    if (!canvas || !root || !btn) return;

    const rootRect = root.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const cx = btnRect.left - rootRect.left + btnRect.width / 2;
    const cy = btnRect.top - rootRect.top + btnRect.height / 2;
    const colors = ['#D8B4E2', '#a06cd5', '#f5e0ff', '#ffffff'];

    // Spawn 4-6 particles per tick from random edges
    const count = Math.floor(rand(4, 7));
    for (let i = 0; i < count; i++) {
      const edge = Math.floor(Math.random() * 4);
      let sx, sy;
      const bw = btnRect.width;
      const bh = btnRect.height;
      switch (edge) {
        case 0: sx = cx - bw / 2 + Math.random() * bw; sy = cy - bh / 2; break;
        case 1: sx = cx + bw / 2; sy = cy - bh / 2 + Math.random() * bh; break;
        case 2: sx = cx - bw / 2 + Math.random() * bw; sy = cy + bh / 2; break;
        default: sx = cx - bw / 2; sy = cy - bh / 2 + Math.random() * bh; break;
      }
      particlesRef.current.push({
        x: sx, y: sy,
        angle: Math.random() * Math.PI * 2,
        speed: rand(0.8, 3),
        size: rand(1, 3),
        color: colors[Math.floor(Math.random() * colors.length)],
        born: performance.now(),
        life: rand(500, 1000),
        wave: rand(0.5, 2),
      });
    }

    // Cap at 200
    if (particlesRef.current.length > 200) {
      particlesRef.current = particlesRef.current.slice(-200);
    }
  }, []);

  // Hover particle loop is wired inside an effect (above) to avoid
  // render-phase ref writes.
  const hoverLoopRef = useRef(null);

  const onEnter = () => {
    hoverRef.current = true;
    // Setup canvas size
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const btn = btnRef.current;
    if (canvas && root && btn) {
      const rootRect = root.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const pw = Math.max(btnRect.width + 300, 400);
      const ph = Math.max(btnRect.height + 300, 300);
      const cx = btnRect.left - rootRect.left + btnRect.width / 2;
      const cy = btnRect.top - rootRect.top + btnRect.height / 2;
      canvas.width = pw * dpr;
      canvas.height = ph * dpr;
      canvas.style.width = pw + 'px';
      canvas.style.height = ph + 'px';
      canvas.style.left = cx + 'px';
      canvas.style.top = cy + 'px';
      canvas.style.display = 'block';
      const ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    hoverLoopRef.current?.();
    if (!frameRef.current) frameRef.current = requestAnimationFrame(drawFrameRef.current);
  };

  const onLeave = () => {
    hoverRef.current = false;
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
  };

  // Draw loop — always runs, clears when no particles. Stored on a ref
  // because it self-schedules; wired inside an effect so we never mutate
  // refs during render.
  const drawFrameRef = useRef(null);

  useEffect(() => {
    drawFrameRef.current = () => {      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pw = canvas.width / (window.devicePixelRatio || 1);
      const ph = canvas.height / (window.devicePixelRatio || 1);
      const now = performance.now();

      ctx.clearRect(0, 0, pw, ph);

      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.born;
        if (age > p.life) return false;
        const pProg = clamp(age / p.life, 0, 1);
        const eased = easeOutExpo(pProg);
        const frame = age / (1000 / 60);
        const travel = p.speed * frame;
        const waveOff = p.wave * 12 * Math.sin(frame * 0.12);
        const nx = p.x + Math.cos(p.angle) * travel - Math.sin(p.angle) * waveOff;
        const ny = p.y + Math.sin(p.angle) * travel + Math.cos(p.angle) * waveOff;

        ctx.save();
        ctx.globalAlpha = 1 - eased;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      if (particlesRef.current.length > 0 || hoverRef.current) {
        frameRef.current = requestAnimationFrame(drawFrameRef.current);
      } else {
        frameRef.current = null;
        if (canvas) {
          canvas.style.display = 'none';
          ctx.clearRect(0, 0, pw, ph);
        }
      }
    };

    // Hover loop — defined after drawFrameRef so there's no cycle issue.
    hoverLoopRef.current = () => {
      if (!hoverRef.current) return;
      spawnHoverParticles();
      spawnTimerRef.current = setTimeout(hoverLoopRef.current, 50);
    };

    return () => {
      drawFrameRef.current = null;
      hoverLoopRef.current = null;
    };
  }, [spawnHoverParticles]);

  // Click = disintegrate + navigate
  const runDisintegrate = useCallback((token, onComplete) => {
    const canvas = canvasRef.current;
    const clip = clipRef.current;
    const btn = btnRef.current;
    const root = rootRef.current;
    if (!canvas || !clip || !btn || !root) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const duration = 800;
    const colors = ['#D8B4E2', '#a06cd5', '#f5e0ff', '#ffffff'];
    const rootRect = root.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const cx = btnRect.left - rootRect.left + btnRect.width / 2;
    const cy = btnRect.top - rootRect.top + btnRect.height / 2;

    const dpr = window.devicePixelRatio || 1;
    const pw = Math.max(btnRect.width + 300, 400);
    const ph = Math.max(btnRect.height + 300, 300);
    canvas.width = pw * dpr;
    canvas.height = ph * dpr;
    canvas.style.width = pw + 'px';
    canvas.style.height = ph + 'px';
    canvas.style.left = cx + 'px';
    canvas.style.top = cy + 'px';
    canvas.style.display = 'block';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particlesRef.current = [];
    const startTime = performance.now();
    let spawned = false;

    const frame = (now) => {
      if (token !== tokenRef.current) return;
      const elapsed = now - startTime;
      const raw = clamp(elapsed / duration, 0, 1);
      const eased = easeInOutCubic(raw);

      clip.style.transform = `translateX(${eased * 101}%)`;
      btn.style.transform = `translateX(${-eased * 101}%)`;

      if (!spawned && raw > 0.3) {
        spawned = true;
        spawnBurst(cx, cy, btnRect.width, btnRect.height, 80, colors);
      }

      ctx.clearRect(0, 0, pw, ph);
      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.born;
        if (age > p.life) return false;
        const pProg = clamp(age / p.life, 0, 1);
        const easedP = easeOutExpo(pProg);
        const f = age / (1000 / 60);
        const travel = p.speed * f;
        const waveOff = p.wave * 15 * Math.sin(f * 0.12);
        const nx = p.x + Math.cos(p.angle) * travel - Math.sin(p.angle) * waveOff;
        const ny = p.y + Math.sin(p.angle) * travel + Math.cos(p.angle) * waveOff;
        ctx.save();
        ctx.globalAlpha = 1 - easedP;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      if (raw >= 1 && particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, pw, ph);
        canvas.style.display = 'none';
        clip.style.transform = '';
        btn.style.transform = '';
        runningRef.current = false;
        onComplete?.();
      } else {
        frameRef.current = requestAnimationFrame(frame);
      }
    };

    runningRef.current = true;
    frameRef.current = requestAnimationFrame(frame);
  }, [spawnBurst]);

  const runRestore = useCallback((token) => {
    const clip = clipRef.current;
    const btn = btnRef.current;
    if (!clip || !btn) return;

    const duration = 500;
    const startTime = performance.now();

    const frame = (now) => {
      if (token !== tokenRef.current) return;
      const raw = clamp((now - startTime) / duration, 0, 1);
      const eased = easeOutSine(raw);
      const inv = 1 - eased;
      clip.style.transform = `translateX(${inv * 101}%)`;
      btn.style.transform = `translateX(${-inv * 101}%)`;

      if (raw < 1) {
        frameRef.current = requestAnimationFrame(frame);
      } else {
        clip.style.transform = '';
        btn.style.transform = '';
        runningRef.current = false;
      }
    };

    runningRef.current = true;
    frameRef.current = requestAnimationFrame(frame);
  }, []);

  const handleClick = useCallback((e) => {
    if (onClick) onClick(e);
    if (href) e.preventDefault();
    if (runningRef.current) return;

    hoverRef.current = false;
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);

    const token = ++tokenRef.current;
    runDisintegrate(token, () => {
      if (href && typeof window !== 'undefined') {
        setTimeout(() => window.location.assign(href), 100);
      }
      setTimeout(() => {
        if (token !== tokenRef.current) return;
        runRestore(token);
      }, 300);
    });
  }, [onClick, href, runDisintegrate, runRestore]);

  useEffect(() => {
    const token = tokenRef.current;
    return () => {
      tokenRef.current = token + 1;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, []);

  const baseClasses = cn(
    'relative rounded-full px-10 py-4',
    'font-display text-sm font-semibold uppercase tracking-[0.06em]',
    'text-white cursor-pointer',
    'transition-shadow duration-300',
    className,
  );

  return (
    <div ref={rootRef} className="relative inline-flex items-center justify-center overflow-visible">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute z-30"
        style={{ display: 'none', transform: 'translate(-50%, -50%)' }}
      />

      {/* Visible button */}
      <div ref={clipRef} className="relative z-10 overflow-hidden rounded-full" style={{ willChange: 'transform' }}>
        <div
          ref={btnRef}
          className={baseClasses}
          style={{
            background: 'linear-gradient(135deg, #D8B4E2 0%, #a06cd5 50%, #7a4fa0 100%)',
            boxShadow: '0 0 25px rgba(216,180,226,0.3)',
            willChange: 'transform',
          }}
        >
          <span className="relative z-10 flex items-center gap-3">{children}</span>
        </div>
      </div>

      {/* Invisible click + hover target on top */}
      <button
        type={type}
        onClick={handleClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="absolute inset-0 z-20 cursor-pointer rounded-full bg-transparent"
        style={{ border: 'none', margin: 0, padding: 0 }}
        aria-label="Button"
      />
    </div>
  );
};

export default ParticleButton;
