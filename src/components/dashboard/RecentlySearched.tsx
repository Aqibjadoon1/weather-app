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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-label-bold text-[11px] uppercase tracking-wider text-aether-text-muted">
            Recently Searched
          </h2>
          <Link
            href="/dashboard/search"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm font-label-bold text-[11px] uppercase tracking-wider text-aether-gold hover:underline"
          >
            See All
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-surface-container-high animate-pulse flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (recentSearches.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-label-bold text-[11px] uppercase tracking-wider text-aether-text-muted">
          Recently Searched
        </h2>
        <Link
          href="/dashboard/search"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm font-label-bold text-[11px] uppercase tracking-wider text-aether-gold hover:underline"
        >
          See All
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {recentSearches.map((city) => (
          <Link
            key={city}
            href={`/dashboard?city=${encodeURIComponent(city)}`}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm flex items-center gap-2 px-4 py-2.5 glass-card rounded-full text-sm text-aether-text-primary whitespace-nowrap hover:border-aether-gold/40 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-aether-text-muted text-base fill">schedule</span>
            {city}
          </Link>
        ))}
      </div>
    </div>
  );
}
