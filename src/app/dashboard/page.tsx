"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients, isLightBackground } from "@/lib/getSkyState";
import WeatherShader from "@/components/animations/WeatherShader";
import SkyForeground from "@/components/animations/SkyForeground";
import Skeleton from "@/components/ui/Skeleton";

function uvRiskLevel(index: number): string {
  if (index <= 2) return "Low";
  if (index <= 5) return "Moderate";
  if (index <= 7) return "High";
  if (index <= 10) return "Very High";
  return "Extreme";
}

export default function DashboardPage() {
  const { weather, isLoading: weatherLoading, getWeather } = useWeather();
  const { forecast, isLoading: forecastLoading, getForecast } = useForecast();
  const { location, isLoading: locLoading, requestLocation } = useCurrentLocation();
  const [cityName, setCityName] = useState("Current Location");
  const fetched = useRef(false);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getWeather(location.lat, location.lon);
      getForecast(location.lat, location.lon);
      fetch(`/api/geocode?lat=${location.lat}&lon=${location.lon}`)
        .then((r) => r.json())
        .then((d) => { if (d.name) setCityName(d.name); })
        .catch(() => {});
    }
  }, [location, getWeather, getForecast]);

  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? (weather ? "cloudy-day" : "clear-day");
  const lightBg = isLightBackground(currentState);
  const textPrimary = lightBg ? "text-aether-ink" : "text-aether-text-primary";
  const textMuted = lightBg ? "text-aether-ink-muted" : "text-aether-text-muted";
  const glassClass = lightBg ? "glass-card-light" : "glass-card-dark";
  const isNight = currentState.includes("night") || currentState === "dusk" || currentState === "stormy";
  const isLoading = locLoading || weatherLoading || forecastLoading;

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
        <section className="relative min-h-[92vh] flex flex-col justify-end pb-section-margin">
          <div className="flex flex-col items-start p-10 md:p-16 max-w-5xl">
            <span className="font-label-bold uppercase tracking-widest text-aether-gold mb-2">{cityName.toUpperCase()}</span>
            <h1 className={`font-hero-temp text-headline-lg-mobile md:text-hero-temp ${textPrimary} mb-4 leading-none tracking-tight`}>
              {cityName}
            </h1>
            <div className="flex flex-wrap items-end gap-8 mt-6">
              <div className="flex flex-col">
                {isLoading && !weather ? (
                  <Skeleton variant="text" width={200} height={110} />
                ) : (
                  <>
                    <span className="font-hero-temp text-hero-temp leading-none text-aether-gold">
                      {weather ? `${Math.round(weather.temperature)}°C` : "18°C"}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="material-symbols-outlined text-aether-gold-soft fill">cloud</span>
                      <span className={`font-headline-md text-headline-md ${textPrimary}`}>
                        {weather ? weather.condition : "Partly Cloudy"}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {weather && (
                <div className="flex flex-col border-l border-aether-gold/30 pl-8 pb-4">
                  <span className={`font-label-bold text-label-bold ${textMuted} uppercase font-medium`}>Feels Like</span>
                  <span className={`font-headline-md text-headline-md ${textPrimary}`}>{Math.round(weather.feelsLike)}°C</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-section-margin">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden`}>
                <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-6 block`}>Humidity</span>
                <div className="flex items-center justify-between">
                  <span className={`font-data text-3xl ${textPrimary} tabular-nums`}>{weather ? weather.humidity : 45}%</span>
                  <div className="w-12 h-12 rounded-full border-4 border-aether-gold/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-aether-gold border-t-transparent animate-spin duration-[3s]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }} />
                  </div>
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden`}>
                <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-6 block`}>Wind</span>
                <div className="flex flex-col">
                  <span className={`font-data text-3xl ${textPrimary} tabular-nums`}>
                    {weather ? Math.round(weather.windSpeed) : 12} <small className="font-body-md font-normal">km/h</small>
                  </span>
                  <div className="mt-4 flex items-center gap-2 text-aether-slate">
                    <span className="material-symbols-outlined animate-pulse">navigation</span>
                    <span className="font-label-bold">{weather ? weather.windDirection : "NE"}</span>
                  </div>
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden`}>
                <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-6 block`}>UV Index</span>
                <div className="flex flex-col gap-2">
                  <span className={`font-data text-3xl ${textPrimary} tabular-nums`}>{weather ? uvRiskLevel(weather.uvIndex) : "Low"}</span>
                  <div className="relative h-8 w-full mt-2">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                      <path d="M 5 35 A 45 30 0 0 1 95 35" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-20" />
                      <path d="M 5 35 A 45 30 0 0 1 95 35" fill="none" stroke="#E8C878" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={`${(weather ? Math.min(weather.uvIndex / 11, 1) : 0.2) * 141} 141`} />
                      {[0, 3, 6, 9, 11].map((val, i) => {
                        const angle = 180 - (val / 11) * 180;
                        const rad = (angle * Math.PI) / 180;
                        const x = 50 + 42 * Math.cos(rad);
                        const y = 35 - 28 * Math.sin(rad);
                        return (
                          <g key={i}>
                            <text x={50 + 48 * Math.cos(rad)} y={35 - 32 * Math.sin(rad)} textAnchor="middle" fontSize="5" className={lightBg ? "fill-aether-ink-muted/60" : "fill-aether-text-muted/60"}>{val}</text>
                            <circle cx={x} cy={y} r="1.5" className={lightBg ? "fill-aether-ink-muted/30" : "fill-aether-text-muted/30"} />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`col-span-2 ${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden`}>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-2 block`}>Visibility</span>
                    <span className={`font-data text-3xl ${textPrimary} tabular-nums`}>{weather ? weather.visibility : 10} <span className="font-body-md">km</span></span>
                    <p className={`font-caption text-caption ${textMuted} mt-2`}>Clear horizon view</p>
                  </div>
                  <div>
                    <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-2 block`}>Air Quality</span>
                    <span className={`font-data text-3xl ${textPrimary} tabular-nums`}>Good</span>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-aether-gold" />
                      <span className="font-caption text-caption text-aether-gold">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden`}>
                <span className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-6 block`}>Moon Phase</span>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl mb-2 text-aether-gold" style={{ fontVariationSettings: "'opsz' 48" }}>brightness_3</span>
                  <span className={`font-label-bold ${textPrimary}`}>{weather ? weather.moonPhase : "Waning Crescent"}</span>
                </div>
              </div>
            </div>

            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className={`font-headline-md text-headline-md ${textPrimary}`}>7-Day Forecast</h2>
                <Link href="/dashboard/weekly" className="text-aether-gold font-label-bold hover:underline">View Details</Link>
              </div>
              {forecastLoading && !forecast ? (
                <div className="flex gap-5 overflow-x-auto pb-8">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`min-w-[150px] rounded-2xl p-7 ${glassClass} flex-shrink-0 min-h-[220px]`}>
                      <Skeleton variant="text" width={30} height={16} />
                      <div className="my-8 flex justify-center"><Skeleton variant="circular" width={40} height={40} /></div>
                      <Skeleton variant="text" width={50} height={28} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-8 mask-fade-right -mx-2 px-2 no-scrollbar">
                  {(forecast || []).map((day, i) => (
                    <div key={day.day + i} className={`min-w-[150px] rounded-2xl p-7 editorial-shadow flex flex-col items-center justify-between bouncy-hover flex-shrink-0 min-h-[220px] ${
                      i === 3
                        ? "bg-aether-gold/20 text-aether-ink border border-aether-gold/30"
                        : `${glassClass}`
                    }`}>
                      <span className={`font-label-bold ${textMuted}`}>{day.day}</span>
                      <span className="material-symbols-outlined my-4 text-4xl fill text-aether-gold">{day.icon}</span>
                      <div className="flex flex-col items-center">
                        <span className={`font-headline-md text-headline-md ${textPrimary}`}>{day.high}°</span>
                        <span className={`font-caption text-caption ${textMuted} mt-1`}>{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className={`${glassClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className={`font-body text-xs tracking-wide ${textMuted} uppercase block`}>Sunrise</span>
                  <span className={`font-data text-2xl ${textPrimary} tabular-nums mt-1 block`}>{weather ? weather.sunrise : "06:34"}</span>
                </div>
                <div className="text-right">
                  <span className={`font-body text-xs tracking-wide ${textMuted} uppercase block`}>Sunset</span>
                  <span className={`font-data text-2xl ${textPrimary} tabular-nums mt-1 block`}>{weather ? weather.sunset : "19:45"}</span>
                </div>
              </div>
              <div className="relative h-24 w-full flex items-center justify-center">
                <div className="absolute inset-0 border-t-2 border-dashed rounded-[100%] opacity-20" style={{ borderColor: lightBg ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }} />
                <div className="w-4 h-4 bg-aether-gold-soft rounded-full shadow-[0_0_15px_rgba(232,200,120,0.5)] absolute left-1/4 top-0 -translate-y-1/2" />
              </div>
            </div>

            <div className={`${glassClass} rounded-2xl p-6 relative overflow-hidden border-l-4 border-aether-gold`}>
              <h3 className={`font-headline-md text-headline-md ${textPrimary} mb-6`}>What to Wear</h3>
              <div className="space-y-6">
                {[
                  { name: "Light Trench Coat", desc: "Ideal for the breeze", icon: "check_circle" },
                  { name: "Leather Boots", desc: "Walk-ready for city paths", icon: "check_circle" },
                  { name: "Silk Scarf", desc: "Extra warmth for the evening", icon: "check_circle" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`w-16 h-16 ${glassClass} rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-3xl text-aether-gold">checkroom</span>
                    </div>
                    <div>
                      <span className={`font-body-md font-medium ${textPrimary} block`}>{item.name}</span>
                      <span className={`font-caption text-caption ${textMuted}`}>{item.desc}</span>
                    </div>
                    <span className={`material-symbols-outlined ml-auto ${textMuted} group-hover:text-aether-gold transition-colors`}>{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${glassClass} rounded-2xl p-6`}>
              <h3 className={`font-body text-xs tracking-wide ${textMuted} uppercase mb-4`}>Saved Cities</h3>
              <div className="space-y-3">
                {[
                  { name: "London", temp: 14 },
                  { name: "Paris", temp: 21 },
                  { name: "New York", temp: 28 },
                ].map((city) => (
                  <div key={city.name} className={`flex justify-between items-center p-3 rounded-xl hover:bg-aether-gold/10 transition-all cursor-pointer group ${glassClass}`}>
                    <span className={`font-body-md font-medium ${textPrimary}`}>{city.name}</span>
                    <span className={`font-data text-xl tabular-nums ${textPrimary} group-hover:text-aether-gold`}>{city.temp}°</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/search" className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-aether-gold text-aether-gold font-body text-sm hover:bg-aether-gold hover:text-aether-bg transition-colors focus-visible:ring-2 focus-visible:ring-aether-gold focus-visible:outline-none">
                <span className="material-symbols-outlined text-lg fill">add</span>
                Add a city
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
