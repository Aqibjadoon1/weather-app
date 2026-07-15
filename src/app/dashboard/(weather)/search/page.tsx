"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface SearchResult {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  saved: boolean;
}

const POPULAR = [
  { city: "Paris", country: "France", temp: 21, icon: "wb_sunny", landmark: "Eiffel Tower" },
  { city: "Tokyo", country: "Japan", temp: 26, icon: "partly_cloudy_day", landmark: "Mount Fuji" },
  { city: "New York", country: "USA", temp: 28, icon: "wb_sunny", landmark: "Central Park" },
  { city: "London", country: "UK", temp: 16, icon: "rainy", landmark: "Big Ben" },
  { city: "Sydney", country: "Australia", temp: 18, icon: "wb_sunny", landmark: "Opera House" },
  { city: "Reykjavik", country: "Iceland", temp: 11, icon: "cloud", landmark: "Northern Lights" },
];

const CATEGORIES = [
  { icon: "wb_sunny", label: "Sunny", color: "text-yellow-400" },
  { icon: "rainy", label: "Rainy", color: "text-sky-400" },
  { icon: "ac_unit", label: "Cold", color: "text-blue-400" },
  { icon: "beach_access", label: "Beach", color: "text-orange-400" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches] = useState(["Stockholm", "Copenhagen", "Oslo", "Helsinki"]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set(["Stockholm, Sweden"]));

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) { setResults([]); return; }
      const cities: { name: string; country: string; lat: number; lon: number }[] = await res.json();
      const enriched = await Promise.all(
        cities.slice(0, 10).map(async (c) => {
          try {
            const wRes = await fetch(`/api/weather?lat=${c.lat}&lon=${c.lon}`);
            if (!wRes.ok) throw new Error();
            const w = await wRes.json();
            return { city: c.name, country: c.country, temperature: Math.round(w.temperature), condition: w.condition, icon: w.icon, saved: saved.has(`${c.name}, ${c.country}`) } as SearchResult;
          } catch {
            return { city: c.name, country: c.country, temperature: 0, condition: "N/A", icon: "cloud", saved: saved.has(`${c.name}, ${c.country}`) };
          }
        })
      );
      setResults(enriched);
    } catch { setResults([]); } finally { setSearching(false); }
  }, [saved]);

  const handleSearch = (e: React.FormEvent | string) => {
    const q = typeof e === "string" ? e : ((e.target as HTMLFormElement).querySelector("input") as HTMLInputElement)?.value || "";
    if (!q.trim()) return;
    setQuery(q);
    doSearch(q);
    if (typeof e !== "string") e.preventDefault();
  };

  const toggleSave = (key: string) => {
    setSaved((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding pb-28 md:pb-12">

      {/* ── Search hero ───────────────────────────────── */}
      <div
        className="px-container-padding pt-8 pb-10 mb-8"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">Explore</h1>
          <Link
            href="/dashboard"
            className="font-label-bold text-[12px] uppercase tracking-wider text-aether-text-muted hover:text-aether-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-aether-text-muted pointer-events-none fill text-[20px]">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-4 glass-card-elevated rounded-2xl font-body-md text-base text-aether-text-primary placeholder-aether-text-muted outline-none focus:ring-2 focus:ring-aether-gold/40 transition-all"
            placeholder="Search cities, countries, landmarks…"
            autoFocus
            aria-label="Search cities"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-aether-text-muted fill text-[18px]">close</span>
            </button>
          )}
        </form>
      </div>

      <div className="px-container-padding">
        {!query ? (
          <>
            {/* Popular destinations */}
            <section className="mb-8">
              <div className="section-header mb-4">
                <span className="section-title">Popular Destinations</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {POPULAR.map((dest) => (
                  <button
                    key={dest.city}
                    onClick={() => { setQuery(dest.city); handleSearch(dest.city); }}
                    className="glass-card-elevated rounded-2xl p-4 text-left group card-lift transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
                  >
                    <span className="material-symbols-outlined text-3xl text-aether-gold fill mb-3 block">{dest.icon}</span>
                    <p className="font-headline-md text-sm text-aether-text-primary group-hover:text-aether-gold transition-colors leading-tight">
                      {dest.city}
                    </p>
                    <p className="font-caption text-[10px] text-aether-text-muted mt-0.5">{dest.country}</p>
                    <p className="font-headline-md text-lg text-aether-text-primary tabular-nums mt-2">{dest.temp}°</p>
                    <p className="font-caption text-[9px] text-aether-text-muted mt-0.5 leading-tight">{dest.landmark}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <section className="mb-8">
                <div className="section-header mb-3">
                  <span className="section-title">Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setQuery(city); handleSearch(city); }}
                      className="flex items-center gap-2 px-4 py-2.5 glass-card-elevated rounded-full text-aether-text-muted hover:text-aether-gold hover:border-aether-gold/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
                    >
                      <span className="material-symbols-outlined text-[15px] fill">schedule</span>
                      <span className="font-body-md text-sm">{city}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Browse by category */}
            <section className="mb-8">
              <div className="section-header mb-4">
                <span className="section-title">Browse by Category</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    className="glass-card-elevated rounded-2xl p-5 flex flex-col items-center gap-3 group card-lift transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
                  >
                    <span className={`material-symbols-outlined text-3xl ${cat.color} fill`}>{cat.icon}</span>
                    <span className="font-label-bold text-[12px] uppercase tracking-wider text-aether-text-muted group-hover:text-aether-text-primary transition-colors">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Saved cities */}
            <section className="mb-8">
              <div className="section-header mb-4">
                <span className="section-title">Your Saved Cities</span>
                <span className="font-label-bold text-[10px] text-aether-text-muted tabular-nums">
                  {saved.size} saved
                </span>
              </div>
              {saved.size === 0 ? (
                <div className="glass-card-elevated rounded-2xl p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-aether-text-muted fill block mb-3">bookmark_border</span>
                  <p className="font-body-md text-sm text-aether-text-muted">No saved cities yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[...saved].slice(0, 6).map((key) => {
                    const [city, country] = key.split(", ");
                    return (
                      <div key={key} className="glass-card-elevated rounded-2xl p-4 flex items-center gap-3 hover:border-aether-gold/25 transition-colors">
                        <div className="w-10 h-10 bg-aether-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-aether-gold fill text-[18px]">location_on</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body-md text-sm text-aether-text-primary truncate">{city}</p>
                          <p className="font-caption text-[10px] text-aether-text-muted">{country}</p>
                        </div>
                        <button
                          onClick={() => toggleSave(key)}
                          className="w-8 h-8 rounded-lg hover:bg-aether-gold/10 flex items-center justify-center transition-colors"
                          aria-label={`Remove ${city} from saved`}
                        >
                          <span className="material-symbols-outlined text-aether-gold fill text-[18px]">bookmark</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Search results */
          <section>
            <div className="section-header mb-4">
              <span className="section-title">Results for &ldquo;{query}&rdquo;</span>
              {searching && (
                <span className="w-4 h-4 border-2 border-aether-gold/30 border-t-aether-gold rounded-full animate-spin" />
              )}
            </div>

            {results.length === 0 && !searching ? (
              <div className="glass-card-elevated rounded-3xl p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-aether-text-muted fill block mb-3">search_off</span>
                <p className="font-headline-md text-lg text-aether-text-primary">No results found</p>
                <p className="font-body-md text-sm text-aether-text-muted mt-1">Try a different city name</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => {
                  const key = `${result.city}, ${result.country}`;
                  return (
                    <div
                      key={i}
                      className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4 hover:border-aether-gold/25 transition-all duration-200"
                    >
                      <div className="w-12 h-12 bg-aether-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-aether-gold fill text-xl">{result.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline-md text-base text-aether-text-primary truncate">{result.city}</p>
                        <p className="font-caption text-[11px] text-aether-text-muted">{result.country}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-headline-md text-2xl text-aether-text-primary tabular-nums">{result.temperature}°</p>
                        <p className="font-caption text-[10px] text-aether-text-muted">{result.condition}</p>
                      </div>
                      <button
                        onClick={() => toggleSave(key)}
                        className="w-9 h-9 rounded-xl hover:bg-aether-gold/10 flex items-center justify-center transition-colors flex-shrink-0"
                        aria-label={saved.has(key) ? `Remove ${result.city}` : `Save ${result.city}`}
                      >
                        <span className={`material-symbols-outlined text-[20px] ${saved.has(key) ? "text-aether-gold fill" : "text-aether-text-muted"}`}>
                          {saved.has(key) ? "bookmark" : "bookmark_border"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
