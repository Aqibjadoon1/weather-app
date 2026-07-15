"use client";

import { useWeather } from "@/hooks/useWeather";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients } from "@/lib/getSkyState";
import WeatherShader from "@/components/animations/WeatherShader";
import SkyForeground from "@/components/animations/SkyForeground";

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  const { weather } = useWeather();
  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? "cloudy-day";
  const isNight = currentState.includes("night") || currentState === "stormy";

  return (
    <div
      className="relative -mx-container-padding px-container-padding sky-gradient min-h-dvh pb-16"
      style={{ background: skyGradients[currentState] }}
    >
      <WeatherShader
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        condition={weather?.condition}
        isNight={isNight}
      />
      <SkyForeground state={currentState} />
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full px-container-padding md:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
