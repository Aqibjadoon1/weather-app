"use client";

import Link from "next/link";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useEffect, useRef, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";

const FALLBACK: { day: string; date: string; high: number; low: number; condition: string; icon: string; precipitation: number }[] = [
  { day: "SUN", date: "", high: 20, low: 12, condition: "Sunny", icon: "wb_sunny", precipitation: 0 },
  { day: "MON", date: "", high: 18, low: 11, condition: "Partly Cloudy", icon: "partly_cloudy_day", precipitation: 15 },
  { day: "TUE", date: "", high: 15, low: 9, condition: "Rainy", icon: "rainy", precipitation: 70 },
  { day: "WED", date: "", high: 13, low: 8, condition: "Cloudy", icon: "cloud", precipitation: 40 },
  { day: "THU", date: "", high: 17, low: 10, condition: "Partly Cloudy", icon: "partly_cloudy_day", precipitation: 20 },
  { day: "FRI", date: "", high: 21, low: 13, condition: "Sunny", icon: "wb_sunny", precipitation: 5 },
  { day: "SAT", date: "", high: 22, low: 14, condition: "Clear", icon: "wb_sunny", precipitation: 0 },
];

export default function WeeklyPage() {
  const { forecast, isLoading, getForecast } = useForecast();
  const { location, requestLocation } = useCurrentLocation();
  const fetched = useRef(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => { requestLocation(); }, [requestLocation]);
  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getForecast(location.lat, location.lon);
    }
  }, [location, getForecast]);

  const days = forecast.length ? forecast : FALLBACK;
  const selected = days[selectedDay];

  // temp range for the bar chart
  const maxHigh = Math.max(...days.map((d) => d.high));
  const minLow = Math.min(...days.map((d) => d.low));
  const range = maxHigh - minLow || 1;

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">

      {/* ── Header ───────────────────────────────────── */}
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
            7-Day Outlook
          </p>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
            Weekly Forecast
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

      {isLoading && !forecast.length ? (
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="glass-card-elevated rounded-3xl p-4 flex flex-col items-center gap-3">
              <Skeleton variant="text" width={32} height={12} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={40} height={24} />
              <Skeleton variant="text" width={24} height={12} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ── Desktop expandable day columns ──────────── */}
          <div className="hidden md:flex gap-3 mb-6">
            {days.map((day, i) => {
              const isSelected = i === selectedDay;
              return (
                <button
                  key={day.day + i}
                  onClick={() => setSelectedDay(i)}
                  aria-pressed={isSelected}
                  aria-label={`${day.day}: ${day.condition}, High ${day.high}°, Low ${day.low}°`}
                  className={[
                    "flex-1 rounded-3xl p-5 flex flex-col items-center gap-3 cursor-pointer",
                    "transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                    isSelected
                      ? "bg-aether-gold/12 border border-aether-gold/35 shadow-lg shadow-aether-gold/10"
                      : "glass-card-elevated hover:border-aether-gold/25 hover:-translate-y-1",
                  ].join(" ")}
                >
                  <span className={[
                    "font-label-bold text-[10px] uppercase tracking-widest",
                    isSelected ? "text-aether-gold" : "text-aether-text-muted",
                  ].join(" ")}>
                    {day.day}
                  </span>
                  <span className="material-symbols-outlined text-3xl text-aether-gold fill">
                    {day.icon}
                  </span>
                  <div className="text-center">
                    <p className="font-headline-md text-xl text-aether-text-primary tabular-nums leading-none">
                      {day.high}°
                    </p>
                    <p className="font-caption text-[11px] text-aether-text-muted mt-0.5 tabular-nums">
                      {day.low}°
                    </p>
                  </div>
                  {day.precipitation > 0 && (
                    <span className="font-label-bold text-[10px] text-sky-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">water_drop</span>
                      {day.precipitation}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Mobile horizontal scroll ─────────────── */}
          <div className="md:hidden flex overflow-x-auto no-scrollbar gap-3 pb-3 mb-5 -mx-1 px-1">
            {days.map((day, i) => {
              const isSelected = i === selectedDay;
              return (
                <button
                  key={day.day + i}
                  onClick={() => setSelectedDay(i)}
                  className={[
                    "min-w-[120px] rounded-3xl p-4 flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer",
                    "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                    isSelected
                      ? "bg-aether-gold/12 border border-aether-gold/35"
                      : "glass-card-elevated",
                  ].join(" ")}
                >
                  <span className={[
                    "font-label-bold text-[10px] uppercase tracking-widest",
                    isSelected ? "text-aether-gold" : "text-aether-text-muted",
                  ].join(" ")}>
                    {day.day}
                  </span>
                  <span className="material-symbols-outlined text-3xl text-aether-gold fill">{day.icon}</span>
                  <p className="font-headline-md text-lg text-aether-text-primary tabular-nums">{day.high}°</p>
                  <p className="font-caption text-[10px] text-aether-text-muted tabular-nums">{day.low}°</p>
                </button>
              );
            })}
          </div>

          {/* ── Selected day expanded detail ─────────── */}
          {selected && (
            <div className="glass-card-elevated rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
                    {selected.day} {selected.date && `· ${selected.date}`}
                  </p>
                  <h2 className="font-headline-md text-2xl text-aether-text-primary mt-1 leading-tight">
                    {selected.condition}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl glass-inset flex items-center justify-center">
                  <span className="material-symbols-outlined text-aether-gold text-3xl fill">
                    {selected.icon}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-inset rounded-2xl px-4 py-3">
                  <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-1">High</p>
                  <p className="font-headline-md text-2xl text-orange-400 tabular-nums">{selected.high}°</p>
                </div>
                <div className="glass-inset rounded-2xl px-4 py-3">
                  <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-1">Low</p>
                  <p className="font-headline-md text-2xl text-sky-400 tabular-nums">{selected.low}°</p>
                </div>
                <div className="glass-inset rounded-2xl px-4 py-3">
                  <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-1">Precip.</p>
                  <p className="font-headline-md text-2xl text-sky-400 tabular-nums">{selected.precipitation}%</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Daily breakdown table ─────────────────── */}
          <section>
            <div className="section-header mb-3">
              <span className="section-title">Daily Breakdown</span>
            </div>
            <div className="glass-card-elevated rounded-3xl overflow-hidden">
              {days.map((day, i) => {
                const highPct = ((day.high - minLow) / range) * 100;
                const lowPct = ((day.low - minLow) / range) * 100;
                const isSelected = i === selectedDay;
                return (
                  <button
                    key={day.day + i}
                    onClick={() => setSelectedDay(i)}
                    className={[
                      "w-full flex items-center gap-4 px-5 py-3.5 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:bg-aether-gold/8",
                      i < days.length - 1 ? "border-b border-white/5" : "",
                      isSelected
                        ? "bg-aether-gold/8"
                        : "hover:bg-aether-gold/5",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {/* Day label */}
                    <span className={[
                      "w-12 font-label-bold text-[11px] uppercase tracking-wider text-left",
                      isSelected ? "text-aether-gold" : "text-aether-text-muted",
                    ].join(" ")}>
                      {day.day}
                    </span>

                    {/* Icon */}
                    <span className="material-symbols-outlined text-aether-gold fill text-[20px]">
                      {day.icon}
                    </span>

                    {/* Condition */}
                    <span className="flex-1 font-body-md text-sm text-aether-text-muted text-left hidden sm:block">
                      {day.condition}
                    </span>

                    {/* Temperature range bar */}
                    <div className="hidden md:flex flex-1 items-center gap-3 max-w-xs">
                      <span className="font-label-bold text-[11px] text-sky-400 w-8 text-right tabular-nums">
                        {day.low}°
                      </span>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full relative overflow-hidden">
                        <div
                          className="absolute h-full rounded-full"
                          style={{
                            left: `${lowPct}%`,
                            width: `${highPct - lowPct}%`,
                            background: "linear-gradient(90deg, #7dd3fc, #fb923c)",
                          }}
                        />
                      </div>
                      <span className="font-label-bold text-[11px] text-orange-400 w-8 tabular-nums">
                        {day.high}°
                      </span>
                    </div>

                    {/* Mobile temp */}
                    <div className="md:hidden flex items-center gap-3">
                      <span className="font-headline-md text-base text-aether-text-primary tabular-nums">
                        {day.high}°
                      </span>
                      <span className="font-body-md text-sm text-aether-text-muted tabular-nums">
                        {day.low}°
                      </span>
                    </div>

                    {/* Precipitation */}
                    {day.precipitation > 0 && (
                      <span className="font-label-bold text-[11px] text-sky-400 flex items-center gap-1 w-12 justify-end tabular-nums">
                        <span className="material-symbols-outlined text-[13px]">water_drop</span>
                        {day.precipitation}%
                      </span>
                    )}
                    {day.precipitation === 0 && <span className="w-12" />}
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
