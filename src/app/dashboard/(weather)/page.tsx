"use client";

import { useEffect, useRef, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { addRecentSearch } from "@/redux/actions/weatherActions";
import HeaderBar from "@/components/dashboard/HeaderBar";
import HeroSection from "@/components/dashboard/HeroSection";
import RecentlySearched from "@/components/dashboard/RecentlySearched";
import BottomStrip from "@/components/dashboard/BottomStrip";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import Link from "next/link";
import type { ForecastDay } from "@/redux/types";

export default function DashboardPage() {
  const { weather, isLoading: weatherLoading, getWeather } = useWeather();
  const { forecast, isLoading: forecastLoading, getForecast } = useForecast();
  const { location, isLoading: locLoading, requestLocation } = useCurrentLocation();
  const [cityName, setCityName] = useState("Current Location");
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const fetched = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => { requestLocation(); }, [requestLocation]);

  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getWeather(location.lat, location.lon);
      getForecast(location.lat, location.lon);
      fetch(`/api/geocode?lat=${location.lat}&lon=${location.lon}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.name) {
            setCityName(d.name);
            dispatch(addRecentSearch(d.name));
          }
        })
        .catch(() => {});
    }
  }, [location, getWeather, getForecast, dispatch]);

  const isLoading = locLoading || weatherLoading || forecastLoading;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Next 3 forecast days for the bento strip (desktop)
  const nextDays: ForecastDay[] = forecast.slice(0, 3);

  return (
    <div className="flex min-h-screen gap-6 py-6">

      {/* ── Desktop Sidebar ──────────────────────────── */}
      <aside className="hidden md:flex flex-col w-72 flex-shrink-0" aria-label="Sidebar">
        <LeftSidebar
          weather={weather}
          cityName={cityName}
          activeCityIndex={activeCityIndex}
          onCitySelect={setActiveCityIndex}
        />
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-28 md:pb-8">

        <HeaderBar cityName={cityName} date={dateStr} />

        {/* ── DESKTOP BENTO GRID ──────────────────────── */}
        <div className="hidden md:grid gap-4 mb-4" style={{ gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto" }}>

          {/* Hero — spans 2 cols */}
          <div style={{ gridColumn: "1 / 3" }}>
            <HeroSection weather={weather} forecast={forecast} isLoading={isLoading} />
          </div>

          {/* Right column — 3 compact next-day chips stacked */}
          <div className="flex flex-col gap-3">
            {(nextDays.length ? nextDays : [null, null, null]).map((day, i) => (
              <Link
                key={i}
                href="/dashboard/weekly"
                className="glass-card-elevated rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-aether-gold/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold group flex-1"
              >
                {day ? (
                  <>
                    <span className="material-symbols-outlined text-aether-gold fill text-xl flex-shrink-0">{day.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">{day.day}</p>
                      <p className="font-body-md text-xs text-aether-text-primary truncate mt-0.5">{day.condition}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-headline-md text-base text-orange-400 tabular-nums leading-none">{day.high}°</p>
                      <p className="font-caption text-[10px] text-sky-400 tabular-nums">{day.low}°</p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 h-8 skeleton-shimmer rounded-lg" />
                )}
              </Link>
            ))}
          </div>

          {/* Bottom row: Forecast strip spanning all 3 cols */}
          <div style={{ gridColumn: "1 / 4" }}>
            <BottomStrip forecast={forecast} isLoading={forecastLoading} />
          </div>

          {/* Bottom row: Recently searched + 2 CTA cards */}
          <div style={{ gridColumn: "1 / 2" }} className="glass-card-elevated rounded-3xl p-5">
            <RecentlySearched loading={isLoading} />
          </div>

          <Link
            href="/dashboard/packing"
            style={{ gridColumn: "2 / 3" }}
            className="glass-card-elevated rounded-3xl p-5 group hover:border-aether-gold/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-aether-gold/10 flex items-center justify-center group-hover:bg-aether-gold/15 transition-colors">
                <span className="material-symbols-outlined text-aether-gold text-xl fill">luggage</span>
              </div>
              <span className="material-symbols-outlined text-aether-text-muted group-hover:text-aether-gold transition-colors text-xl">arrow_forward</span>
            </div>
            <h3 className="font-headline-md text-base text-aether-text-primary leading-snug">
              AI Packing Companion
            </h3>
            <p className="font-body-md text-xs text-aether-text-muted mt-1 leading-relaxed">
              Smart packing list tailored to your forecast
            </p>
          </Link>

          <Link
            href="/dashboard/weekly"
            style={{ gridColumn: "3 / 4" }}
            className="glass-card-elevated rounded-3xl p-5 group hover:border-aether-gold/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-aether-gold/10 flex items-center justify-center group-hover:bg-aether-gold/15 transition-colors">
                <span className="material-symbols-outlined text-aether-gold text-xl fill">calendar_month</span>
              </div>
              <span className="material-symbols-outlined text-aether-text-muted group-hover:text-aether-gold transition-colors text-xl">arrow_forward</span>
            </div>
            <h3 className="font-headline-md text-base text-aether-text-primary leading-snug">
              7-Day Outlook
            </h3>
            <p className="font-body-md text-xs text-aether-text-muted mt-1 leading-relaxed">
              Full atmospheric timeline for the week ahead
            </p>
          </Link>

        </div>

        {/* ── MOBILE LAYOUT (stacked) ──────────────────── */}
        <div className="md:hidden">
          <HeroSection weather={weather} forecast={forecast} isLoading={isLoading} />

          {/* Mobile quick-action strip */}
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
            {[
              { href: "/dashboard/today", icon: "today", label: "Today" },
              { href: "/dashboard/weekly", icon: "calendar_month", label: "Weekly" },
              { href: "/dashboard/packing", icon: "luggage", label: "Packing" },
              { href: "/dashboard/search", icon: "explore", label: "Explore" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2 px-4 py-2.5 glass-card-elevated rounded-xl flex-shrink-0",
                  "text-aether-text-muted hover:text-aether-gold hover:border-aether-gold/30",
                  "transition-all duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-[17px] fill">{item.icon}</span>
                <span className="font-label-bold text-[11px] uppercase tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>

          <RecentlySearched loading={isLoading} />
          <BottomStrip forecast={forecast} isLoading={forecastLoading} />
        </div>

      </main>
    </div>
  );
}
