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
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding flex flex-col">
      <header className="py-8 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">Weekly Forecast</h1>
          <p className="font-body-md text-aether-text-muted mt-1">7-day atmospheric timeline</p>
        </div>
        <Link href="/dashboard" className="text-aether-gold font-label-bold hover:underline">Back to Dashboard</Link>
      </header>

      {isLoading && displayForecast.length === 0 ? (
        <div className="flex gap-4 flex-1 min-h-0">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 glass-card rounded-3xl p-6">
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
        <div className="flex flex-col flex-1 min-h-0">
          <div className="hidden md:flex gap-4 flex-[2_2_0%] min-h-0">
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
                className="vertical-card flex-1 glass-card rounded-3xl p-6 relative overflow-hidden grain-texture transition-all duration-500 cursor-pointer group hover:flex-[2.5]"
              >
                <span className="font-label-bold text-aether-text-muted">{day.day}</span>
                {day.date && <span className="font-caption text-caption text-aether-text-muted block mt-1">{day.date}</span>}
                <div className="mt-6 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-aether-gold fill mb-2">{day.icon}</span>
                  <span className="font-headline-md text-headline-md text-aether-text-primary">{day.high}°</span>
                  <span className="font-caption text-caption text-aether-text-muted">{day.low}°</span>
                </div>
                <div className="card-details opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 mt-4 text-center">
                  <p className="font-body-md text-aether-text-muted">{day.condition}</p>
                  <div className="mt-3 h-1.5 bg-aether-gold/20 rounded-full overflow-hidden">
                    <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                  </div>
                  <p className="font-label-bold text-aether-text-muted mt-1">{day.precipitation}% precip</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden flex overflow-x-auto no-scrollbar gap-4 pb-4 flex-shrink-0">
            {(displayForecast.length ? displayForecast : []).map((day, i) => (
              <div key={day.day + i} className={`min-w-[140px] rounded-3xl p-5 glass-card flex-shrink-0 grain-texture ${i === 0 ? "bg-aether-gold/[0.08]" : ""}`}>
                <span className="font-label-bold text-aether-text-muted block text-center">{day.day}</span>
                <span className="material-symbols-outlined text-3xl text-aether-gold fill block text-center my-4">{day.icon}</span>
                <div className="text-center">
                  <span className="font-headline-md text-headline-md block">{day.high}°</span>
                  <span className="font-caption text-caption text-aether-text-muted">{day.low}°</span>
                </div>
                <div className="mt-3 h-1 bg-aether-gold/20 rounded-full overflow-hidden">
                  <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                </div>
                <p className="font-label-bold text-aether-text-muted text-center mt-1">{day.precipitation}%</p>
              </div>
            ))}
          </div>

          <section className="flex-[3_3_0%] flex flex-col min-h-0">
            <h2 className="font-headline-md text-headline-md text-aether-text-primary mb-6 flex-shrink-0">Daily Breakdown</h2>
            <div className="glass-card rounded-3xl overflow-hidden flex-1 flex flex-col">
              <div className="flex-1 overflow-auto">
                {(displayForecast.length ? displayForecast : []).map((day, i) => (
                  <div key={day.day + i} className={`flex items-center gap-4 px-6 py-4 ${i < displayForecast.length - 1 ? "border-b border-aether-gold/10" : ""} hover:bg-aether-gold/5 transition-colors`}>
                    <span className="w-20 font-label-bold text-aether-text-muted">{day.day}</span>
                    <span className="material-symbols-outlined text-aether-gold fill">{day.icon}</span>
                    <span className="flex-1 font-body-md text-aether-text-muted">{day.condition}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-headline-md text-headline-md text-aether-text-primary">{day.high}°</span>
                      <span className="font-body-md text-aether-text-muted">{day.low}°</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 bg-aether-gold/20 rounded-full overflow-hidden">
                        <div className="h-full bg-aether-gold rounded-full" style={{ width: `${day.precipitation}%` }} />
                      </div>
                      <span className="font-label-bold text-aether-text-muted w-8 text-right">{day.precipitation}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
