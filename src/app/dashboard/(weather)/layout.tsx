"use client";

import { useWeather } from "@/hooks/useWeather";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients } from "@/lib/getSkyState";
import WeatherShader from "@/components/animations/WeatherShader";
import SkyForeground from "@/components/animations/SkyForeground";
import ThreeScene from "@/components/animations/ThreeScene";

/** States where the raw gradient is bright/washed-out — needs an extra dark scrim */
const BRIGHT_STATES = new Set([
  "clear-day", "cloudy-day", "rainy-day", "snowy", "foggy", "dawn", "dusk",
]);

/** Map sky state → Three.js variant + sun position */
function getThreeVariant(state: string): {
  variant: "sun" | "particles" | "birds";
  sunPosition: [number, number, number];
  opacity: number;
} {
  if (state === "clear-day")
    return { variant: "sun", sunPosition: [5, 4, -6], opacity: 0.7 };
  if (state === "dawn" || state === "dusk")
    return { variant: "sun", sunPosition: [2, 1, -5], opacity: 0.55 };
  if (state.includes("cloudy") || state.includes("rainy") || state === "stormy")
    return { variant: "particles", sunPosition: [3, 3, -5], opacity: 0.25 };
  if (state.includes("night"))
    return { variant: "particles", sunPosition: [3, 3, -5], opacity: 0.18 };
  // snowy, foggy, default
  return { variant: "particles", sunPosition: [3, 3, -5], opacity: 0.20 };
}

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  const { weather } = useWeather();
  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? "cloudy-day";
  const isNight = currentState.includes("night") || currentState === "stormy";
  const isBright = BRIGHT_STATES.has(currentState);
  const three = getThreeVariant(currentState);

  return (
    <div
      className="relative px-container-padding sky-gradient min-h-dvh pb-16"
      style={{ background: skyGradients[currentState] }}
    >
      {/* ── WeatherShader — GLSL noise + clouds + rain ─ */}
      <WeatherShader
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isBright ? 0.45 : 0.35 }}
        condition={weather?.condition}
        isNight={isNight}
      />

      {/* ── Three.js 3D layer — sun / particles ────────── */}
      <ThreeScene
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        style={{ opacity: three.opacity }}
        variant={three.variant}
        sunPosition={three.sunPosition}
      />

      {/* ── Bright-state contrast scrim ─────────────────── */}
      {isBright && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.42) 25%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.46) 80%, rgba(0,0,0,0.60) 100%)",
            zIndex: 1,
          }}
        />
      )}

      {/* ── SkyForeground — SVG sun/moon/birds/rain ─────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        <SkyForeground state={currentState} />
      </div>

      {/* ── Page content ────────────────────────────────── */}
      <div className="relative w-full" style={{ zIndex: 3 }}>
        <div className="max-w-7xl mx-auto w-full px-container-padding md:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
