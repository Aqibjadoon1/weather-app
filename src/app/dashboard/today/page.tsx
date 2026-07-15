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

  const isNight = weather?.sunset ? Date.now() > parseInt(weather.sunset) * 1000 : false;

  const displayHourly = hourlyData || [
    { time: "06:00", icon: "wb_sunny", temperature: 12, condition: "Clear", precipitation: 0 },
    { time: "09:00", icon: "partly_cloudy_day", temperature: 15, condition: "Partly Cloudy", precipitation: 10 },
    { time: "12:00", icon: "wb_sunny", temperature: 18, condition: "Sunny", precipitation: 0 },
    { time: "15:00", icon: "wb_sunny", temperature: 19, condition: "Sunny", precipitation: 0 },
    { time: "18:00", icon: "wb_sunny", temperature: 17, condition: "Clear", precipitation: 0 },
    { time: "21:00", icon: "bedtime", temperature: 14, condition: "Clear", precipitation: 0 },
  ];

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding">
      {/* Page header — matches weekly/packing/search pattern */}
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">Today</h1>
          <p className="font-body-md text-aether-text-muted mt-1">Current conditions at your location</p>
        </div>
        <Link href="/dashboard" className="self-start sm:self-auto inline-flex items-center gap-2 bg-aether-gold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
          <span className="material-symbols-outlined fill text-lg">arrow_back</span>
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </Link>
      </header>

      {/* Hero weather card */}
      <section className="relative overflow-hidden rounded-3xl mb-8">
        <WeatherShader className="absolute inset-0 w-full h-full" condition={weather?.condition} isNight={isNight} />
        <div className="relative z-10 glass-card rounded-3xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-headline-sm text-headline-sm text-aether-text-muted">{cityName}</p>
              <h2 className="text-6xl md:text-7xl font-headline-md text-headline-md text-aether-text-primary leading-none mt-1">
                {weather ? `${Math.round(weather.temperature)}°` : "18°"}
              </h2>
              <p className="font-headline-sm text-headline-sm text-aether-text-muted mt-1">
                {weather ? weather.condition : "Partly Cloudy"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-caption text-caption text-aether-text-muted">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <div className="mt-4 flex items-center gap-2 justify-end">
                <span className="material-symbols-outlined text-aether-text-muted fill">wb_sunny</span>
                <span className="font-body-md text-aether-text-muted">
                  Feels like {weather ? `${Math.round(weather.feelsLike)}°C` : "16°C"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hourly */}
      <section className="mb-8">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Today&apos;s Journey</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 -mx-2 px-2">
          {displayHourly.map((slot, i) => (
            <div key={i} className="min-w-[120px] glass-card rounded-2xl p-4 flex flex-col items-center gap-2 flex-shrink-0">
              <span className="font-label-bold text-label-bold text-on-surface-variant">{formatTime(slot.time)}</span>
              <span className="material-symbols-outlined text-3xl text-primary fill">{slot.icon}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">{slot.temperature}°</span>
              <span className="font-caption text-caption text-on-surface-variant">{slot.condition}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Sunrise & Sunset</span>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="font-headline-md text-headline-md text-on-surface">{weather ? new Date(parseInt(weather.sunrise) * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : "06:34"}</p>
              <p className="font-caption text-caption text-on-surface-variant">Sunrise</p>
            </div>
            <div className="text-right">
              <p className="font-headline-md text-headline-md text-on-surface">{weather ? new Date(parseInt(weather.sunset) * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : "19:45"}</p>
              <p className="font-caption text-caption text-on-surface-variant">Sunset</p>
            </div>
          </div>
          <div className="mt-5 relative h-16">
            <div className="absolute inset-0 border-t border-dashed border-outline-variant rounded-full" />
            <div className="w-3 h-3 bg-tertiary rounded-full shadow-[0_0_12px_rgba(255,181,149,0.4)] absolute left-1/4 -top-1.5" />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Precipitation</span>
          <div className="mt-4">
            <p className="font-headline-lg text-headline-lg text-on-surface">{displayHourly[0]?.precipitation ?? 10}%</p>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              {(displayHourly[0]?.precipitation ?? 10) > 50 ? "Precipitation likely" : "No precipitation expected"}
            </p>
          </div>
          <div className="mt-5 h-1.5 bg-outline-variant rounded-full overflow-hidden">
            <div className="h-full bg-aether-gold rounded-full" style={{ width: `${displayHourly[0]?.precipitation ?? 10}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Wind</span>
          <div className="mt-4">
            <p className="font-headline-lg text-headline-lg text-on-surface">{weather ? Math.round(weather.windSpeed) : 12}</p>
            <p className="font-caption text-caption text-on-surface-variant">km/h &bull; {weather ? weather.windDirection : "NE"} direction</p>
          </div>
          <div className="mt-5 flex gap-2">
            {displayHourly.filter((_, i) => i % 2 === 0).slice(0, 3).map((slot, i) => (
              <div key={i} className="flex-1 text-center">
                <p className="font-caption text-caption text-outline">{formatTime(slot.time)}</p>
                <p className="font-body-md font-semibold text-on-surface mt-1">{slot.temperature}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8">
        {[
          { label: "UV Index", value: weather ? weather.uvIndex.toString() : "2", sub: "Low" },
          { label: "Humidity", value: weather ? `${weather.humidity}%` : "45%", sub: "Comfortable" },
          { label: "Visibility", value: weather ? `${weather.visibility} km` : "10 km", sub: "Clear" },
          { label: "Pressure", value: "1013 hPa", sub: "Steady" },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-4 sm:p-5">
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
            <p className="font-headline-sm text-headline-sm text-on-surface mt-2">{item.value}</p>
            <p className="font-caption text-caption text-on-surface-variant mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
