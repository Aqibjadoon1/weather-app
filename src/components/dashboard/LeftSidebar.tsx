"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { WeatherData, SavedCity } from "@/redux/types";
import StatusWidget from "./StatusWidget";
import DotNav from "./DotNav";

interface Props {
  weather: WeatherData | null;
  cityName: string;
  activeCityIndex: number;
  onCitySelect: (index: number) => void;
}

export default function LeftSidebar({
  weather,
  cityName,
  activeCityIndex,
  onCitySelect,
}: Props) {
  const savedCities = useSelector(
    (state: RootState) => state.weather.savedCities
  );
  const activeCity: SavedCity | undefined = savedCities[activeCityIndex];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Logo */}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-aether-gold flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg fill">wb_sunny</span>
        </div>
        <span className="font-headline-md text-base text-aether-text-primary tracking-tight">
          Weather
        </span>
      </div>

      {/* Status Widget */}
      <StatusWidget weather={weather} />

      {/* Weather Stats */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">Feels Like</span>
            <p className="font-headline-md text-xl text-aether-text-primary mt-0.5 tabular-nums">
              {weather ? `${Math.round(weather.feelsLike)}°` : "--°"}
            </p>
          </div>
          <div>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">Humidity</span>
            <p className="font-headline-md text-xl text-aether-text-primary mt-0.5 tabular-nums flex items-center gap-1.5">
              <span className="material-symbols-outlined text-aether-gold text-base fill">water_drop</span>
              {weather ? `${weather.humidity}%` : "--%"}
            </p>
          </div>
          <div>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">Wind</span>
            <p className="font-headline-md text-xl text-aether-text-primary mt-0.5 tabular-nums">
              {weather ? `${Math.round(weather.windSpeed)}` : "--"}
              <span className="font-body-md text-xs text-aether-text-muted ml-1">km/h</span>
            </p>
          </div>
          <div>
            <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">Visibility</span>
            <p className="font-headline-md text-xl text-aether-text-primary mt-0.5 tabular-nums">
              {weather ? `${weather.visibility}` : "--"}
              <span className="font-body-md text-xs text-aether-text-muted ml-1">km</span>
            </p>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="glass-card rounded-2xl p-4">
        <DotNav
          cities={savedCities}
          activeIndex={activeCityIndex}
          onSelect={onCitySelect}
        />
        <p className="font-body-md text-sm text-aether-text-primary mt-2">
          {cityName}
        </p>
        <p className="font-caption text-[10px] text-aether-text-muted">
          Updated just now
        </p>
      </div>

      {/* Bottom nav links */}
      <div className="glass-card rounded-2xl p-3 flex flex-col gap-1 mt-auto">
        {[
          { href: "/dashboard", label: "Overview", icon: "dashboard" },
          { href: "/dashboard/today", label: "Today", icon: "today" },
          { href: "/dashboard/weekly", label: "Weekly", icon: "calendar_month" },
          { href: "/dashboard/packing", label: "Packing", icon: "checkroom" },
          { href: "/dashboard/search", label: "Explore", icon: "explore" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-aether-gold/10 transition-colors text-aether-text-muted hover:text-aether-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
          >
            <span className="material-symbols-outlined text-lg fill">{item.icon}</span>
            <span className="font-body-md text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
