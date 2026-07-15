"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { WeatherData } from "@/redux/types";
import StatusWidget from "./StatusWidget";
import DotNav from "./DotNav";

interface Props {
  weather: WeatherData | null;
  cityName: string;
  activeCityIndex: number;
  onCitySelect: (index: number) => void;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "dashboard", exact: true },
  { href: "/dashboard/today", label: "Today", icon: "today" },
  { href: "/dashboard/weekly", label: "Weekly", icon: "calendar_month" },
  { href: "/dashboard/packing", label: "Packing", icon: "luggage" },
  { href: "/dashboard/search", label: "Explore", icon: "explore" },
];

export default function LeftSidebar({
  weather,
  cityName,
  activeCityIndex,
  onCitySelect,
}: Props) {
  const pathname = usePathname();
  const savedCities = useSelector(
    (state: RootState) => state.weather.savedCities
  );

  const isActive = (item: typeof navItems[number]) =>
    item.exact ? pathname === item.href : pathname?.startsWith(item.href) && item.href !== "/dashboard";

  return (
    <div className="h-full flex flex-col gap-3">

      {/* ── Logo / Brand ───────────────────────────────── */}
      <div className="glass-card-elevated rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aether-gold to-aether-gold/60 flex items-center justify-center shadow-lg shadow-aether-gold/20 flex-shrink-0">
          <span className="material-symbols-outlined text-white text-lg fill">wb_sunny</span>
        </div>
        <div className="min-w-0">
          <span className="font-headline-md text-sm text-aether-text-primary tracking-tight block leading-tight">
            Accurate Weather
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted">
            Editorial Series Vol. 04
          </span>
        </div>
      </div>

      {/* ── Status Widget ──────────────────────────────── */}
      <StatusWidget weather={weather} />

      {/* ── Weather Stats 2×2 ─────────────────────────── */}
      <div className="glass-card-elevated rounded-2xl p-4">
        <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-3">
          Current Conditions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Feels Like",
              value: weather ? `${Math.round(weather.feelsLike)}°` : "——",
              icon: "thermostat",
            },
            {
              label: "Humidity",
              value: weather ? `${weather.humidity}%` : "——",
              icon: "water_drop",
            },
            {
              label: "Wind",
              value: weather ? `${Math.round(weather.windSpeed)}` : "——",
              unit: "km/h",
              icon: "air",
            },
            {
              label: "Visibility",
              value: weather ? `${weather.visibility}` : "——",
              unit: "km",
              icon: "visibility",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-inset rounded-xl p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-aether-gold text-[14px] fill">
                  {stat.icon}
                </span>
                <span className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted">
                  {stat.label}
                </span>
              </div>
              <p className="font-headline-md text-lg text-aether-text-primary leading-none tabular-nums">
                {stat.value}
                {stat.unit && (
                  <span className="text-xs font-body-md text-aether-text-muted ml-0.5">
                    {stat.unit}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── City Dot Nav ───────────────────────────────── */}
      <div className="glass-card-elevated rounded-2xl p-4">
        <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-3">
          Saved Cities
        </p>
        <DotNav
          cities={savedCities}
          activeIndex={activeCityIndex}
          onSelect={onCitySelect}
        />
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="font-body-md text-sm text-aether-text-primary leading-tight">
              {cityName}
            </p>
            <p className="font-caption text-[10px] text-aether-text-muted mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Updated just now
            </p>
          </div>
          <Link
            href="/dashboard/search"
            aria-label="Add city"
            className="w-7 h-7 rounded-lg bg-aether-gold/10 hover:bg-aether-gold/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
          >
            <span className="material-symbols-outlined text-aether-gold text-sm">add</span>
          </Link>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <div className="glass-card-elevated rounded-2xl p-2 mt-auto flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                active
                  ? "bg-aether-gold/12 text-aether-gold"
                  : "text-aether-text-muted hover:text-aether-text-primary hover:bg-white/5",
              ].join(" ")}
            >
              <span
                className={[
                  "material-symbols-outlined text-[18px]",
                  active ? "fill" : "",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="font-body-md text-sm">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-aether-gold" />
              )}
            </Link>
          );
        })}

        <hr className="gold-divider my-1" />

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-aether-text-muted hover:text-aether-text-primary hover:bg-white/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span className="font-body-md text-sm">Settings</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-aether-text-muted hover:text-aether-text-primary hover:bg-white/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
          <span className="font-body-md text-sm">Profile</span>
        </Link>
      </div>
    </div>
  );
}
