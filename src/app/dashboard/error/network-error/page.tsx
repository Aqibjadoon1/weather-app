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
    <div className="min-h-screen bg-aether-bg text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aether-bg/80 via-aether-bg/60 to-aether-bg" />
      <div className="relative z-10 text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">wifi_off</span>
        <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Connection Lost</h1>
        <p className="text-lg text-aether-text-muted mb-8">Unable to fetch weather data. Check your connection and try again.</p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 px-8 py-4 bg-aether-gold/10 backdrop-blur-xl border border-aether-gold/20 rounded-full text-aether-gold hover:bg-aether-gold/20 transition-all disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <span className="w-5 h-5 border-2 border-aether-gold/30 border-t-aether-gold rounded-full animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined fill">refresh</span>
                Retry Connection
              </>
            )}
          </button>
          <Link href="/dashboard" className="text-aether-text-muted hover:text-aether-gold transition-colors text-sm">
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
