"use client";

import Link from "next/link";
import { useState } from "react";

export default function LocationDeniedPage() {
  const [cityInput, setCityInput] = useState("");

  const popularCities = ["Stockholm", "London", "New York", "Tokyo", "Paris", "Sydney"];

  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] font-['Hanken_Grotesk',sans-serif] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141313]/80 via-[#141313]/60 to-[#141313]" />
      <div className="relative z-10 text-center max-w-lg">
        <span className="material-symbols-outlined text-6xl text-white/30 mb-4">location_off</span>
        <h1 className="font-['Libre_Caslon_Text',serif] text-4xl md:text-5xl font-bold text-white mb-4">Location Access Required</h1>
        <p className="text-lg text-white/60 mb-8">We need location access for accurate forecasts. You can also search for a city manually.</p>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <p className="text-sm text-white/50 mb-3">Or search for a city manually:</p>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">search</span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-2xl text-white placeholder-white/40 outline-none border border-white/10 focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {popularCities.map((city) => (
              <button key={city} onClick={() => setCityInput(city)} className="px-4 py-2 bg-white/10 rounded-full text-xs text-white/60 hover:bg-white/20 transition-colors">
                {city}
              </button>
            ))}
          </div>
        </div>

        <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
          <span className="material-symbols-outlined fill">arrow_back</span>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
