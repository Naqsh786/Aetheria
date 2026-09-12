import React from 'react';
import { NODES } from './agencyCoreData';

// DOM-only fallback for mobile (or reduced motion). No Three.js, no GPU load.
// Renders a static orbital diagram with the same 5 nodes, lines, and active/hover state.
// Uses continuous scroll progress for smooth flow between stages (matches desktop behavior).
const AgencyCoreMobile = React.forwardRef(function AgencyCoreMobile(_, ref) {
  const stateRef = React.useRef({ active: 0, hover: -1, progress: 0 });

  React.useImperativeHandle(ref, () => ({
    setActive: (i) => {
      stateRef.current.active = i;
      forceRender();
    },
    setHover: (i) => {
      stateRef.current.hover = i ?? -1;
      forceRender();
    },
    setScrollProgress: (p) => {
      // Continuous progress 0..4 — drives the smooth flow on each node
      stateRef.current.progress = p;
      forceRender();
    },
  }));

  const [, setTick] = React.useState(0);
  const forceRender = () => setTick((n) => n + 1);

  // Position the 5 nodes around a central core using polar coords.
  const radius = 42; // percent
  const positions = NODES.map((_, i) => {
    const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });

  const continuous = stateRef.current.progress;
  const hoverIdx = stateRef.current.hover;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Connecting lines — opacity follows stage weight (1.0 at active, ~0.35 at neighbors) */}
        {positions.map((p, i) => {
          const dist = Math.abs(continuous - i);
          const stageWeight = Math.max(0, 1 - dist * 0.55);
          const isHover = hoverIdx === i;
          const opacity = 0.1 + stageWeight * 0.65 + (isHover ? 0.1 : 0);
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke="#D8B4E2"
              strokeWidth="0.15"
              strokeLinecap="round"
              style={{ opacity, transition: 'opacity 0.25s ease' }}
            />
          );
        })}

        {/* Central core */}
        <g>
          <circle cx="50" cy="50" r="9" fill="rgba(216,180,226,0.06)" stroke="rgba(216,180,226,0.4)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="5" fill="none" stroke="rgba(216,180,226,0.7)" strokeWidth="0.15" />
        </g>

        {/* Orbital nodes — radius and fill follow stage weight */}
        {positions.map((p, i) => {
          const dist = Math.abs(continuous - i);
          const stageWeight = Math.max(0, 1 - dist * 0.55);
          const isHover = hoverIdx === i;
          const baseR = 1.6;
          const r = baseR * (1 + stageWeight * 0.6 + (isHover ? 0.2 : 0));
          const alpha = 0.3 + stageWeight * 0.7 + (isHover ? 0.05 : 0);
          const fill = `rgba(216, 180, 226, ${Math.min(1, alpha)})`;
          const ringR = r * 2.1;
          const ringOpacity = 0.2 + stageWeight * 0.5;
          return (
            <g key={i} style={{ transition: 'all 0.25s ease' }}>
              <circle cx={p.x} cy={p.y} r={ringR} fill="none" stroke="rgba(216,180,226,0.7)" strokeWidth="0.15" style={{ opacity: ringOpacity }} />
              <circle cx={p.x} cy={p.y} r={r} fill={fill} style={{ transition: 'all 0.25s ease' }} />
            </g>
          );
        })}
      </svg>
    </div>
  );
});

export default AgencyCoreMobile;
