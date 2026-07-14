"use client";

import { useId } from "react";
import { type SkyState, isLightBackground } from "@/lib/getSkyState";

interface SkyForegroundProps {
  state: SkyState;
}

function sunPosition(state: SkyState): { top: string; left: string; opacity: number; scale: number } {
  if (state === "dawn" || state === "dusk")
    return { top: "70%", left: "65%", opacity: 0.7, scale: 1.1 };
  if (state === "clear-day")
    return { top: "12%", left: "75%", opacity: 1, scale: 1 };
  if (state.includes("night") || state === "stormy")
    return { top: "15%", left: "70%", opacity: 0.3, scale: 0.8 };
  // cloudy, rainy, snowy, foggy — daytime
  return { top: "18%", left: "72%", opacity: 0.4, scale: 0.85 };
}

function moonPhase(seed: number): "new" | "crescent" | "quarter" | "gibbous" | "full" {
  const p = ((seed % 29.5) + 29.5) % 29.5;
  if (p < 1.8) return "new";
  if (p < 7.4) return "crescent";
  if (p < 11.1) return "quarter";
  if (p < 18.6) return "gibbous";
  if (p < 22.3) return "full";
  if (p < 26) return "gibbous";
  if (p < 29.5) return "crescent";
  return "new";
}

function RealisticMoonSVG({ phase }: { phase: string }) {
  if (phase === "new") return null;
  const id = useId();
  const craters = [
    { cx: 35, cy: 30, r: 6, o: 0.15 }, { cx: 55, cy: 42, r: 8, o: 0.12 },
    { cx: 42, cy: 55, r: 5, o: 0.18 }, { cx: 60, cy: 28, r: 4, o: 0.14 },
    { cx: 48, cy: 38, r: 3, o: 0.20 }, { cx: 38, cy: 48, r: 4, o: 0.16 },
    { cx: 52, cy: 58, r: 3, o: 0.15 }, { cx: 30, cy: 38, r: 3.5, o: 0.13 },
    { cx: 65, cy: 48, r: 3, o: 0.17 }, { cx: 45, cy: 28, r: 2.5, o: 0.19 },
    { cx: 58, cy: 52, r: 2, o: 0.22 }, { cx: 40, cy: 62, r: 2, o: 0.18 },
    { cx: 50, cy: 48, r: 1.5, o: 0.25 }, { cx: 32, cy: 55, r: 2, o: 0.15 },
    { cx: 62, cy: 35, r: 2, o: 0.16 }, { cx: 44, cy: 44, r: 5, o: 0.10 },
  ];
  const shadowRx = phase === "crescent" ? 32 : phase === "quarter" ? 18 : 10;
  const shadowCx = phase === "crescent" ? 38 : 44;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(200,190,170,0.35)_0_0_60px_rgba(200,190,170,0.12)]">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="rgba(220,210,190,0.35)" />
          <stop offset="100%" stopColor="rgba(220,210,190,0)" />
        </radialGradient>
        <radialGradient id={`${id}-surface`} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F0EDE6" />
          <stop offset="50%" stopColor="#E0D9CB" />
          <stop offset="100%" stopColor="#C8BFAE" />
        </radialGradient>
        <radialGradient id={`${id}-crater`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#CBC3B2" />
          <stop offset="100%" stopColor="#B8AF9E" />
        </radialGradient>
        <filter id={`${id}-crater-filter`}>
          <feDropShadow dx="0.3" dy="0.5" stdDeviation="0.4" floodColor="rgba(0,0,0,0.15)" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <circle cx="50" cy="50" r="42" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-glow)`} />
      <circle cx="50" cy="50" r="42" fill={`url(#${id}-surface)`} />
      {craters.map((c, i) => (
        <g key={i} clipPath={`url(#${id}-clip)`}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill={`url(#${id}-crater)`} opacity={c.o} filter={`url(#${id}-crater-filter)`} />
          <ellipse cx={c.cx - c.r * 0.15} cy={c.cy - c.r * 0.15} rx={c.r * 0.35} ry={c.r * 0.2} fill="rgba(255,255,255,0.12)" />
        </g>
      ))}
      {phase !== "full" && (
        <ellipse cx={shadowCx} cy="50" rx={shadowRx} ry="38" fill="#060810" opacity="0.95" clipPath={`url(#${id}-clip)`} />
      )}
    </svg>
  );
}

function StormFlash() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animation: "storm-flash 12s ease-in-out infinite",
      }}
    >
      <div
        className="absolute inset-0 bg-white"
        style={{ animation: "storm-flash-burst 12s ease-in-out infinite" }}
      />
    </div>
  );
}

function CloudLayer({ index, state }: { index: number; state: SkyState }) {
  const dur = 70 + index * 15;
  const delay = index * -18;
  const from = (index + 1) * 20;
  const opacity = state.includes("night") ? 0.15 : 0.2;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animation: `cloud-drift-${index} ${dur}s linear ${delay}s infinite`,
        opacity,
      }}
    >
      <svg
        viewBox="0 0 800 300"
        className="w-[200%] h-auto"
        style={{ position: "absolute", top: `${from}%` }}
        preserveAspectRatio="none"
      >
        <ellipse cx="300" cy="100" rx="180" ry="60" fill="white" />
        <ellipse cx="450" cy="120" rx="160" ry="50" fill="white" />
        <ellipse cx="200" cy="130" rx="120" ry="40" fill="white" />
      </svg>
    </div>
  );
}

const RAIN_COUNT = 80;
const SNOW_COUNT = 60;

function RainLayer() {
  const drops = Array.from({ length: RAIN_COUNT }, (_, i) => ({
    id: i,
    left: `${(i / RAIN_COUNT) * 100}%`,
    delay: `${i * 0.08}s`,
    dur: `${0.5 + (i % 5) * 0.08}s`,
    opacity: 0.15 + (i % 3) * 0.05,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-[1px] h-6 bg-white/30"
          style={{
            left: d.left,
            top: "-10%",
            animation: `rain-fall ${d.dur} linear ${d.delay} infinite`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SnowLayer() {
  const flakes = Array.from({ length: SNOW_COUNT }, (_, i) => ({
    id: i,
    left: `${(i / SNOW_COUNT) * 100}%`,
    delay: `${i * 0.3}s`,
    dur: `${4 + (i % 5) * 1}s`,
    size: 3 + (i % 4),
    drift: (i % 7) * 30,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-white"
          style={{
            left: f.left,
            top: "-10px",
            width: f.size,
            height: f.size,
            opacity: 0.6,
            animation: `snow-fall ${f.dur} linear ${f.delay} infinite`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

const birdVariants = [
  // Gull — wide gentle wings
  "M5 12 C14 5 22 4 30 9 C38 4 46 5 55 12 C46 9 38 9 30 11 C22 9 14 9 5 12Z",
  // Swallow — sharp pointed V
  "M6 14 C15 1 23 1 30 8 C37 1 45 1 54 14 C45 9 37 9 30 11 C23 9 15 9 6 14Z",
  // Hawk — broad rounded wings
  "M7 12 C15 6 22 4 30 9 C38 4 45 6 53 12 C45 9 38 10 30 11 C22 10 15 9 7 12Z",
];

function BirdLayer() {
  const birds = [
    { x: 47, y: 11, size: 34, flap: 0.30, bob: 2.0, delay: 0, variant: 0 },
    { x: 36, y: 16, size: 29, flap: 0.36, bob: 2.6, delay: 0.4, variant: 1 },
    { x: 61, y: 14, size: 28, flap: 0.32, bob: 2.3, delay: 0.7, variant: 2 },
    { x: 50, y: 21, size: 26, flap: 0.40, bob: 2.8, delay: 1.1, variant: 1 },
    { x: 30, y: 23, size: 25, flap: 0.34, bob: 2.1, delay: 0.2, variant: 2 },
    { x: 64, y: 23, size: 25, flap: 0.33, bob: 2.7, delay: 0.9, variant: 0 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-6">
      {birds.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${b.y}%`,
            left: `${b.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{ animation: `bird-bob ${b.bob}s ease-in-out ${b.delay}s infinite` }}
          >
            <svg
              width={b.size}
              height={b.size * 0.38}
              viewBox="0 0 60 20"
              fill="rgba(255,255,255,0.8)"
              className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
              style={{ animation: `bird-flap ${b.flap}s ease-in-out ${b.delay}s infinite` }}
            >
              <path d={birdVariants[b.variant]} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

function WindLayer() {
  const streaks = [
    { top: 14, width: 280, dur: 14, delay: 0, tilt: -3, thick: 3 },
    { top: 24, width: 200, dur: 18, delay: 3, tilt: 2, thick: 2 },
    { top: 34, width: 320, dur: 16, delay: 7, tilt: -1, thick: 2 },
    { top: 44, width: 180, dur: 20, delay: 2, tilt: 4, thick: 2 },
    { top: 54, width: 260, dur: 15, delay: 11, tilt: -2, thick: 2 },
    { top: 64, width: 220, dur: 17, delay: 5, tilt: 1, thick: 3 },
    { top: 74, width: 300, dur: 19, delay: 9, tilt: -3, thick: 2 },
    { top: 84, width: 240, dur: 13, delay: 1, tilt: 3, thick: 2 },
    { top: 92, width: 200, dur: 22, delay: 8, tilt: -1, thick: 2 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-3">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes wind-drift {
            0% { transform: translateX(-30vw) scaleX(1); opacity: 0; }
            15% { opacity: 0.5; }
            85% { opacity: 0.5; }
            100% { transform: translateX(130vw) scaleX(0.7); opacity: 0; }
          }
        }
      `}</style>
      {streaks.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: 0,
            width: `${s.width}px`,
            height: `${s.thick}px`,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.45), rgba(255,255,255,0.55), rgba(255,255,255,0.45), transparent)`,
            borderRadius: "50%",
            animation: `wind-drift ${s.dur}s linear ${s.delay}s infinite`,
            transform: `rotate(${s.tilt}deg)`,
            filter: "blur(2px)",
            boxShadow: "0 0 6px rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute inset-x-0 h-[40%]"
          style={{
            top: `${20 + i * 35}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            filter: "blur(60px)",
            animation: `fog-drift ${90 + i * 30}s linear ${i * -20}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function SkyForeground({ state }: SkyForegroundProps) {
  const isNight = state.includes("night");
  const isCloudy = state.includes("cloudy");
  const isRainy = state.includes("rainy");
  const isStormy = state === "stormy";
  const isSnowy = state === "snowy";
  const isFoggy = state === "foggy";
  const isClearNight = state === "clear-night";
  const showCelestial = state !== "stormy";
  const sunPos = sunPosition(state);
  const moonPh = moonPhase(new Date().getDate());

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes cloud-drift-0 {
            0% { transform: translateX(-10%); }
            100% { transform: translateX(110%); }
          }
          @keyframes cloud-drift-1 {
            0% { transform: translateX(-20%); }
            100% { transform: translateX(120%); }
          }
          @keyframes rain-fall {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(110vh) translateX(-20px); }
          }
          @keyframes snow-fall {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(110vh) translateX(var(--drift, 30px)); }
          }
          @keyframes fog-drift {
            0% { transform: translateX(0); }
            50% { transform: translateX(40px); }
            100% { transform: translateX(0); }
          }
          @keyframes storm-flash {
            0%, 95%, 100% { opacity: 0; }
            96% { opacity: 1; }
            97% { opacity: 0; }
          }
          @keyframes storm-flash-burst {
            0%, 94.5%, 100% { opacity: 0; }
            95% { opacity: 0.15; }
            97% { opacity: 0; }
          }
          @keyframes bird-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes bird-flap {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.35); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        }
      `}</style>

      {showCelestial && !isNight && (
        <div
          className="absolute pointer-events-none transition-all duration-[2000ms] ease-in-out"
          style={{
            top: sunPos.top,
            left: sunPos.left,
            transform: `translate(-50%, -50%) scale(${sunPos.scale})`,
            opacity: sunPos.opacity,
            width: "clamp(60px, 10vw, 120px)",
            height: "clamp(60px, 10vw, 120px)",
            zIndex: 5,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,200,80,0.5)]">
            <defs>
              <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="60%" stopColor="#FFAA00" />
                <stop offset="100%" stopColor="#FF8800" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#sun-glow)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 48 * Math.cos(rad);
              const y1 = 50 + 48 * Math.sin(rad);
              const x2 = 50 + 60 * Math.cos(rad);
              const y2 = 50 + 60 * Math.sin(rad);
              return (
                <line
                  key={angle}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#FFCC44"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={0.5}
                />
              );
            })}
            <circle cx="50" cy="50" r="28" fill="#FFF7CC" />
          </svg>
        </div>
      )}

      {showCelestial && !isNight && (
        <>
          <WindLayer />
          <BirdLayer />
        </>
      )}

      {showCelestial && isNight && !isStormy && (
        <div
          className="absolute pointer-events-none transition-all duration-[2000ms] ease-in-out"
          style={{
            top: "14%",
            left: "72%",
            transform: "translate(-50%, -50%)",
            width: "clamp(50px, 8vw, 90px)",
            height: "clamp(50px, 8vw, 90px)",
            zIndex: 5,
          }}
        >
          <RealisticMoonSVG phase={moonPh} />
        </div>
      )}

      {isClearNight && (
        <div className="absolute inset-0 pointer-events-none z-4">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white rounded-full"
              style={{
                top: `${Math.random() * 60 + 5}%`,
                left: `${Math.random() * 95 + 2.5}%`,
                opacity: 0.3 + Math.random() * 0.7,
                animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 5}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {(isCloudy || state === "dawn" || state === "dusk") && (
        <>
          <CloudLayer index={0} state={state} />
          <CloudLayer index={1} state={state} />
        </>
      )}

      {(isRainy || isStormy) && <RainLayer />}

      {isSnowy && <SnowLayer />}

      {isFoggy && <FogLayer />}

      {isStormy && <StormFlash />}
    </>
  );
}
