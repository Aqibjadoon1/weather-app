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

function MoonSVG({ phase }: { phase: string }) {
  const clipId = useId();
  if (phase === "new") return null;
  if (phase === "full") {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="#EAE7DD" opacity="0.9">
        <circle cx="50" cy="50" r="42" />
      </svg>
    );
  }
  const rx = phase === "crescent" ? 32 : phase === "quarter" ? 18 : 10;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" opacity="0.85">
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="42" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="42" fill="#EAE7DD" />
      <ellipse cx={phase === "crescent" ? 38 : 44} cy="50" rx={rx} ry="38" fill="#060810" clipPath={`url(#${clipId})`} />
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

function BirdLayer() {
  // V-formation centered in upper sky
  const formation = [
    { x: 50, y: 11, size: 28 },   // lead
    { x: 42, y: 14, size: 26 },   // left wing
    { x: 58, y: 14, size: 26 },   // right wing
    { x: 36, y: 18, size: 24 },   // left
    { x: 64, y: 18, size: 24 },   // right
    { x: 46, y: 21, size: 22 },   // inner left
    { x: 54, y: 21, size: 22 },   // inner right
    { x: 40, y: 25, size: 20 },   // far left
    { x: 60, y: 25, size: 20 },   // far right
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-6">
      {formation.map((b, i) => (
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
            style={{ animation: `bird-bob ${2.5 + (i % 4) * 0.5}s ease-in-out ${i * 0.15}s infinite` }}
          >
            <svg
              width={b.size}
              height={b.size * 0.45}
              viewBox="0 0 50 18"
              fill="rgba(255,255,255,0.75)"
              className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
              style={{ animation: `bird-flap ${0.35 + (i % 3) * 0.06}s ease-in-out ${i * 0.12}s infinite` }}
            >
              <path d="M2 14 Q14 1 25 8 Q36 1 48 14 Q36 9 25 11 Q14 9 2 14Z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

function WindLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-3">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes wind-drift {
            0% { transform: translateX(-20vw) scaleX(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(120vw) scaleX(0.8); opacity: 0; }
          }
        }
      `}</style>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute h-px"
          style={{
            top: `${8 + i * 11}%`,
            left: 0,
            width: `${80 + (i % 3) * 60}px`,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.15 + (i % 3) * 0.08}), transparent)`,
            borderRadius: "2px",
            animation: `wind-drift ${10 + i * 4}s linear ${i * 2.5}s infinite`,
            transform: `rotate(${-2 + (i % 3) * 2}deg)`,
            filter: "blur(1px)",
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
          <MoonSVG phase={moonPh} />
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
