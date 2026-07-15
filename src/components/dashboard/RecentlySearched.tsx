"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";

export default function RecentlySearched({ loading = false }: { loading?: boolean }) {
  const recentSearches = useSelector(
    (state: RootState) => state.weather.recentSearches
  );

  if (loading && !recentSearches.length) {
    return (
      <div className="mb-5">
        <div className="section-header mb-3">
          <span className="section-title">Recently Searched</span>
          <span className="section-action">See All</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 skeleton-shimmer rounded-full flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (recentSearches.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="section-header">
        <span className="section-title">Recently Searched</span>
        <Link
          href="/dashboard/search"
          className="section-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
        >
          See All
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {recentSearches.map((city) => (
          <Link
            key={city}
            href={`/dashboard?city=${encodeURIComponent(city)}`}
            className={[
              "flex items-center gap-2 px-4 py-2 glass-card-elevated rounded-full",
              "text-sm text-aether-text-primary whitespace-nowrap flex-shrink-0",
              "hover:border-aether-gold/40 hover:text-aether-gold transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
              "card-lift",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-aether-text-muted text-[15px] fill">
              schedule
            </span>
            <span className="font-body-md text-[13px]">{city}</span>
          </Link>
        ))}

        {/* Quick search chip */}
        <Link
          href="/dashboard/search"
          className={[
            "flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-aether-gold/25",
            "text-aether-gold/60 hover:text-aether-gold hover:border-aether-gold/50",
            "transition-all duration-200 whitespace-nowrap flex-shrink-0",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[15px]">add</span>
          <span className="font-label-bold text-[11px] uppercase tracking-wider">Add City</span>
        </Link>
      </div>
    </div>
  );
}
