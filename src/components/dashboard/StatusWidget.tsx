"use client";

import Link from "next/link";
import type { WeatherData } from "@/redux/types";
import { calculateWeatherSeverity } from "@/lib/weatherSeverity";

interface Props {
  weather: WeatherData | null;
}

export default function StatusWidget({ weather }: Props) {
  if (!weather) return null;
  const severity = weather
    ? calculateWeatherSeverity(weather.condition, weather.windSpeed)
    : { score: 15, label: "Good" as const, color: "#22c55e" };

  const severityBg = {
    Good: "bg-green-500/10 text-green-600",
    Moderate: "bg-yellow-500/10 text-yellow-600",
    Unhealthy: "bg-orange-500/10 text-orange-600",
    Dangerous: "bg-red-500/10 text-red-600",
  }[severity.label];

  const sparklinePoints = [
    "0,20", "8,15", "16,22", "24,10", "32,18",
    "40,8", "48,16", "56,5", "64,12", "72,3",
  ].join(" ");

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
          Weather Status
        </span>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-label-bold uppercase tracking-wider ${severityBg}`}>
          {severity.label}
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="font-hero-temp text-4xl leading-none text-aether-text-primary tabular-nums">
          {severity.score}
          <span className="font-body-md text-base font-normal text-aether-text-muted">%</span>
        </span>
      </div>

      <svg viewBox="0 0 80 25" className="w-full h-8 mb-3">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={severity.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={severity.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={sparklinePoints}
          fill="none"
          stroke={severity.color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`0,25 ${sparklinePoints} 72,25`}
          fill="url(#sparkFill)"
        />
      </svg>

      <Link
        href="/dashboard/today"
        className="inline-flex items-center gap-1 text-aether-gold font-label-bold text-[11px] uppercase tracking-wider hover:underline group"
      >
        See More
        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">chevron_right</span>
      </Link>
    </div>
  );
}
