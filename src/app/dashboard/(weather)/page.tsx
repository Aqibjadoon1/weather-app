"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { isLightBackground } from "@/lib/getSkyState";
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

  const isLoading = locLoading || weatherLoading || forecastLoading;
  const isNight = weather?.sunset ? Date.now() > parseInt(weather.sunset) * 1000 : false;
  const lightBg = !isNight;
  const textPrimary = lightBg ? "text-aether-ink" : "text-aether-text-primary";
  const textMuted = lightBg ? "text-aether-ink/80" : "text-aether-text-primary/85";
  const glassClass = lightBg ? "glass-card-light" : "glass-card-dark";

  const fmtTime = (ts: string | undefined, fallback: string) =>
    ts ? new Date(parseInt(ts) * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : fallback;

  return (
    <>
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
                  <span className="font-label-bold text-label-bold text-aether-gold uppercase font-medium">Feels Like</span>
                  <span className={`font-headline-md text-headline-md ${textPrimary}`}>{Math.round(weather.feelsLike)}°C</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-section-margin">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden group`}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-aether-gold text-lg fill">water_drop</span>
                  <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Humidity</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`font-data text-4xl ${textPrimary} tabular-nums`}>{weather ? weather.humidity : 45}<span className={`font-body-md font-normal text-lg ${textMuted}`}>%</span></span>
                  <div className="w-14 h-14 rounded-full border-4 border-aether-gold/20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-4 border-aether-gold border-t-transparent animate-spin duration-[3s]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 40%)" }} />
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-aether-gold/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-aether-gold to-aether-gold-soft rounded-full transition-all duration-500" style={{ width: `${weather ? Math.min(weather.humidity, 100) : 45}%` }} />
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden group`}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-aether-gold text-lg fill">air</span>
                  <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Wind</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-data text-4xl ${textPrimary} tabular-nums`}>
                    {weather ? Math.round(weather.windSpeed) : 12}<span className={`font-body-md font-normal text-lg ${textMuted} ml-1`}>km/h</span>
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-aether-gold/10">
                      <span className="material-symbols-outlined text-sm text-aether-gold">navigation</span>
                      <span className="font-label-bold text-aether-gold text-xs">{weather ? weather.windDirection : "NE"}</span>
                    </div>
                    <span className={`font-caption text-caption ${textMuted}`}>Gusts <span className="font-data tabular-nums">{weather ? Math.round(weather.windSpeed * 1.5) : 18}</span> km/h</span>
                  </div>
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden group`}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-aether-gold text-lg fill">wb_sunny</span>
                  <span className="font-body text-xs tracking-wide text-aether-gold uppercase">UV Index</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`font-data text-4xl ${textPrimary} tabular-nums`}>{weather ? uvRiskLevel(weather.uvIndex) : "Low"}</span>
                  <span className={`font-data text-lg ${textMuted} tabular-nums`}>{weather ? weather.uvIndex : 0}/11</span>
                </div>
                <div className="relative h-8 w-full mt-3">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path d="M 5 35 A 45 30 0 0 1 95 35" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={lightBg ? "text-aether-ink-muted/40" : "text-aether-text-muted/50"} />
                    <path d="M 5 35 A 45 30 0 0 1 95 35" fill="none" stroke="#C99A3E" strokeWidth="4" strokeLinecap="round"
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

              <div className={`col-span-2 ${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden group`}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-aether-gold text-lg fill">visibility</span>
                      <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Visibility</span>
                    </div>
                    <span className={`font-data text-4xl ${textPrimary} tabular-nums`}>{weather ? weather.visibility : 10}<span className={`font-body-md font-normal text-lg ${textMuted} ml-1`}>km</span></span>
                    <p className={`font-caption text-caption ${textMuted} mt-2 flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Clear horizon view
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-aether-gold text-lg fill">monitoring</span>
                      <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Air Quality</span>
                    </div>
                    <span className={`font-data text-4xl ${textPrimary} tabular-nums`}>Good</span>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-4 rounded-full bg-aether-gold" />
                        <div className="w-1.5 h-6 rounded-full bg-aether-gold" />
                        <div className="w-1.5 h-3 rounded-full bg-aether-gold/40" />
                        <div className="w-1.5 h-2 rounded-full bg-aether-gold/30" />
                      </div>
                      <span className="font-caption text-caption text-aether-gold">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${glassClass} rounded-2xl p-6 bouncy-hover relative overflow-hidden group`}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-aether-gold text-lg fill">brightness_3</span>
                  <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Moon Phase</span>
                </div>
                <div className="flex flex-col items-center pt-2">
                  <div className="relative">
                    <span className="material-symbols-outlined text-5xl text-aether-gold" style={{ fontVariationSettings: "'FILL' 1, 'opsz' 48" }}>brightness_3</span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-aether-gold/60 animate-pulse" />
                  </div>
                  <span className={`font-headline-sm text-headline-sm ${textPrimary} mt-3`}>{weather ? weather.moonPhase : "Waning Crescent"}</span>
                  <span className={`font-caption text-caption ${textMuted} mt-1`}>Next full moon in 6 days</span>
                </div>
              </div>
            </div>

            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className={`font-headline-md text-headline-md ${textPrimary}`}>7-Day Forecast</h2>
                <Link href="/dashboard/weekly" className="text-aether-gold font-label-bold hover:underline">View Details</Link>
              </div>
              {forecastLoading || forecast.length === 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-8 mask-fade-right -mx-2 px-2 no-scrollbar">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`min-w-[130px] rounded-2xl p-6 ${glassClass} flex-shrink-0 min-h-[200px] overflow-hidden`}>
                      <Skeleton variant="text" width={30} height={16} />
                      <div className="my-8 flex justify-center"><Skeleton variant="circular" width={40} height={40} /></div>
                      <Skeleton variant="text" width={50} height={28} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-8 mask-fade-right -mx-2 px-2 no-scrollbar">
                  {forecast.map((day, i) => (
                    <div key={day.day + i} className={`min-w-[130px] rounded-2xl p-6 flex flex-col items-center bouncy-hover flex-shrink-0 min-h-[200px] transition-all duration-300 overflow-hidden ${
                      i === 3
                        ? "bg-gradient-to-b from-aether-gold/25 to-aether-gold/5 text-aether-ink border border-aether-gold/30 shadow-lg shadow-aether-gold/10"
                        : `${glassClass}`
                    }`}>
                      <span className="font-label-bold tracking-wide text-xs text-aether-gold">{day.day}</span>
                      <span className="material-symbols-outlined my-5 text-3xl fill text-aether-gold">{day.icon}</span>
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-headline-md text-headline-md font-bold ${i === 3 ? "text-aether-ink" : textPrimary}`}>{day.high}°</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-0.5 rounded-full ${i === 3 ? "bg-aether-gold/40" : "bg-current opacity-20"}`} />
                          <span className={`font-caption text-caption ${i === 3 ? "text-aether-ink/60" : textMuted}`}>{day.low}°</span>
                        </div>
                      </div>
                      {i === 3 && <span className="mt-3 font-caption text-caption text-aether-gold text-xs uppercase tracking-wider">Today</span>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className={`${glassClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-aether-gold text-lg fill">wb_twilight</span>
                  <span className="font-body text-xs tracking-wide text-aether-gold uppercase">Daylight</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="font-body text-xs tracking-wide text-aether-gold block">Sunrise</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-aether-gold text-lg">clear_day</span>
                    <span className={`font-data font-headline-sm text-headline-sm ${textPrimary} tabular-nums`}>{fmtTime(weather?.sunrise, "06:34")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-body text-xs tracking-wide text-aether-gold block">Sunset</span>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <span className={`font-data font-headline-sm text-headline-sm ${textPrimary} tabular-nums`}>{fmtTime(weather?.sunset, "19:45")}</span>
                    <span className="material-symbols-outlined text-aether-gold text-lg">nightlight</span>
                  </div>
                </div>
              </div>
              <div className="relative h-20 w-full flex items-center justify-center">
                <div className="absolute inset-0 border-t-2 border-dashed rounded-[100%] opacity-20" style={{ borderColor: lightBg ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }} />
                <div className="w-4 h-4 bg-aether-gold rounded-full shadow-[0_0_20px_rgba(201,154,62,0.6)] absolute left-1/4 top-0 -translate-y-1/2" />
                <div className="absolute left-1/3 top-7 w-1.5 h-1.5 rounded-full bg-aether-gold/40" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-aether-gold animate-pulse" />
                <span className={`font-data font-caption text-caption ${textMuted}`}>Daylight: 13h 11m</span>
              </div>
            </div>

            <div className={`${glassClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-aether-gold text-lg fill">checkroom</span>
                <h3 className="font-body text-xs tracking-wide text-aether-gold uppercase">What to Wear</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Light Trench Coat", desc: "Ideal for the breeze", icon: "checkroom" },
                  { name: "Leather Boots", desc: "Walk-ready for city paths", icon: "hiking" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-aether-gold/5 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-aether-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-aether-gold/20 transition-colors">
                      <span className="material-symbols-outlined text-xl text-aether-gold">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className={`font-body-md font-medium ${textPrimary} block group-hover:text-aether-gold transition-colors`}>{item.name}</span>
                      <span className={`font-caption text-caption ${textMuted}`}>{item.desc}</span>
                    </div>
                    <span className={`material-symbols-outlined text-lg ${textMuted} group-hover:text-aether-gold transition-colors`}>chevron_right</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${glassClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-aether-gold text-lg fill">location_on</span>
                <h3 className="font-body text-xs tracking-wide text-aether-gold uppercase">Saved Cities</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "London", temp: 14, cond: "Cloudy" },
                  { name: "Paris", temp: 21, cond: "Sunny" },
                  { name: "New York", temp: 28, cond: "Clear" },
                ].map((city) => (
                  <div key={city.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-aether-gold/10 transition-all cursor-pointer group border border-transparent hover:border-aether-gold/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-aether-gold/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-base text-aether-gold">location_on</span>
                      </div>
                      <div>
                        <span className={`font-body-md font-medium ${textPrimary} group-hover:text-aether-gold transition-colors`}>{city.name}</span>
                        <span className={`font-caption text-caption ${textMuted} block`}>{city.cond}</span>
                      </div>
                    </div>
                    <span className={`font-data font-headline-md text-headline-md tabular-nums ${textPrimary} group-hover:text-aether-gold transition-colors`}>{city.temp}°</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/search" className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-aether-gold/30 text-aether-gold font-body text-sm hover:bg-aether-gold hover:text-aether-bg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-aether-gold focus-visible:outline-none active:scale-[0.98]">
                <span className="material-symbols-outlined text-lg fill">add</span>
                Add a city
              </Link>
            </div>
          </aside>
        </div>
    </>
  );
}
