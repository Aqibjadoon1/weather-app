"use client";

import { useWeather } from "@/hooks/useWeather";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
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

  const isNight = weather
    ? (() => {
        const now = new Date();
        const cur = now.getHours() * 60 + now.getMinutes();
        const [sh, sm] = weather.sunrise.split(":").map(Number);
        const [ss, ms] = weather.sunset.split(":").map(Number);
        return cur < sh * 60 + sm || cur > ss * 60 + ms;
      })()
    : false;

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
    <div className="min-h-screen bg-background text-on-surface -mx-container-padding px-container-padding">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[2rem] -mx-container-padding px-container-padding pt-6 pb-8 mb-8 bg-aether-bg">
        <WeatherShader className="absolute inset-0 w-full h-full" condition={weather?.condition} isNight={isNight} />
        <div className="relative z-10">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-headline-md text-headline-md text-aether-text-primary leading-none">
                {weather ? `${Math.round(weather.temperature)}°` : "18°"}
              </h1>
              <p className="font-headline-sm text-headline-sm text-aether-text-muted mt-1">
                {weather ? weather.condition : "Partly Cloudy"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-label-bold text-label-bold text-aether-gold uppercase tracking-wider">{cityName}</p>
              <p className="font-caption text-caption text-aether-text-muted mt-1">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </header>

          <div className="mt-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-aether-text-muted fill">wb_sunny</span>
            <span className="font-body-md text-aether-text-muted">
              Feels like {weather ? `${Math.round(weather.feelsLike)}°C` : "16°C"}
            </span>
          </div>
        </div>
      </section>

      {/* Hourly */}
      <section className="mb-8">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Today&apos;s Journey</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 -mx-2 px-2">
          {displayHourly.map((slot, i) => (
            <div key={i} className="min-w-[120px] bg-surface rounded-2xl p-4 editorial-shadow flex flex-col items-center gap-2 flex-shrink-0">
              <span className="font-label-bold text-label-bold text-on-surface-variant">{formatTime(slot.time)}</span>
              <span className="material-symbols-outlined text-3xl text-primary fill">{slot.icon}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">{slot.temperature}°</span>
              <span className="font-caption text-caption text-on-surface-variant">{slot.condition}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface rounded-3xl p-6 editorial-shadow">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Sunrise & Sunset</span>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="font-headline-md text-headline-md text-on-surface">{weather ? weather.sunrise : "06:34"}</p>
              <p className="font-caption text-caption text-on-surface-variant">Sunrise</p>
            </div>
            <div className="text-right">
              <p className="font-headline-md text-headline-md text-on-surface">{weather ? weather.sunset : "19:45"}</p>
              <p className="font-caption text-caption text-on-surface-variant">Sunset</p>
            </div>
          </div>
          <div className="mt-5 relative h-16">
            <div className="absolute inset-0 border-t border-dashed border-outline-variant rounded-full" />
            <div className="w-3 h-3 bg-tertiary rounded-full shadow-[0_0_12px_rgba(255,181,149,0.4)] absolute left-1/4 -top-1.5" />
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-6 editorial-shadow">
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

        <div className="bg-surface rounded-3xl p-6 editorial-shadow">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 mb-8">
        {[
          { label: "UV Index", value: weather ? weather.uvIndex.toString() : "2", sub: "Low" },
          { label: "Humidity", value: weather ? `${weather.humidity}%` : "45%", sub: "Comfortable" },
          { label: "Visibility", value: weather ? `${weather.visibility} km` : "10 km", sub: "Clear" },
          { label: "Pressure", value: "1013 hPa", sub: "Steady" },
        ].map((item) => (
          <div key={item.label} className="bg-surface-container-low rounded-2xl p-5">
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
            <p className="font-headline-sm text-headline-sm text-on-surface mt-2">{item.value}</p>
            <p className="font-caption text-caption text-on-surface-variant mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
