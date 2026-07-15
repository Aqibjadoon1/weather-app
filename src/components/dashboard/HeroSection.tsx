"use client";

import type { WeatherData, ForecastDay } from "@/redux/types";

interface Props {
  weather: WeatherData | null;
  forecast: ForecastDay[];
  isLoading: boolean;
}

export default function HeroSection({ weather, forecast, isLoading }: Props) {
  const hi = forecast.length > 0 ? forecast[0].high : null;
  const lo = forecast.length > 0 ? forecast[0].low : null;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-72 h-72 rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(184,137,46,0.25) 0%, rgba(184,137,46,0.08) 40%, transparent 70%)",
          }}
        />
      </div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          {isLoading && !weather ? (
            <div className="space-y-2">
              <div className="h-16 w-32 bg-aether-gold/10 rounded-lg animate-pulse" />
              <div className="h-4 w-48 bg-aether-gold/10 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <span className="font-hero-temp text-7xl md:text-[100px] leading-none text-aether-text-primary tracking-tight tabular-nums">
                  {weather ? `${Math.round(weather.temperature)}°` : "72°"}
                </span>
                <div className="flex flex-col gap-1.5 pt-2">
                  {hi !== null && (
                    <span className="font-label-bold text-xs text-aether-text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      H: {hi}°
                    </span>
                  )}
                  {lo !== null && (
                    <span className="font-label-bold text-xs text-aether-text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      L: {lo}°
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p className="font-headline-md text-xl text-aether-text-primary">
                  {weather ? weather.condition : "Partly Cloudy"}
                </p>
                <p className="font-body-md text-sm text-aether-text-muted mt-0.5">
                  {weather
                    ? `${weather.description}. Feels like ${Math.round(weather.feelsLike)}°`
                    : "Clear skies with a gentle breeze."}
                </p>
              </div>
            </>
          )}
        </div>
        {weather && (
          <span className="material-symbols-outlined text-5xl text-aether-gold fill">
            {weather.icon || "wb_sunny"}
          </span>
        )}
      </div>
    </div>
  );
}
