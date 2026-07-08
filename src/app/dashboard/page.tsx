"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import WeatherShader from "@/components/animations/WeatherShader";
import ThreeScene from "@/components/animations/ThreeScene";
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

  return (
    <>
      <section className="relative min-h-[70vh] flex flex-col justify-end py-section-margin overflow-hidden rounded-[2rem] -mt-4 -mx-container-padding mb-section-margin px-container-padding bg-primary-fixed">
        <WeatherShader className="absolute inset-0 w-full h-full" skyTop={[0, 0.48, 1]} skyBottom={[0.97, 0.98, 1]} />
        <ThreeScene className="absolute right-0 top-0 w-1/2 h-full z-10 opacity-80 pointer-events-none" variant="sun" sunPosition={[4, 3, -5]} />

        <div className="relative z-20 flex flex-col items-start p-10 md:p-16">
          <span className="font-label-bold uppercase tracking-widest text-primary mb-2">{cityName.toUpperCase()}</span>
          <h1 className="font-hero-temp text-headline-lg-mobile md:text-hero-temp text-on-surface mb-4 leading-none tracking-tight">
            {cityName}
          </h1>
          <div className="flex flex-wrap items-end gap-8 mt-6">
            <div className="flex flex-col">
              {isLoading && !weather ? (
                <Skeleton variant="text" width={200} height={110} />
              ) : (
                <>
                  <span className="font-hero-temp text-hero-temp leading-none text-primary">
                    {weather ? `${Math.round(weather.temperature)}°C` : "18°C"}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-secondary fill">cloud</span>
                    <span className="font-headline-md text-headline-md text-on-surface-variant">
                      {weather ? weather.condition : "Partly Cloudy"}
                    </span>
                  </div>
                </>
              )}
            </div>
            {weather && (
              <div className="flex flex-col border-l border-outline-variant pl-8 pb-4">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase">Feels Like</span>
                <span className="font-headline-md text-headline-md text-on-surface">{Math.round(weather.feelsLike)}°C</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-section-margin">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-low rounded-3xl p-6 editorial-shadow bouncy-hover relative overflow-hidden grain-texture">
              <span className="font-label-bold text-on-surface-variant block mb-6">HUMIDITY</span>
              <div className="flex items-center justify-between">
                <span className="font-headline-lg text-headline-lg text-secondary">{weather ? weather.humidity : 45}%</span>
                <div className="w-12 h-12 rounded-full border-4 border-secondary/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin duration-[3s]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }} />
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-6 editorial-shadow bouncy-hover relative overflow-hidden grain-texture">
              <span className="font-label-bold text-on-surface-variant block mb-6">WIND</span>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface">
                  {weather ? Math.round(weather.windSpeed) : 12} <small className="font-body-md font-normal">km/h</small>
                </span>
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined animate-pulse">navigation</span>
                  <span className="font-label-bold">{weather ? weather.windDirection : "NE"}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-highest rounded-3xl p-6 editorial-shadow bouncy-hover relative overflow-hidden grain-texture">
              <span className="font-label-bold text-on-surface-variant block mb-6">UV INDEX</span>
              <div className="flex flex-col gap-2">
                <span className="font-headline-lg text-headline-lg text-tertiary">{weather ? uvRiskLevel(weather.uvIndex) : "Low"}</span>
                <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: `${weather ? Math.min(weather.uvIndex * 10, 100) : 20}%` }} />
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-surface-bright rounded-3xl p-6 editorial-shadow bouncy-hover relative overflow-hidden border border-outline-variant/30 grain-texture">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="font-label-bold text-on-surface-variant block mb-2">VISIBILITY</span>
                  <span className="font-headline-md text-headline-md text-on-surface">{weather ? weather.visibility : 10} <span className="font-body-md">km</span></span>
                  <p className="font-caption text-caption text-on-surface-variant mt-2">Clear horizon view</p>
                </div>
                <div>
                  <span className="font-label-bold text-on-surface-variant block mb-2">AIR QUALITY</span>
                  <span className="font-headline-md text-headline-md text-on-surface">Good</span>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-caption text-caption text-primary">Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-container text-on-primary-container rounded-3xl p-6 editorial-shadow bouncy-hover relative overflow-hidden grain-texture">
              <span className="font-label-bold opacity-80 block mb-6">MOON PHASE</span>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'opsz' 48" }}>brightness_3</span>
                <span className="font-label-bold">{weather ? weather.moonPhase : "Waning Crescent"}</span>
              </div>
            </div>
          </div>

          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-md text-headline-md">7-Day Forecast</h2>
              <Link href="/dashboard/weekly" className="text-primary font-label-bold hover:underline">View Details</Link>
            </div>
            {forecastLoading && !forecast ? (
              <div className="flex gap-5 overflow-x-auto pb-8">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="min-w-[150px] rounded-2xl p-7 bg-surface flex-shrink-0 min-h-[220px]">
                    <Skeleton variant="text" width={30} height={16} />
                    <div className="my-8 flex justify-center"><Skeleton variant="circular" width={40} height={40} /></div>
                    <Skeleton variant="text" width={50} height={28} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-8 mask-fade-right -mx-2 px-2 no-scrollbar">
                {(forecast || []).map((day, i) => (
                  <div key={day.day + i} className={`min-w-[150px] rounded-2xl p-7 editorial-shadow flex flex-col items-center justify-between bouncy-hover flex-shrink-0 min-h-[220px] ${i === 3 ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface border border-outline-variant/20"}`}>
                    <span className="font-label-bold text-on-surface-variant">{day.day}</span>
                    <span className="material-symbols-outlined my-4 text-4xl fill text-primary">{day.icon}</span>
                    <div className="flex flex-col items-center">
                      <span className="font-headline-md text-headline-md">{day.high}°</span>
                      <span className="font-caption text-caption text-outline mt-1">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-high rounded-[2.5rem] p-8 editorial-shadow relative overflow-hidden grain-texture">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="font-label-bold text-on-surface-variant block">SUNRISE</span>
                <span className="font-headline-md text-headline-md text-on-surface">{weather ? weather.sunrise : "06:34"}</span>
              </div>
              <div className="text-right">
                <span className="font-label-bold text-on-surface-variant block">SUNSET</span>
                <span className="font-headline-md text-headline-md text-on-surface">{weather ? weather.sunset : "19:45"}</span>
              </div>
            </div>
            <div className="relative h-24 w-full flex items-center justify-center">
              <div className="absolute inset-0 border-t-2 border-dashed border-outline rounded-[100%] opacity-20" />
              <div className="w-4 h-4 bg-tertiary-fixed-dim rounded-full shadow-[0_0_15px_rgba(255,181,149,0.5)] absolute left-1/4 top-0 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 editorial-shadow relative overflow-hidden border-l-4 border-primary grain-texture">
            <h3 className="font-headline-md text-headline-md mb-6">What to Wear</h3>
            <div className="space-y-6">
              {[
                { name: "Light Trench Coat", desc: "Ideal for the breeze", icon: "check_circle" },
                { name: "Leather Boots", desc: "Walk-ready for city paths", icon: "check_circle" },
                { name: "Silk Scarf", desc: "Extra warmth for the evening", icon: "check_circle" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 bg-surface-container rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-primary">checkroom</span>
                  </div>
                  <div>
                    <span className="font-body-md font-medium text-on-surface block">{item.name}</span>
                    <span className="font-caption text-caption text-on-surface-variant">{item.desc}</span>
                  </div>
                  <span className="material-symbols-outlined ml-auto text-outline-variant group-hover:text-primary transition-colors">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-dim rounded-3xl p-6">
            <h3 className="font-label-bold text-on-surface-variant uppercase mb-4">Saved Cities</h3>
            <div className="space-y-3">
              {[
                { name: "London", temp: 14 },
                { name: "Paris", temp: 21 },
                { name: "New York", temp: 28 },
              ].map((city) => (
                <div key={city.name} className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer group">
                  <span className="font-body-md font-medium">{city.name}</span>
                  <span className="font-headline-md text-headline-md group-hover:text-on-primary-container">{city.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Link href="/dashboard/search" className="fixed bottom-24 md:bottom-10 right-6 w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-full shadow-2xl flex items-center justify-center z-50 spring-button">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'opsz' 40" }}>add</span>
      </Link>
    </>
  );
}
