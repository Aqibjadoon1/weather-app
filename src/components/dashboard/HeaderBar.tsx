"use client";

import Link from "next/link";

interface Props {
  cityName: string;
  date: string;
}

export default function HeaderBar({ cityName, date }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-aether-gold fill text-lg">location_on</span>
        <div>
          <h1 className="font-headline-md text-lg text-aether-text-primary leading-tight">{cityName}</h1>
          <p className="font-caption text-xs text-aether-text-muted">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard/search"
          className="p-2 rounded-xl hover:bg-aether-gold/10 transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
        >
          <span className="material-symbols-outlined text-aether-text-muted fill">search</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="p-2 rounded-xl hover:bg-aether-gold/10 transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
        >
          <span className="material-symbols-outlined text-aether-text-muted">settings</span>
        </Link>
      </div>
    </div>
  );
}
