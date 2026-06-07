"use client";

import { useState } from "react";

type Pointer = {
  x: number;
  y: number;
};

const ORBITS = [
  { rotation: 0, duration: 9, reverse: false },
  { rotation: 60, duration: 11, reverse: true },
  { rotation: -60, duration: 13, reverse: false }
] as const;

const CENTER = { x: 260, y: 180 };
const ORBIT_RADIUS = 132;
const FOOTBALL_SCALE = 1.2;

function buildSphereTransform(pointer: Pointer, depth: number) {
  const { x, y } = pointer;
  const bulgeX = 1 + Math.abs(x) * 0.1 * depth;
  const bulgeY = 1 - Math.abs(y) * 0.04 * depth;

  return [
    `translate(${x * 10 * depth}px, ${y * 8 * depth}px)`,
    `rotateY(${x * 26 * depth}deg)`,
    `rotateX(${y * -18 * depth}deg)`,
    `scale3d(${bulgeX}, ${bulgeY}, 1)`
  ].join(" ");
}

export function WorldCupHeroVisual() {
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });

  const orbitParallax = `translate(${pointer.x * -10} ${pointer.y * -6})`;
  const footballParallax = `translate(${pointer.x * 16} ${pointer.y * 11}) rotate(${pointer.x * 6} ${CENTER.x} ${CENTER.y})`;
  const coreParallax = `translate(${pointer.x * 30} ${pointer.y * 20})`;

  return (
    <div
      className="relative min-h-[320px] overflow-hidden [perspective:900px]"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5
        });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,122,255,0.12),transparent_55%)]" />
      <div
        className="absolute inset-0 origin-center scale-[1.35] transition-[transform] duration-200 ease-out will-change-transform [transform-style:preserve-3d]"
        style={{ transform: buildSphereTransform(pointer, 1) }}
      >
        <svg
          viewBox="0 0 520 360"
          className="h-full w-full opacity-[0.85]"
          role="img"
          aria-label="Interactive minimal football line animation"
        >
          <g transform={orbitParallax} className="transition-transform duration-200">
            {ORBITS.map(({ rotation, duration, reverse }) => (
              <g key={rotation} transform={`translate(${CENTER.x} ${CENTER.y}) rotate(${rotation})`}>
                <g transform="scale(1, 0.35)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={ORBIT_RADIUS}
                    ry={ORBIT_RADIUS}
                    fill="none"
                    stroke="rgba(194,122,255,0.12)"
                    strokeWidth="1"
                  />
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to={reverse ? "-360 0 0" : "360 0 0"}
                      dur={`${duration}s`}
                      repeatCount="indefinite"
                    />
                    <circle cx={ORBIT_RADIUS} cy="0" r="2.5" fill="#c27aff" opacity="0.85" />
                    <circle cx={-ORBIT_RADIUS * 0.72} cy="0" r="1.8" fill="rgba(229,231,235,0.55)" />
                  </g>
                </g>
              </g>
            ))}
          </g>

          <g transform={footballParallax} className="transition-transform duration-200">
            <g
              transform={`translate(${CENTER.x} ${CENTER.y}) scale(${FOOTBALL_SCALE * (1 + Math.abs(pointer.x) * 0.06)}, ${FOOTBALL_SCALE * (1 - Math.abs(pointer.y) * 0.03)}) translate(${-CENTER.x} ${-CENTER.y})`}
              fill="none"
              stroke="rgba(229,231,235,0.42)"
              strokeWidth="1.2"
            >
              <circle cx={CENTER.x} cy={CENTER.y} r="108" />
              <ellipse cx={CENTER.x} cy={CENTER.y} rx="108" ry="42" />
              <ellipse cx={CENTER.x} cy={CENTER.y} rx="42" ry="108" />
              <path d="M164 130 C210 95 310 95 356 130" />
              <path d="M164 230 C210 265 310 265 356 230" />
              <path d="M190 102 L238 136 L220 192 L162 192 L142 140 Z" />
              <path d="M330 102 L282 136 L300 192 L358 192 L378 140 Z" />
              <path d="M238 136 L282 136 L300 192 L260 224 L220 192 Z" />
              <path d="M162 192 L220 192 L260 224 L238 278 L176 246 Z" />
              <path d="M358 192 L300 192 L260 224 L282 278 L344 246 Z" />
            </g>
          </g>

          <g transform={coreParallax} className="transition-transform duration-200">
            <circle cx={CENTER.x} cy={CENTER.y} r="3" fill="#c27aff" />
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r="28"
              fill="none"
              stroke="rgba(194,122,255,0.25)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
