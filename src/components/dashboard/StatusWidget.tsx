"use client";

import Link from "next/link";
import type { WeatherData } from "@/redux/types";
import { calculateWeatherSeverity } from "@/lib/weatherSeverity";

interface Props {
  weather: WeatherData | null;
}

const severityConfig = {
  Good: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    bar: "bg-green-400",
    color: "#4ade80",
  },
  Moderate: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    bar: "bg-yellow-400",
    color: "#facc15",
  },
  Unhealthy: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    bar: "bg-orange-400",
    color: "#fb923c",
  },
  Dangerous: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    bar: "bg-red-400",
    color: "#f87171",
  },
} as const;

const sparklinePoints = [
  "0,20", "10,14", "20,18", "30,8", "40,15",
  "50,6", "60,13", "70,4", "80,10", "90,2",
].join(" ");

export default function StatusWidget({ weather }: Props) {
  if (!weather) return null;

  const severity = calculateWeatherSeverity(weather.condition, weather.windSpeed);
  const cfg = severityConfig[severity.label];

  return (
    <div className="glass-card-elevated rounded-2xl p-4">
      {/* Top row — label + badge */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted">
          Weather Status
        </p>
        <span
          className={[
            "badge-chip border",
            cfg.bg, cfg.text, cfg.border,
          ].join(" ")}
        >
          {severity.label}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-end gap-2 mb-1">
        <span className="font-headline-md text-5xl leading-none text-aether-text-primary tabular-nums">
          {severity.score}
        </span>
        <span className="font-body-md text-sm text-aether-text-muted mb-1">/ 100</span>
      </div>
      <p className="font-caption text-[10px] text-aether-text-muted mb-3">
        Outdoor conditions index
      </p>

      {/* Progress bar */}
      <div className="precip-bar mb-4">
        <div
          className={`precip-bar-fill ${cfg.bar}`}
          style={{ width: `${severity.score}%`, background: cfg.color }}
        />
      </div>

      {/* Mini sparkline */}
      <svg viewBox="0 0 96 24" className="w-full h-7 mb-3" aria-hidden="true">
        <defs>
          <linearGradient id="sparkFill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,24 ${sparklinePoints} 90,24`}
          fill="url(#sparkFill2)"
        />
        <polyline
          points={sparklinePoints}
          fill="none"
          stroke={cfg.color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* CTA */}
      <Link
        href="/dashboard/today"
        className={[
          "inline-flex items-center gap-1.5 font-label-bold text-[11px] uppercase tracking-wider",
          "text-aether-gold hover:text-aether-gold-soft transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm",
        ].join(" ")}
      >
        Full Details
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </Link>
    </div>
  );
}
