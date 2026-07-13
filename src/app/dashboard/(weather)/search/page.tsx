"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  saved: boolean;
}

function owmIcon(code: string): string {
  const map: Record<string, string> = {
    "01d": "wb_sunny", "01n": "clear_night",
    "02d": "partly_cloudy_day", "02n": "partly_cloudy_night",
    "03d": "cloud", "03n": "cloud",
    "04d": "cloud", "04n": "cloud",
    "09d": "rainy", "09n": "rainy",
    "10d": "rainy", "10n": "rainy",
    "11d": "thunderstorm", "11n": "thunderstorm",
    "13d": "weather_snowy", "13n": "weather_snowy",
    "50d": "foggy", "50n": "foggy",
  };
  return map[code] || "cloud";
}

export default function SearchPage() {
  const router = useRouter();
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
            return {
              city: c.name,
              country: c.country,
              temperature: Math.round(w.temperature),
              condition: w.condition,
              icon: w.icon,
              saved: saved.has(`${c.name}, ${c.country}`),
            } as SearchResult;
          } catch {
            return { city: c.name, country: c.country, temperature: 0, condition: "N/A", icon: "cloud", saved: saved.has(`${c.name}, ${c.country}`) };
          }
        })
      );
      setResults(enriched);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [saved]);

  const handleSearch = (e: React.FormEvent | string) => {
    const q = typeof e === "string" ? e : ((e.target as HTMLFormElement).querySelector("input") as HTMLInputElement)?.value || "";
    if (!q.trim()) return;
    setQuery(q);
    doSearch(q);
    if (typeof e !== "string") e.preventDefault();
  };

  const toggleSave = (key: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const popularDestinations = [
    { city: "Paris", country: "France", temp: 21, icon: "wb_sunny", landmark: "Eiffel Tower" },
    { city: "Tokyo", country: "Japan", temp: 26, icon: "partly_cloudy_day", landmark: "Mount Fuji" },
    { city: "New York", country: "USA", temp: 28, icon: "wb_sunny", landmark: "Central Park" },
    { city: "London", country: "UK", temp: 16, icon: "rainy", landmark: "Big Ben" },
    { city: "Sydney", country: "Australia", temp: 18, icon: "wb_sunny", landmark: "Opera House" },
    { city: "Reykjavik", country: "Iceland", temp: 11, icon: "cloud", landmark: "Northern Lights" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface -mx-container-padding px-container-padding">
      {/* Hero Search */}
      <section className="bg-surface-container-low rounded-b-[3rem] -mx-container-padding px-container-padding pt-8 pb-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline-md text-headline-md text-on-surface">Explore</h1>
          <Link href="/dashboard" className="text-primary font-label-bold text-label-bold hover:underline">Cancel</Link>
        </div>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline pointer-events-none fill">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 bg-surface rounded-3xl font-headline-sm text-headline-sm text-on-surface placeholder-on-surface-variant outline-none editorial-shadow"
            placeholder="Search cities, countries, landmarks..."
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined fill">close</span>
            </button>
          )}
        </form>
      </section>

      {!query ? (
        <>
          {/* Popular Destinations */}
          <section className="mb-10">
            <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-5">Popular Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.city}
                  onClick={() => { setQuery(dest.city); handleSearch(dest.city); }}
                  className="bg-aether-surface rounded-2xl p-5 border border-black/5 hover:shadow-lg transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-3xl text-aether-gold fill mb-3">{dest.icon}</span>
                  <p className="font-headline-sm text-headline-sm text-aether-ink">{dest.city}</p>
                  <p className="font-caption text-caption text-aether-ink-muted">{dest.country}</p>
                  <p className="font-data text-xl text-aether-slate tabular-nums mt-2">{dest.temp}°</p>
                  <p className="font-caption text-caption text-aether-ink-muted mt-1">{dest.landmark}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="mb-10">
              <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((city) => (
                  <button key={city} onClick={() => { setQuery(city); handleSearch(city); }} className="flex items-center gap-2 px-5 py-3 bg-aether-surface rounded-full border border-black/5 text-aether-ink-muted hover:text-aether-gold hover:border-aether-gold transition-colors">
                    <span className="material-symbols-outlined text-aether-ink-muted text-lg fill">schedule</span>
                    <span className="font-body-md">{city}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Explore by Category */}
          <section className="mb-10">
            <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-5">Explore by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "wb_sunny", label: "Sunny" },
                { icon: "rainy", label: "Rainy" },
                { icon: "ac_unit", label: "Cold" },
                { icon: "beach_access", label: "Beach" },
              ].map((cat) => (
                <button key={cat.label} className="bg-aether-surface rounded-2xl p-6 flex flex-col items-center gap-3 border border-black/5 hover:shadow-lg transition-all">
                  <span className="material-symbols-outlined text-3xl text-aether-gold fill">{cat.icon}</span>
                  <span className="font-label-bold text-label-bold text-aether-ink">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Saved Cities Map Preview */}
          <section>
            <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Your Saved Cities</h2>
            {saved.size === 0 ? (
              <div className="bg-surface-container-low rounded-3xl p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-outline fill">bookmark_border</span>
                <p className="font-body-md text-on-surface-variant mt-3">No saved cities yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[...saved].slice(0, 6).map((key) => {
                  const [city, country] = key.split(", ");
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 bg-aether-surface rounded-2xl border border-black/5">
                      <div className="w-10 h-10 bg-aether-gold/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-aether-gold fill">location_on</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-aether-ink">{city}</p>
                        <p className="font-caption text-caption text-aether-ink-muted">{country}</p>
                      </div>
                      <button onClick={() => toggleSave(key)} className="text-aether-gold">
                        <span className="material-symbols-outlined fill">bookmark</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        /* Search Results */
        <section>
          <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Results for &ldquo;{query}&rdquo;</h2>
          {results.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-outline fill">search</span>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-4">No results found</p>
              <p className="font-body-md text-on-surface-variant mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, i) => {
                const key = `${result.city}, ${result.country}`;
                return (
                  <div key={i} className="flex items-center gap-5 p-6 bg-surface rounded-3xl editorial-shadow hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary fill text-2xl">{result.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-headline-sm text-headline-sm text-on-surface">{result.city}</p>
                      <p className="font-body-sm text-on-surface-variant">{result.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-data text-2xl text-aether-ink tabular-nums">{result.temperature}°</p>
                      <p className="font-caption text-caption text-aether-ink-muted">{result.condition}</p>
                    </div>
                    <button onClick={() => toggleSave(key)} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors">
                      <span className={`material-symbols-outlined fill text-2xl ${saved.has(key) ? "text-primary" : "text-outline"}`}>
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
  );
}
