"use client";

import type { WeatherData, ForecastDay } from "@/redux/types";

interface Props {
  weather: WeatherData | null;
  forecast: ForecastDay[];
  isLoading: boolean;
  /** Remove bottom margin when rendered inside a grid cell */
  noMargin?: boolean;
}

export default function HeroSection({ weather, forecast, isLoading, noMargin = false }: Props) {
  const hi = forecast.length > 0 ? forecast[0].high : null;
  const lo = forecast.length > 0 ? forecast[0].low : null;

  if (isLoading && !weather) {
    return (
      <div className={`glass-card-elevated rounded-3xl p-6 relative overflow-hidden ${noMargin ? "" : "mb-5"}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-24 w-40 skeleton-shimmer rounded-2xl" />
            <div className="h-5 w-48 skeleton-shimmer rounded-lg" />
            <div className="h-4 w-64 skeleton-shimmer rounded-lg" />
          </div>
          <div className="h-16 w-16 skeleton-shimmer rounded-2xl" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const uvLevel =
    !weather?.uvIndex ? null
    : weather.uvIndex <= 2 ? { label: "Low", color: "text-green-400" }
    : weather.uvIndex <= 5 ? { label: "Moderate", color: "text-yellow-400" }
    : weather.uvIndex <= 7 ? { label: "High", color: "text-orange-400" }
    : { label: "Very High", color: "text-red-400" };

  return (
    <div className={`glass-card-elevated rounded-3xl p-6 relative overflow-hidden ${noMargin ? "" : "mb-5"}`}>
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 80% 20%, rgba(184,137,46,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main row */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        {/* Temperature block */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div>
            <span className="temp-hero">
              {weather ? `${Math.round(weather.temperature)}°` : "72°"}
            </span>
          </div>

          {/* Hi/Lo inline */}
          <div className="flex flex-col gap-1.5 pt-3 flex-shrink-0">
            {hi !== null && (
              <span className="font-label-bold text-[11px] text-aether-text-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50" />
                H: {hi}°
              </span>
            )}
            {lo !== null && (
              <span className="font-label-bold text-[11px] text-aether-text-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
                L: {lo}°
              </span>
            )}
          </div>
        </div>

        {/* Condition icon + label */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl glass-inset flex items-center justify-center">
            <span className="material-symbols-outlined text-aether-gold text-4xl fill">
              {weather?.icon || "wb_sunny"}
            </span>
          </div>
        </div>
      </div>

      {/* Condition + description */}
      <div className="relative z-10 mt-3">
        <h2 className="font-headline-md text-xl text-aether-text-primary leading-tight">
          {weather ? weather.condition : "Partly Cloudy"}
        </h2>
        <p className="font-body-md text-sm text-aether-text-muted mt-0.5 leading-relaxed">
          {weather
            ? `${weather.description}. Feels like ${Math.round(weather.feelsLike)}°`
            : "Clear skies with a gentle breeze."}
        </p>
      </div>

      {/* Quick-stat strip */}
      <div className="relative z-10 mt-5 pt-5 border-t border-white/8 grid grid-cols-3 gap-3">
        {[
          {
            icon: "air",
            label: "Wind",
            value: weather ? `${Math.round(weather.windSpeed)} km/h` : "—",
          },
          {
            icon: "water_drop",
            label: "Humidity",
            value: weather ? `${weather.humidity}%` : "—",
          },
          ...(weather?.uvIndex != null
            ? [{
                icon: "wb_sunny",
                label: "UV Index",
                value: `${weather.uvIndex}`,
                extra: uvLevel?.label,
                extraColor: uvLevel?.color,
              }]
            : [{
                icon: "visibility",
                label: "Visibility",
                value: weather ? `${weather.visibility} km` : "—",
              }]),
        ].map((s) => (
          <div
            key={s.label}
            className="glass-inset rounded-2xl px-4 py-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-aether-gold text-[15px] fill">
                {s.icon}
              </span>
              <span className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted">
                {s.label}
              </span>
            </div>
            <p className="font-headline-md text-base text-aether-text-primary leading-none tabular-nums">
              {s.value}
            </p>
            {("extra" in s) && s.extra && (
              <span className={`font-label-bold text-[10px] ${s.extraColor}`}>
                {s.extra}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
