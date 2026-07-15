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
    <div className="min-h-screen text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">wifi_off</span>
        <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Connection Lost</h1>
        <p className="text-lg text-aether-text-muted mb-8">Unable to fetch weather data. Check your connection and try again.</p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-aether-gold rounded-full text-sm sm:text-base text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <span className="w-5 h-5 border-2 border-aether-bg/30 border-t-aether-bg rounded-full animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined fill text-aether-bg">refresh</span>
                Retry Connection
              </>
            )}
          </button>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-aether-gold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
            <span className="material-symbols-outlined fill text-lg">arrow_back</span>
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12 bg-aether-bg-soft/80 backdrop-blur-xl border border-aether-gold/10 rounded-2xl p-5">
          <p className="text-xs text-aether-text-muted uppercase tracking-wider mb-2">Troubleshooting Tips</p>
          <ul className="text-sm text-aether-text-muted/80 space-y-2 text-left">
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
