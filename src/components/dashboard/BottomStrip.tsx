"use client";

import { useState } from "react";
import type { ForecastDay } from "@/redux/types";
import ForecastWaveChart from "./ForecastWaveChart";

interface Props {
  forecast: ForecastDay[];
  isLoading: boolean;
}

export default function BottomStrip({ forecast, isLoading }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading || forecast.length === 0) {
    return (
      <div className="glass-card-elevated rounded-3xl p-6">
        <div className="h-6 w-32 skeleton-shimmer rounded-lg mb-4" />
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-5 skeleton-shimmer rounded" />
          ))}
        </div>
        <div className="h-24 skeleton-shimmer rounded-xl" />
      </div>
    );
  }

  const selected = forecast[selectedIndex];

  return (
    <div className="glass-card-elevated rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
          7-Day Forecast
        </h2>
        <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-gold/60">
          Tap a day for details
        </span>
      </div>

      {/* Day selector tabs */}
      <div className="flex gap-1 mb-3 p-1 glass-inset rounded-2xl">
        {forecast.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setSelectedIndex(i)}
            aria-label={`Select ${day.day}`}
            aria-pressed={i === selectedIndex}
            className={[
              "flex-1 py-1.5 rounded-xl font-label-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
              i === selectedIndex
                ? "bg-aether-gold text-aether-bg shadow-sm shadow-aether-gold/30"
                : "text-aether-text-muted hover:text-aether-text-primary",
            ].join(" ")}
          >
            {day.day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Wave chart */}
      <ForecastWaveChart
        forecast={forecast}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      {/* Selected day detail card */}
      {selected && (
        <div className="mt-4 glass-inset rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-aether-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-aether-gold text-lg fill">
                {selected.icon}
              </span>
            </div>
            <div>
              <p className="font-body-md text-sm text-aether-text-primary leading-tight">
                {selected.condition}
              </p>
              <p className="font-caption text-[10px] text-aether-text-muted mt-0.5">
                {selected.day}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-label-bold text-[10px] uppercase tracking-wider text-aether-text-muted">High</p>
              <p className="font-headline-md text-base text-orange-400 tabular-nums leading-tight">{selected.high}°</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <p className="font-label-bold text-[10px] uppercase tracking-wider text-aether-text-muted">Low</p>
              <p className="font-headline-md text-base text-sky-400 tabular-nums leading-tight">{selected.low}°</p>
            </div>
            {selected.precipitation > 0 && (
              <>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sky-400 text-[16px]">water_drop</span>
                  <span className="font-label-bold text-sm text-sky-400 tabular-nums">
                    {selected.precipitation}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
