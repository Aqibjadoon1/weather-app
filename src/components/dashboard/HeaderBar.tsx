"use client";

import Link from "next/link";

interface Props {
  cityName: string;
  date: string;
}

export default function HeaderBar({ cityName, date }: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      {/* Location + date */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-aether-gold fill text-[18px]">
            location_on
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="font-headline-md text-base text-aether-text-primary leading-tight truncate tracking-tight">
            {cityName}
          </h1>
          <p className="font-caption text-[11px] text-aether-text-muted mt-0.5">
            {date}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center hover:border-aether-gold/30 hover:text-aether-gold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined text-aether-text-muted text-[18px]">
            notifications
          </span>
        </Link>
        <Link
          href="/dashboard/search"
          aria-label="Search"
          className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center hover:border-aether-gold/30 hover:text-aether-gold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined text-aether-text-muted text-[18px]">
            search
          </span>
        </Link>
        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center hover:border-aether-gold/30 hover:text-aether-gold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined text-aether-text-muted text-[18px]">
            settings
          </span>
        </Link>
      </div>
    </div>
  );
}
