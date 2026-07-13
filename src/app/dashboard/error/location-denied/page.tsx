"use client";

import Link from "next/link";
import { useState } from "react";

export default function LocationDeniedPage() {
  const [cityInput, setCityInput] = useState("");

  const popularCities = ["Stockholm", "London", "New York", "Tokyo", "Paris", "Sydney"];

  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aether-bg/80 via-aether-bg/60 to-aether-bg" />
      <div className="relative z-10 text-center max-w-lg">
        <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">location_off</span>
        <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Location Access Required</h1>
        <p className="text-lg text-aether-text-muted mb-8">We need location access for accurate forecasts. You can also search for a city manually.</p>

        <div className="bg-aether-bg-soft/80 backdrop-blur-xl border border-aether-gold/10 rounded-2xl p-6 mb-6">
          <p className="text-sm text-aether-text-muted mb-3">Or search for a city manually:</p>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-aether-text-muted pointer-events-none">search</span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-12 pr-4 py-4 bg-aether-bg rounded-2xl text-aether-text-primary placeholder-aether-text-muted/40 outline-none border border-aether-gold/10 focus:border-aether-gold/30 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {popularCities.map((city) => (
              <button key={city} onClick={() => setCityInput(city)} className="px-4 py-2 bg-aether-gold/10 rounded-full text-xs text-aether-gold hover:bg-aether-gold/20 transition-colors">
                {city}
              </button>
            ))}
          </div>
        </div>

        <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-aether-gold/10 backdrop-blur-xl border border-aether-gold/20 rounded-full text-aether-gold hover:bg-aether-gold/20 transition-all">
          <span className="material-symbols-outlined fill">arrow_back</span>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
