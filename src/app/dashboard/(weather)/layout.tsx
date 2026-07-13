"use client";

import { useWeather } from "@/hooks/useWeather";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients, isLightBackground } from "@/lib/getSkyState";
import WeatherShader from "@/components/animations/WeatherShader";
import SkyForeground from "@/components/animations/SkyForeground";

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  const { weather } = useWeather();
  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? (weather ? "cloudy-day" : "clear-day");
  const isNight = currentState.includes("night") || currentState === "dusk" || currentState === "stormy";

  return (
    <div
      className="relative min-h-[calc(100dvh+16px)] -mx-container-padding px-container-padding -mt-16 pt-16 sky-gradient"
      style={{ background: skyGradients[currentState] }}
    >
      <WeatherShader
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        condition={weather?.condition}
        isNight={isNight}
      />
      <SkyForeground state={currentState} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
