"use client";

import Link from "next/link";
import { useState } from "react";

export default function NetworkErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] font-['Hanken_Grotesk',sans-serif] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141313]/80 via-[#141313]/60 to-[#141313]" />
      <div className="relative z-10 text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-white/30 mb-4">wifi_off</span>
        <h1 className="font-['Libre_Caslon_Text',serif] text-4xl md:text-5xl font-bold text-white mb-4">Connection Lost</h1>
        <p className="text-lg text-white/60 mb-8">Unable to fetch weather data. Check your connection and try again.</p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined fill">refresh</span>
                Retry Connection
              </>
            )}
          </button>
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Troubleshooting Tips</p>
          <ul className="text-sm text-white/50 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-xs fill mt-0.5">circle</span>
              Check your internet connection
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-xs fill mt-0.5">circle</span>
              Disable VPN or proxy temporarily
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-xs fill mt-0.5">circle</span>
              Allow weather data access in settings
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
