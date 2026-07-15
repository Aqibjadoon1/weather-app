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
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-0">
      {/* Hero Search */}
      <section className="bg-white/10 backdrop-blur-xl rounded-b-[3rem] -mx-container-padding px-container-padding pt-8 pb-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">Explore</h1>
          <Link href="/dashboard" className="text-aether-gold font-label-bold text-label-bold hover:underline">Cancel</Link>
        </div>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-aether-text-muted pointer-events-none fill">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 glass-card rounded-3xl font-headline-sm text-headline-sm text-aether-text-primary placeholder-aether-text-muted outline-none"
            placeholder="Search cities, countries, landmarks..."
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="absolute right-5 top-1/2 -translate-y-1/2 text-aether-text-muted hover:text-aether-text-primary transition-colors">
              <span className="material-symbols-outlined fill">close</span>
            </button>
          )}
        </form>
      </section>

      {!query ? (
        <>
          {/* Popular Destinations */}
          <section className="mb-8 sm:mb-10">
            <h2 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-5">Popular Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.city}
                  onClick={() => { setQuery(dest.city); handleSearch(dest.city); }}
                  className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-3xl text-aether-gold fill mb-3">{dest.icon}</span>
                  <p className="font-headline-sm text-headline-sm text-aether-text-primary">{dest.city}</p>
                  <p className="font-caption text-caption text-aether-text-muted">{dest.country}</p>
                  <p className="font-body-md tabular-nums text-xl text-aether-text-muted mt-2">{dest.temp}°</p>
                  <p className="font-caption text-caption text-aether-text-muted mt-1">{dest.landmark}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="mb-8 sm:mb-10">
              <h2 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((city) => (
                  <button key={city} onClick={() => { setQuery(city); handleSearch(city); }} className="flex items-center gap-2 px-5 py-3 glass-card rounded-full text-aether-text-muted hover:text-aether-gold hover:border-aether-gold transition-colors">
                    <span className="material-symbols-outlined text-aether-text-muted text-lg fill">schedule</span>
                    <span className="font-body-md">{city}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Explore by Category */}
          <section className="mb-8 sm:mb-10">
            <h2 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-5">Explore by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "wb_sunny", label: "Sunny" },
                { icon: "rainy", label: "Rainy" },
                { icon: "ac_unit", label: "Cold" },
                { icon: "beach_access", label: "Beach" },
              ].map((cat) => (
                <button key={cat.label} className="cursor-pointer group glass-card rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all">
                  <span className="material-symbols-outlined text-3xl text-aether-gold/70 group-hover:text-aether-gold fill">{cat.icon}</span>
                  <span className="font-label-bold text-label-bold text-aether-text-primary group-hover:text-aether-gold transition-colors">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Saved Cities Map Preview */}
          <section>
            <h2 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-4">Your Saved Cities</h2>
            {saved.size === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-aether-text-muted fill">bookmark_border</span>
                <p className="font-body-md text-aether-text-muted mt-3">No saved cities yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[...saved].slice(0, 6).map((key) => {
                  const [city, country] = key.split(", ");
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                      <div className="w-10 h-10 bg-aether-gold/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-aether-gold fill">location_on</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-aether-text-primary">{city}</p>
                        <p className="font-caption text-caption text-aether-text-muted">{country}</p>
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
          <h2 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-4">Results for &ldquo;{query}&rdquo;</h2>
          {results.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-aether-text-muted fill">search</span>
              <p className="font-headline-sm text-headline-sm text-aether-text-primary mt-4">No results found</p>
              <p className="font-body-md text-aether-text-muted mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, i) => {
                const key = `${result.city}, ${result.country}`;
                return (
                  <div key={i} className="flex items-center gap-5 p-6 glass-card rounded-3xl hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-aether-gold/10 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-aether-gold fill text-2xl">{result.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-headline-sm text-headline-sm text-aether-text-primary">{result.city}</p>
                      <p className="font-body-sm text-aether-text-muted">{result.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body-md tabular-nums text-2xl text-aether-text-primary">{result.temperature}°</p>
                      <p className="font-caption text-caption text-aether-text-muted">{result.condition}</p>
                    </div>
                    <button onClick={() => toggleSave(key)} className="p-2 hover:bg-aether-gold/5 rounded-xl transition-colors">
                      <span className={`material-symbols-outlined fill text-2xl ${saved.has(key) ? "text-aether-gold" : "text-aether-text-muted"}`}>
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
