"use client";

import type { SavedCity } from "@/redux/types";

interface Props {
  cities: SavedCity[];
  selectedLat?: number;
  selectedLon?: number;
}

function latLonToGlobe(
  lat: number,
  lon: number,
  cx: number,
  cy: number,
  r: number
): { x: number; y: number } {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = cx + r * Math.sin(phi) * Math.cos(theta);
  const y = cy - r * Math.cos(phi);
  return { x, y };
}

const continentPaths = [
  "M55,32 Q58,28 64,26 Q70,25 74,28 Q76,32 74,36 Q70,38 66,37 Q60,36 55,32Z",
  "M52,50 Q55,45 60,44 Q65,43 68,46 Q70,50 68,54 Q64,56 60,55 Q55,53 52,50Z",
  "M50,42 Q52,38 56,37 Q60,36 62,39 Q63,43 60,46 Q56,47 52,45Z",
  "M40,28 Q42,24 46,23 Q50,22 52,25 Q53,29 50,32 Q46,33 42,31Z",
  "M45,35 Q47,32 50,31 Q53,32 54,35 Q53,38 50,39 Q47,38 45,35Z",
  "M30,38 Q32,34 36,33 Q40,34 41,37 Q40,41 36,42 Q32,41 30,38Z",
  "M46,18 Q48,15 52,14 Q56,15 58,18 Q57,22 53,23 Q49,22 46,18Z",
  "M58,14 Q62,10 68,8 Q72,9 74,12 Q72,16 68,17 Q62,18 58,14Z",
  "M60,20 Q64,17 70,16 Q76,17 78,21 Q76,26 70,27 Q64,26 60,20Z",
  "M68,30 Q72,28 78,27 Q82,29 84,33 Q82,38 78,39 Q72,38 68,30Z",
  "M76,14 Q80,12 85,13 Q88,16 86,20 Q82,22 78,20 Q76,17 76,14Z",
  "M42,48 Q44,46 48,46 Q50,48 49,50 Q47,52 44,51Z",
  "M62,42 Q66,40 72,39 Q78,40 82,43 Q84,47 82,51 Q78,53 72,52 Q66,51 62,42Z",
  "M68,54 Q72,52 78,52 Q82,54 83,58 Q81,62 76,63 Q72,62 68,54Z",
  "M74,42 Q78,40 84,40 Q88,42 88,46 Q86,50 82,50 Q78,49 74,42Z",
  "M50,56 Q54,54 60,54 Q64,56 64,60 Q62,64 58,65 Q54,64 50,56Z",
];

export default function SvgGlobe({ cities, selectedLat, selectedLon }: Props) {
  const cx = 80;
  const cy = 44;
  const r = 38;

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-center">
      <svg viewBox="0 0 160 88" className="w-full h-auto max-h-28">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(184,137,46,0.15)" strokeWidth="0.5" />
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={`grid-${i}`}
            cx={cx}
            cy={cy}
            rx={r * Math.cos(((i + 1) * Math.PI) / 10)}
            ry={r * Math.sin(((i + 1) * Math.PI) / 10)}
            fill="none"
            stroke="rgba(184,137,46,0.08)"
            strokeWidth="0.4"
          />
        ))}
        {continentPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="rgba(184,137,46,0.12)"
            stroke="rgba(184,137,46,0.2)"
            strokeWidth="0.4"
          />
        ))}
        {cities.map((city) => {
          const pos = latLonToGlobe(city.lat, city.lon, cx, cy, r);
          const isSelected =
            selectedLat !== undefined &&
            selectedLon !== undefined &&
            Math.abs(city.lat - selectedLat) < 0.5 &&
            Math.abs(city.lon - selectedLon) < 0.5;
          return (
            <g key={city.name}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 2.5 : 1.5}
                fill={isSelected ? "#B8892E" : "rgba(184,137,46,0.4)"}
                stroke="#fff"
                strokeWidth="0.5"
              />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(184,137,46,0.2)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
