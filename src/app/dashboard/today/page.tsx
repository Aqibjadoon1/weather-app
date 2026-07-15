"use client";

import { useWeather } from "@/hooks/useWeather";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WeatherShader from "@/components/animations/WeatherShader";

interface HourlySlot {
  time: string;
  icon: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

const FALLBACK_HOURLY: HourlySlot[] = [
  { time: "06:00", icon: "wb_sunny", temperature: 12, condition: "Clear", precipitation: 0 },
  { time: "09:00", icon: "partly_cloudy_day", temperature: 15, condition: "Partly Cloudy", precipitation: 10 },
  { time: "12:00", icon: "wb_sunny", temperature: 18, condition: "Sunny", precipitation: 0 },
  { time: "15:00", icon: "wb_sunny", temperature: 19, condition: "Sunny", precipitation: 0 },
  { time: "18:00", icon: "wb_sunny", temperature: 17, condition: "Clear", precipitation: 0 },
  { time: "21:00", icon: "bedtime", temperature: 14, condition: "Clear", precipitation: 0 },
];

function formatTime(t: string) {
  const h = parseInt(t.split(":")[0]);
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function TodayPage() {
  const { weather, getWeather } = useWeather();
  const { location, requestLocation } = useCurrentLocation();
  const [hourlyData, setHourlyData] = useState<HourlySlot[] | null>(null);
  const [cityName, setCityName] = useState("Current Location");
  const fetched = useRef(false);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getWeather(location.lat, location.lon);
      fetch(`/api/forecast/hourly?lat=${location.lat}&lon=${location.lon}`)
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setHourlyData(data); })
        .catch(() => {});
      fetch(`/api/geocode?lat=${location.lat}&lon=${location.lon}`)
        .then((r) => r.json())
        .then((d) => { if (d.name) setCityName(d.name); })
        .catch(() => {});
    }
  }, [location, getWeather]);

  const isNight = weather?.sunset
    ? Date.now() > parseInt(weather.sunset) * 1000
    : false;

  const displayHourly = hourlyData ?? FALLBACK_HOURLY;

  const sunriseStr = weather
    ? new Date(parseInt(weather.sunrise) * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false,
      })
    : "06:34";
  const sunsetStr = weather
    ? new Date(parseInt(weather.sunset) * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false,
      })
    : "19:45";

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">

      {/* ── Page header ──────────────────────────────── */}
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
            Today
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="self-start sm:self-auto inline-flex items-center gap-2 glass-card-elevated rounded-xl px-4 py-2.5 text-sm text-aether-text-primary font-label-bold whitespace-nowrap hover:border-aether-gold/40 hover:text-aether-gold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined fill text-[16px]">arrow_back</span>
          Dashboard
        </Link>
      </header>

      {/* ── Hero weather card ────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl mb-6" aria-label="Current weather">
        <WeatherShader
          className="absolute inset-0 w-full h-full"
          condition={weather?.condition}
          isNight={isNight}
        />
        <div className="relative z-10 glass-card-elevated rounded-3xl p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-label-bold text-[11px] uppercase tracking-widest text-aether-text-muted mb-1">
                {cityName}
              </p>
              <div className="flex items-end gap-3">
                <span className="temp-hero">
                  {weather ? `${Math.round(weather.temperature)}°` : "18°"}
                </span>
                <div className="pb-3 flex flex-col gap-1">
                  <span className="font-label-bold text-[11px] text-aether-text-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Feels {weather ? `${Math.round(weather.feelsLike)}°` : "16°"}
                  </span>
                </div>
              </div>
              <p className="font-headline-md text-lg text-aether-text-primary mt-1">
                {weather?.condition ?? "Partly Cloudy"}
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <div className="w-14 h-14 rounded-2xl glass-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-aether-gold text-3xl fill">
                  {weather?.icon ?? "wb_sunny"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="mt-5 pt-4 border-t border-white/8 grid grid-cols-4 gap-3">
            {[
              { icon: "water_drop", label: "Humidity", value: weather ? `${weather.humidity}%` : "—" },
              { icon: "air", label: "Wind", value: weather ? `${Math.round(weather.windSpeed)} km/h` : "—" },
              { icon: "visibility", label: "Visibility", value: weather ? `${weather.visibility} km` : "—" },
              { icon: "wb_sunny", label: "UV Index", value: weather ? `${weather.uvIndex}` : "—" },
            ].map((s) => (
              <div key={s.label} className="glass-inset rounded-xl px-2 py-2.5 text-center">
                <span className="material-symbols-outlined text-aether-gold text-[14px] fill block mx-auto mb-1">
                  {s.icon}
                </span>
                <p className="font-headline-md text-sm text-aether-text-primary leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hourly timeline ──────────────────────────── */}
      <section className="mb-6" aria-label="Hourly forecast">
        <div className="section-header mb-4">
          <span className="section-title">Today&apos;s Journey</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {displayHourly.map((slot, i) => {
            const isNow = i === 0;
            return (
              <div
                key={i}
                className={[
                  "min-w-[100px] rounded-2xl p-4 flex flex-col items-center gap-2 flex-shrink-0",
                  "transition-all duration-200",
                  isNow
                    ? "bg-aether-gold/15 border border-aether-gold/30"
                    : "glass-card-elevated hover:border-aether-gold/25",
                ].join(" ")}
              >
                <span className={[
                  "font-label-bold text-[10px] uppercase tracking-wider",
                  isNow ? "text-aether-gold" : "text-aether-text-muted",
                ].join(" ")}>
                  {isNow ? "Now" : formatTime(slot.time)}
                </span>
                <span className="material-symbols-outlined text-3xl text-aether-gold fill">
                  {slot.icon}
                </span>
                <span className="font-headline-md text-lg text-aether-text-primary leading-none tabular-nums">
                  {slot.temperature}°
                </span>
                <span className="font-caption text-[10px] text-aether-text-muted text-center leading-tight">
                  {slot.condition}
                </span>
                {slot.precipitation > 0 && (
                  <span className="font-label-bold text-[10px] text-sky-400 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">water_drop</span>
                    {slot.precipitation}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Details grid — Sunrise/Precip/Wind ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        {/* Sunrise & Sunset */}
        <div className="glass-card-elevated rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-aether-gold text-[18px] fill">wb_twilight</span>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
              Sunrise &amp; Sunset
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="font-headline-md text-2xl text-aether-text-primary tabular-nums">{sunriseStr}</p>
              <p className="font-caption text-[11px] text-aether-text-muted mt-0.5">Sunrise</p>
            </div>
            <div className="flex-1 mx-4 pb-1">
              {/* Arc */}
              <svg viewBox="0 0 80 30" className="w-full" aria-hidden="true">
                <path d="M4 26 Q40 2 76 26" fill="none" stroke="rgba(184,137,46,0.25)" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="40" cy="12" r="4" fill="#B8892E" />
                <circle cx="40" cy="12" r="7" fill="rgba(184,137,46,0.2)" />
              </svg>
            </div>
            <div className="text-right">
              <p className="font-headline-md text-2xl text-aether-text-primary tabular-nums">{sunsetStr}</p>
              <p className="font-caption text-[11px] text-aether-text-muted mt-0.5">Sunset</p>
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="glass-card-elevated rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sky-400 text-[18px] fill">rainy</span>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
              Precipitation
            </span>
          </div>
          <p className="font-headline-md text-4xl text-aether-text-primary tabular-nums">
            {displayHourly[0]?.precipitation ?? 10}
            <span className="text-xl text-aether-text-muted font-body-md ml-0.5">%</span>
          </p>
          <p className="font-caption text-[11px] text-aether-text-muted mt-1 mb-4">
            {(displayHourly[0]?.precipitation ?? 10) > 50
              ? "Precipitation likely"
              : "No precipitation expected"}
          </p>
          <div className="precip-bar">
            <div
              className="precip-bar-fill"
              style={{ width: `${displayHourly[0]?.precipitation ?? 10}%` }}
            />
          </div>
        </div>

        {/* Wind */}
        <div className="glass-card-elevated rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-aether-gold text-[18px] fill">air</span>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
              Wind
            </span>
          </div>
          <p className="font-headline-md text-4xl text-aether-text-primary tabular-nums">
            {weather ? Math.round(weather.windSpeed) : 12}
            <span className="text-xl text-aether-text-muted font-body-md ml-1">km/h</span>
          </p>
          <p className="font-caption text-[11px] text-aether-text-muted mt-1 mb-4">
            {weather ? weather.windDirection : "NE"} direction
          </p>
          <div className="flex gap-2">
            {displayHourly.filter((_, i) => i % 2 === 0).slice(0, 3).map((slot, i) => (
              <div key={i} className="flex-1 glass-inset rounded-xl py-2 text-center">
                <p className="font-caption text-[10px] text-aether-text-muted">{formatTime(slot.time)}</p>
                <p className="font-headline-md text-base text-aether-text-primary mt-1 tabular-nums">
                  {slot.temperature}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "UV Index", value: weather ? `${weather.uvIndex}` : "2", sub: "Low exposure" },
          { label: "Humidity", value: weather ? `${weather.humidity}%` : "45%", sub: "Comfortable" },
          { label: "Visibility", value: weather ? `${weather.visibility} km` : "10 km", sub: "Clear" },
          { label: "Pressure", value: "1013 hPa", sub: "Steady" },
        ].map((item) => (
          <div key={item.label} className="glass-card-elevated rounded-2xl p-4">
            <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-2">
              {item.label}
            </p>
            <p className="font-headline-md text-xl text-aether-text-primary tabular-nums leading-none">
              {item.value}
            </p>
            <p className="font-caption text-[10px] text-aether-text-muted mt-1.5">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
