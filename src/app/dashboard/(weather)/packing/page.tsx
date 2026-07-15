"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PackingItem {
  name: string;
  category: string;
  essential: boolean;
  packed: boolean;
}

const DEFAULT_ITEMS: PackingItem[] = [
  { name: "Lightweight Jacket", category: "Clothing", essential: true, packed: false },
  { name: "Comfortable Walking Shoes", category: "Footwear", essential: true, packed: false },
  { name: "Umbrella", category: "Accessories", essential: false, packed: false },
  { name: "Sunscreen SPF 50", category: "Essentials", essential: true, packed: false },
  { name: "Reusable Water Bottle", category: "Accessories", essential: false, packed: false },
  { name: "Travel Adapter", category: "Electronics", essential: true, packed: false },
  { name: "Power Bank", category: "Electronics", essential: false, packed: false },
  { name: "First Aid Kit", category: "Essentials", essential: true, packed: false },
];

function generatePackingList(condition: string, high: number, low: number): PackingItem[] {
  const items: PackingItem[] = [
    { name: "Comfortable Walking Shoes", category: "Footwear", essential: true, packed: false },
    { name: "Travel Adapter", category: "Electronics", essential: true, packed: false },
    { name: "Power Bank", category: "Electronics", essential: false, packed: false },
    { name: "First Aid Kit", category: "Essentials", essential: true, packed: false },
  ];
  if (low < 15) items.push({ name: "Lightweight Jacket", category: "Clothing", essential: true, packed: false });
  if (low < 5) items.push({ name: "Warm Sweater", category: "Clothing", essential: true, packed: false });
  if (high > 25) items.push({ name: "T-Shirts", category: "Clothing", essential: true, packed: false });
  if (high > 30) items.push({ name: "Shorts", category: "Clothing", essential: false, packed: false });
  if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
    items.push({ name: "Umbrella", category: "Accessories", essential: true, packed: false });
    items.push({ name: "Waterproof Jacket", category: "Clothing", essential: true, packed: false });
  }
  if (condition.toLowerCase().includes("sun") || condition.toLowerCase().includes("clear")) {
    items.push({ name: "Sunscreen SPF 50", category: "Essentials", essential: true, packed: false });
    items.push({ name: "Sunglasses", category: "Accessories", essential: false, packed: false });
  }
  items.push({ name: "Reusable Water Bottle", category: "Accessories", essential: false, packed: false });
  return items;
}

const CATEGORY_ICONS: Record<string, string> = {
  Clothing: "checkroom",
  Footwear: "steps",
  Accessories: "watch",
  Essentials: "medical_bag",
  Electronics: "devices",
};

export default function PackingPage() {
  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ITEMS;
    try {
      const saved = localStorage.getItem("packingList");
      return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
    } catch { return DEFAULT_ITEMS; }
  });

  const [destination, setDestination] = useState("Stockholm, Sweden");
  const [dateRange, setDateRange] = useState("Jun 8 - Jun 15");
  const [isGenerating, setIsGenerating] = useState(false);
  const [weatherData, setWeatherData] = useState<{ high: number; low: number; condition: string; icon: string } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("packingList", JSON.stringify(packingList));
  }, [packingList]);

  const fetchWeather = async (city: string) => {
    setWeatherLoading(true);
    try {
      const searchRes = await fetch(`/api/search?q=${encodeURIComponent(city.split(",")[0].trim())}`);
      if (!searchRes.ok) return;
      const cities = await searchRes.json();
      if (!cities.length) return;
      const { lat, lon } = cities[0];
      const forecastRes = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
      if (!forecastRes.ok) return;
      const forecast = await forecastRes.json();
      if (forecast.length) {
        setWeatherData({ high: forecast[0].high, low: forecast[0].low, condition: forecast[0].condition, icon: forecast[0].icon });
      }
    } catch { /* noop */ } finally { setWeatherLoading(false); }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await fetchWeather(destination);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (weatherData) {
      setPackingList(generatePackingList(weatherData.condition, weatherData.high, weatherData.low));
    }
  }, [weatherData]);

  const togglePacked = (index: number) => {
    setPackingList((prev) => prev.map((item, i) => i === index ? { ...item, packed: !item.packed } : item));
  };

  const categories = [...new Set(packingList.map((item) => item.category))];
  const packedCount = packingList.filter((item) => item.packed).length;
  const essentialCount = packingList.filter((item) => item.essential).length;
  const packedEssentialCount = packingList.filter((item) => item.essential && item.packed).length;
  const progressPct = packingList.length > 0 ? (packedCount / packingList.length) * 100 : 0;

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">

      {/* ── Header ───────────────────────────────────── */}
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
            Smart packing
          </p>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
            AI Packing Companion
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="self-start sm:self-auto inline-flex items-center gap-2 glass-card-elevated rounded-xl px-4 py-2.5 text-sm text-aether-text-primary font-label-bold whitespace-nowrap hover:border-aether-gold/40 hover:text-aether-gold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined fill text-[16px]">arrow_back</span>
          Dashboard
        </Link>
      </header>

      {/* ── Trip summary card ─────────────────────────── */}
      <div className="glass-card-elevated rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,137,46,0.08) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div className="relative z-10 flex flex-wrap gap-5 items-start">
          <div className="flex-1 min-w-[140px]">
            <p className="font-label-bold text-[9px] uppercase tracking-widest text-aether-text-muted mb-1">Destination</p>
            <h2 className="font-headline-md text-xl text-aether-text-primary">{destination}</h2>
            <p className="font-caption text-[11px] text-aether-text-muted mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-aether-gold fill">calendar_today</span>
              {dateRange}
            </p>
          </div>

          {/* Weather summary */}
          <div className="flex gap-3">
            <div className="glass-inset rounded-2xl p-4 min-w-[100px]">
              {weatherLoading ? (
                <div className="w-7 h-7 border-2 border-aether-gold/30 border-t-aether-gold rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-aether-gold fill text-2xl block mb-1">
                    {weatherData?.icon || "wb_sunny"}
                  </span>
                  <p className="font-headline-md text-xl text-aether-text-primary tabular-nums leading-none">
                    {weatherData ? `${weatherData.high}° / ${weatherData.low}°` : "18° / 12°"}
                  </p>
                  <p className="font-caption text-[10px] text-aether-text-muted mt-1">
                    {weatherData?.condition ?? "Avg Temp"}
                  </p>
                </>
              )}
            </div>
            <div className="glass-inset rounded-2xl p-4 min-w-[100px]">
              <span className="material-symbols-outlined text-sky-400 fill text-2xl block mb-1">rainy</span>
              <p className="font-headline-md text-xl text-aether-text-primary tabular-nums leading-none">20%</p>
              <p className="font-caption text-[10px] text-aether-text-muted mt-1">Chance of Rain</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress card ─────────────────────────────── */}
      <div className="glass-card-elevated rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-0.5">
              Packing Progress
            </p>
            <p className="font-body-md text-sm text-aether-text-primary">
              <span className="font-headline-md text-lg text-aether-gold tabular-nums">{packedCount}</span>
              <span className="text-aether-text-muted"> / {packingList.length} items packed</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-headline-md text-2xl text-aether-text-primary tabular-nums">
              {Math.round(progressPct)}
              <span className="text-base text-aether-text-muted font-body-md">%</span>
            </p>
            <p className="font-caption text-[10px] text-aether-text-muted">
              {packedEssentialCount}/{essentialCount} essentials
            </p>
          </div>
        </div>
        <div className="precip-bar h-2.5">
          <div className="precip-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* ── Generate section ──────────────────────────── */}
      <div className="glass-card-elevated rounded-3xl p-6 mb-6">
        <h2 className="font-headline-md text-lg text-aether-text-primary mb-4">Generate New List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-aether-text-muted text-[18px] pointer-events-none fill">
              location_on
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 glass-inset rounded-2xl font-body-md text-sm text-aether-text-primary placeholder-aether-text-muted outline-none focus:ring-2 focus:ring-aether-gold/40 transition-all"
              placeholder="Where are you going?"
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-aether-text-muted text-[18px] pointer-events-none fill">
              calendar_today
            </span>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 glass-inset rounded-2xl font-body-md text-sm text-aether-text-primary placeholder-aether-text-muted outline-none focus:ring-2 focus:ring-aether-gold/40 transition-all"
              placeholder="When are you going?"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || weatherLoading}
          className="spring-button w-full sm:w-auto sm:px-10 py-3.5 rounded-xl bg-aether-gold text-aether-bg font-label-bold text-[13px] uppercase tracking-wider hover:brightness-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating || weatherLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-aether-bg/30 border-t-aether-bg rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Build My Packing List
            </>
          )}
        </button>
      </div>

      {/* ── Packing list by category ──────────────────── */}
      {categories.map((category) => {
        const items = packingList.filter((item) => item.category === category);
        const catPacked = items.filter((i) => i.packed).length;
        return (
          <div key={category} className="mb-5">
            <div className="section-header mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-aether-gold text-[15px] fill">
                  {CATEGORY_ICONS[category] ?? "checklist"}
                </span>
                <span className="section-title">{category}</span>
              </div>
              <span className="font-label-bold text-[10px] text-aether-text-muted tabular-nums">
                {catPacked}/{items.length}
              </span>
            </div>

            <div className="glass-card-elevated rounded-2xl overflow-hidden">
              {items.map((item, idx) => {
                const realIndex = packingList.indexOf(item);
                const isLast = idx === items.length - 1;
                return (
                  <label
                    key={item.name}
                    className={[
                      "flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200",
                      "focus-within:bg-aether-gold/5",
                      item.packed ? "opacity-60" : "hover:bg-aether-gold/5",
                      !isLast ? "border-b border-white/5" : "",
                    ].join(" ")}
                  >
                    {/* Custom checkbox */}
                    <div
                      className={[
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                        item.packed
                          ? "bg-aether-gold border-aether-gold"
                          : "border-aether-gold/30 hover:border-aether-gold/60",
                      ].join(" ")}
                    >
                      {item.packed && (
                        <span className="material-symbols-outlined text-aether-bg text-[14px] fill">check</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={[
                        "font-body-md text-sm leading-tight",
                        item.packed ? "line-through text-aether-text-muted" : "text-aether-text-primary",
                      ].join(" ")}>
                        {item.name}
                      </p>
                      {item.essential && !item.packed && (
                        <span className="font-label-bold text-[9px] uppercase tracking-wider text-aether-gold mt-0.5 block">
                          Essential
                        </span>
                      )}
                    </div>

                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => togglePacked(realIndex)}
                      className="sr-only"
                      aria-label={`Mark ${item.name} as packed`}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Weather tips ──────────────────────────────── */}
      {weatherData && (
        <div className="glass-card-elevated rounded-3xl p-6 mt-4">
          <h2 className="font-headline-md text-lg text-aether-text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-aether-gold fill text-[20px]">tips_and_updates</span>
            Weather Tips
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 glass-inset rounded-xl">
              <span className="material-symbols-outlined text-aether-gold fill text-[18px] mt-0.5">thermostat</span>
              <p className="font-body-md text-sm text-aether-text-muted leading-relaxed">
                Light layers recommended — temperatures ranging from{" "}
                <span className="text-aether-text-primary">{weatherData.low}°C</span> to{" "}
                <span className="text-aether-text-primary">{weatherData.high}°C</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 glass-inset rounded-xl">
              <span className="material-symbols-outlined text-sky-400 fill text-[18px] mt-0.5">rainy</span>
              <p className="font-body-md text-sm text-aether-text-muted leading-relaxed">
                {weatherData.condition.toLowerCase().includes("rain") || weatherData.condition.toLowerCase().includes("drizzle")
                  ? "Rain expected — pack a waterproof jacket and umbrella"
                  : "Low rain chance, but pack a compact umbrella just in case"}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 glass-inset rounded-xl">
              <span className="material-symbols-outlined text-blue-400 fill text-[18px] mt-0.5">ac_unit</span>
              <p className="font-body-md text-sm text-aether-text-muted leading-relaxed">
                Evenings may be cool — bring a lightweight jacket
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
