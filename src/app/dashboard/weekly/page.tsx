"use client";

import Link from "next/link";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useEffect, useRef } from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function WeeklyPage() {
  const { forecast, isLoading, getForecast } = useForecast();
  const { location, requestLocation } = useCurrentLocation();
  const fetched = useRef(false);

  useEffect(() => { requestLocation(); }, [requestLocation]);
  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getForecast(location.lat, location.lon);
    }
  }, [location, getForecast]);

  const displayForecast = forecast || [];

  return (
    <div className="min-h-screen bg-background text-on-surface -mx-container-padding px-container-padding">
      <header className="py-8 flex justify-between items-center">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Weekly Forecast</h1>
          <p className="font-body-md text-on-surface-variant mt-1">7-day atmospheric timeline</p>
        </div>
        <Link href="/dashboard" className="text-primary font-label-bold hover:underline">Back to Dashboard</Link>
      </header>

      {isLoading && displayForecast.length === 0 ? (
        <div className="flex gap-4 h-[600px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-surface rounded-3xl p-6">
              <Skeleton variant="text" width={40} height={16} />
              <Skeleton variant="text" width={60} height={14} />
              <div className="mt-6 flex flex-col items-center gap-3">
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="text" width={50} height={28} />
                <Skeleton variant="text" width={30} height={14} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="hidden md:flex gap-4 h-[600px]">
            {(displayForecast.length ? displayForecast : Array.from({ length: 7 }).map((_, i) => ({
              day: ["SUN","MON","TUE","WED","THU","FRI","SAT"][i],
              date: "",
              high: 20 - i,
              low: 10 - i,
              condition: "Clear",
              icon: "wb_sunny",
              precipitation: 0,
            }))).map((day, i) => (
              <div
                key={day.day + i}
                className="vertical-card flex-1 bg-surface rounded-3xl p-6 editorial-shadow relative overflow-hidden grain-texture transition-all duration-500 cursor-pointer group hover:flex-[2.5]"
              >
                <span className="font-label-bold text-on-surface-variant">{day.day}</span>
                {day.date && <span className="font-caption text-caption text-on-surface-variant block mt-1">{day.date}</span>}
                <div className="mt-6 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary fill mb-2">{day.icon}</span>
                  <span className="font-headline-md text-headline-md text-on-surface">{day.high}°</span>
                  <span className="font-caption text-caption text-outline">{day.low}°</span>
                </div>
                <div className="card-details opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 mt-4 text-center">
                  <p className="font-body-md text-on-surface-variant">{day.condition}</p>
                  <div className="mt-3 h-1.5 bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                  </div>
                  <p className="font-label-bold text-aether-slate mt-1">{day.precipitation}% precip</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden flex overflow-x-auto no-scrollbar gap-4 pb-4">
            {(displayForecast.length ? displayForecast : []).map((day, i) => (
              <div key={day.day + i} className={`min-w-[140px] rounded-3xl p-5 editorial-shadow flex-shrink-0 grain-texture ${i === 0 ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface border border-outline-variant/20"}`}>
                <span className="font-label-bold text-on-surface-variant block text-center">{day.day}</span>
                <span className="material-symbols-outlined text-3xl text-primary fill block text-center my-4">{day.icon}</span>
                <div className="text-center">
                  <span className="font-headline-md text-headline-md block">{day.high}°</span>
                  <span className="font-caption text-caption text-outline">{day.low}°</span>
                </div>
                <div className="mt-3 h-1 bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                </div>
                <p className="font-label-bold text-aether-slate text-center mt-1">{day.precipitation}%</p>
              </div>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="font-headline-md text-headline-md mb-6">Daily Breakdown</h2>
            <div className="bg-surface-container-low rounded-3xl overflow-hidden editorial-shadow">
              {(displayForecast.length ? displayForecast : []).map((day, i) => (
                <div key={day.day + i} className={`flex items-center gap-4 px-6 py-4 ${i < displayForecast.length - 1 ? "border-b border-outline-variant/20" : ""} hover:bg-surface-container-high transition-colors`}>
                  <span className="w-20 font-label-bold text-on-surface-variant">{day.day}</span>
                  <span className="material-symbols-outlined text-primary fill">{day.icon}</span>
                  <span className="flex-1 font-body-md text-on-surface-variant">{day.condition}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-headline-md text-headline-md text-on-surface">{day.high}°</span>
                    <span className="font-body-md text-outline">{day.low}°</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 w-32">
                    <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                      <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                    </div>
                    <span className="font-label-bold text-aether-slate w-8 text-right">{day.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
