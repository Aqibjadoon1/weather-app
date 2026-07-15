"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard/today", label: "Today" },
  { href: "/dashboard/weekly", label: "Weekly" },
  { href: "/dashboard/packing", label: "Packing" },
  { href: "/dashboard/search", label: "Explore" },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(15, 20, 38, 0.65)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <nav className="w-full px-container-padding flex items-center justify-between h-16" aria-label="Top navigation">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aether-gold to-aether-gold/60 flex items-center justify-center shadow-md shadow-aether-gold/20 transition-transform duration-300 group-hover:scale-105">
            <span className="material-symbols-outlined text-white text-[16px] fill">wb_sunny</span>
          </div>
          <span className="font-headline-md text-sm text-aether-text-primary tracking-tight hidden sm:block">
            Accurate Weather
          </span>
        </Link>

        {/* Center nav links — desktop */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "font-label-bold text-[12px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                  active
                    ? "bg-aether-gold text-aether-bg shadow-sm shadow-aether-gold/20"
                    : "text-aether-text-muted hover:text-aether-text-primary hover:bg-white/6",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className={[
              "w-9 h-9 rounded-xl glass-inset flex items-center justify-center",
              "text-aether-text-muted hover:text-aether-gold transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
              "bg-aether-gold/10 hover:bg-aether-gold text-aether-gold hover:text-aether-bg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px] fill">account_circle</span>
            <span className="hidden sm:inline font-label-bold text-[12px] uppercase tracking-wider">
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
