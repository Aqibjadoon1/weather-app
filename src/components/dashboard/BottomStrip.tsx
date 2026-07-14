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
      <div className="glass-card rounded-3xl p-6">
        <div className="h-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aether-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-label-bold text-[11px] uppercase tracking-wider text-aether-text-muted">
          7-Day Forecast
        </h2>
      </div>

      {/* Day labels */}
      <div className="flex justify-between mb-1 px-1">
        {forecast.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setSelectedIndex(i)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm font-label-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
              i === selectedIndex
                ? "text-aether-gold"
                : "text-aether-text-muted hover:text-aether-text-primary"
            }`}
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

      {/* Selected day detail */}
      {forecast[selectedIndex] && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-aether-gold/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-aether-gold text-lg fill">
              {forecast[selectedIndex].icon}
            </span>
            <span className="font-body-md text-sm text-aether-text-primary">
              {forecast[selectedIndex].condition}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-bold text-xs text-aether-text-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              H: {forecast[selectedIndex].high}°
            </span>
            <span className="font-label-bold text-xs text-aether-text-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              L: {forecast[selectedIndex].low}°
            </span>
            {forecast[selectedIndex].precipitation > 0 && (
              <span className="font-label-bold text-xs text-blue-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">water_drop</span>
                {forecast[selectedIndex].precipitation}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
