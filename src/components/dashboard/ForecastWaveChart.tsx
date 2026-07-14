"use client";

import type { ForecastDay } from "@/redux/types";

interface Props {
  forecast: ForecastDay[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx = (p0.x + p1.x) / 2;
    d += ` Q${cpx},${p0.y} ${cpx},${(p0.y + p1.y) / 2} Q${cpx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export default function ForecastWaveChart({
  forecast,
  selectedIndex,
  onSelect,
}: Props) {
  if (forecast.length === 0) return null;

  const w = 600;
  const h = 120;
  const pad = 30;
  const chartW = w - pad * 2;
  const stepX = chartW / (forecast.length - 1);
  const temps = forecast.map((d) => d.high);
  const maxT = Math.max(...temps);
  const minT = Math.min(...temps);
  const range = maxT - minT || 1;

  const points = temps.map((t, i) => ({
    x: pad + i * stepX,
    y: pad + h - pad * 2 - ((t - minT) / range) * (h - pad * 2),
  }));

  const path = smoothPath(points);
  const fillPath = path ? `${path} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z` : "";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8892E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#B8892E" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {fillPath && <path d={fillPath} fill="url(#waveFill)" />}
      {path && (
        <path d={path} fill="none" stroke="#B8892E" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {points.map((p, i) => {
        const isSelected = i === selectedIndex;
        return (
          <g key={i}>
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={h - pad + 6}
              stroke={isSelected ? "#B8892E" : "rgba(184,137,46,0.15)"}
              strokeWidth={isSelected ? 1 : 0.5}
              strokeDasharray={isSelected ? "none" : "2,2"}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={isSelected ? 5 : 3}
              fill={isSelected ? "#B8892E" : "rgba(184,137,46,0.3)"}
              stroke="#fff"
              strokeWidth={isSelected ? 2 : 1}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm cursor-pointer transition-all duration-300"
              onClick={() => onSelect(i)}
            />
          </g>
        );
      })}
    </svg>
  );
}
