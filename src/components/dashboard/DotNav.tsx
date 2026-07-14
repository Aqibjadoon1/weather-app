"use client";

import type { SavedCity } from "@/redux/types";

interface Props {
  cities: SavedCity[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function DotNav({ cities, activeIndex, onSelect }: Props) {
  if (cities.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {cities.map((city, i) => (
        <button
          key={`${city.name}-${i}`}
          onClick={() => onSelect(i)}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm transition-all duration-300 rounded-full ${
            i === activeIndex
              ? "w-5 h-2 bg-aether-gold"
              : "w-2 h-2 bg-aether-gold/30 hover:bg-aether-gold/50"
          }`}
          title={city.name}
        />
      ))}
    </div>
  );
}
