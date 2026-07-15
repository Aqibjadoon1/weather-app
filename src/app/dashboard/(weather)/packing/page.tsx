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

export default function PackingPage() {
  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ITEMS;
    const saved = localStorage.getItem("packingList");
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
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
        setWeatherData({
          high: forecast[0].high,
          low: forecast[0].low,
          condition: forecast[0].condition,
          icon: forecast[0].icon,
        });
      }
    } catch {
    } finally {
      setWeatherLoading(false);
    }
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
    setPackingList((prev) => prev.map((item, i) => (i === index ? { ...item, packed: !item.packed } : item)));
  };

  const categories = [...new Set(packingList.map((item) => item.category))];
  const packedCount = packingList.filter((item) => item.packed).length;
  const essentialCount = packingList.filter((item) => item.essential).length;
  const packedEssentialCount = packingList.filter((item) => item.essential && item.packed).length;

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding">
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">AI Packing Companion</h1>
          <p className="font-body-md text-aether-text-muted mt-1">Smart packing list tailored to your forecast</p>
        </div>
        <Link href="/dashboard" className="self-start sm:self-auto inline-flex items-center gap-2 bg-aether-gold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
          <span className="material-symbols-outlined fill text-lg">arrow_back</span>
          <span>Dashboard</span>
        </Link>
      </header>

      <div className="glass-card rounded-3xl p-6 mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-aether-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="font-headline-sm text-headline-sm text-aether-text-primary">{destination}</h2>
          <p className="font-body-md text-aether-text-muted mt-2">{dateRange}</p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="glass-card rounded-2xl p-4 flex-1 min-w-[120px]">
              {weatherLoading ? (
                <div className="w-8 h-8 border-2 border-aether-gold/30 border-t-aether-gold rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-aether-gold fill text-2xl">{weatherData?.icon || "wb_sunny"}</span>
                  <p className="font-headline-md text-headline-md text-aether-text-primary mt-2">
                    {weatherData ? `${weatherData.high}° / ${weatherData.low}°` : "18° / 12°"}
                  </p>
                  <p className="font-caption text-caption text-aether-text-muted">{weatherData ? weatherData.condition : "Avg Temperature"}</p>
                </>
              )}
            </div>
            <div className="glass-card rounded-2xl p-4 flex-1 min-w-[120px]">
              <span className="material-symbols-outlined text-aether-gold fill text-2xl">rainy</span>
              <p className="font-headline-md text-headline-md text-aether-text-primary mt-2">20%</p>
              <p className="font-caption text-caption text-aether-text-muted">Chance of Rain</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="font-label-bold text-label-bold text-aether-text-primary">Packing Progress</span>
          <span className="font-body-sm text-aether-text-muted">{packedCount}/{packingList.length} items</span>
        </div>
        <div className="h-2 bg-aether-gold/20 rounded-full overflow-hidden">
          <div className="h-full bg-aether-gold rounded-full transition-all duration-500" style={{ width: `${(packedCount / packingList.length) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <span className="text-aether-text-muted">✓ {packedEssentialCount}/{essentialCount} essentials packed</span>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-6 sm:mb-8">
        <h2 className="font-headline-sm text-headline-sm text-aether-text-primary mb-4">Generate New Packing List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-aether-text-muted pointer-events-none">location_on</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-card rounded-2xl font-body-md text-aether-text-primary placeholder-aether-text-muted outline-none focus:ring-2 focus:ring-aether-gold transition-all"
              placeholder="Where are you going?"
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-aether-text-muted pointer-events-none">calendar_today</span>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-card rounded-2xl font-body-md text-aether-text-primary placeholder-aether-text-muted outline-none focus:ring-2 focus:ring-aether-gold transition-all"
              placeholder="When are you going?"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || weatherLoading}
          className="w-full md:w-auto md:px-10 mx-auto py-4 rounded-xl bg-aether-gold text-aether-bg font-body font-medium hover:bg-aether-gold-soft transition-colors disabled:opacity-60"
        >
          {isGenerating || weatherLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-aether-bg/30 border-t-aether-bg rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Build my packing list
            </span>
          )}
        </button>
      </div>

      {categories.map((category) => {
        const items = packingList.filter((item) => item.category === category);
        return (
          <div key={category} className="mb-6">
            <h3 className="font-label-bold text-label-bold text-aether-text-muted uppercase tracking-wider mb-3">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => {
                const realIndex = packingList.indexOf(item);
                return (
                  <label
                    key={item.name}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 glass-card ${item.packed ? "border border-aether-gold/20" : "border border-aether-gold/10 hover:border-aether-gold/30"}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${item.packed ? "bg-aether-gold border-aether-gold text-aether-bg" : "border-aether-gold/30"}`}>
                      {item.packed && <span className="material-symbols-outlined text-sm fill">check</span>}
                    </div>
                    <div className="flex-1">
                      <span className={`font-body-md ${item.packed ? "line-through text-aether-text-muted" : "text-aether-text-primary"}`}>{item.name}</span>
                      {item.essential && <span className="ml-2 font-caption text-caption text-aether-gold">Essential</span>}
                    </div>
                    <input type="checkbox" checked={item.packed} onChange={() => togglePacked(realIndex)} className="sr-only" />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {weatherData && (
        <div className="glass-card rounded-3xl p-6 mt-6 sm:mt-8">
          <h2 className="font-headline-sm text-headline-sm text-aether-text-primary mb-4">Weather Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-aether-gold fill">wb_sunny</span>
              <p className="font-body-md text-aether-text-muted">
                Light layers recommended — temperatures ranging from {weatherData.low}°C to {weatherData.high}°C
              </p>
            </div>
            {(weatherData.condition.toLowerCase().includes("rain") || weatherData.condition.toLowerCase().includes("drizzle")) ? (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-aether-gold fill">rainy</span>
                <p className="font-body-md text-aether-text-muted">Rain expected — pack a waterproof jacket and umbrella</p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-aether-gold fill">rainy</span>
                <p className="font-body-md text-aether-text-muted">Low rain chance, but pack a compact umbrella just in case</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-aether-gold fill">ac_unit</span>
              <p className="font-body-md text-aether-text-muted">Evenings may be cool — bring a lightweight jacket</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
