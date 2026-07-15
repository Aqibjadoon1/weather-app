"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard/today", label: "Today" },
  { href: "/dashboard/weekly", label: "Weekly" },
  { href: "/dashboard/packing", label: "Packing" },
  { href: "/dashboard/search", label: "Explore" },
];

const blurPages = ["/dashboard"];
const themedPages = ["/dashboard/today", "/dashboard/weekly", "/dashboard/packing", "/dashboard/search"];

export default function TopNavbar() {
  const pathname = usePathname();
  const showBlur = blurPages.includes(pathname || "");
  const isThemed = themedPages.includes(pathname || "");

  return (
    <nav className={`${isThemed ? "bg-aether-bg" : "bg-transparent"} sticky top-0 z-50 ${showBlur ? "backdrop-blur-xl border-b border-aether-gold/10" : ""} ${isThemed ? "border-b border-aether-gold/10" : ""} ${!showBlur && !isThemed ? "border-b border-aether-gold/10" : ""}`}>
      <div className="w-full px-container-padding flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
        >
          <img src="/logo.svg" alt="Accurate Weather" className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-serif text-lg font-bold text-aether-gold tracking-tight">Accurate Weather</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "font-label-bold text-label-bold px-3 py-1.5 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm",
                  isActive
                    ? "text-aether-bg bg-aether-gold"
                    : "text-aether-text-muted hover:text-aether-gold hover:bg-aether-gold/10",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <Link href="/dashboard/notifications" className="spring-button p-2 rounded-xl hover:bg-aether-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm">
            <span className="material-symbols-outlined text-aether-gold">notifications</span>
          </Link>
          <Link href="/dashboard/profile" className="inline-flex items-center gap-1.5 bg-transparent sm:bg-aether-gold rounded-xl p-2 sm:px-3 sm:py-2 text-sm text-aether-gold sm:text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold">
            <span className="material-symbols-outlined text-lg fill">account_circle</span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <Link href="/dashboard/settings" className="spring-button p-2 rounded-xl hover:bg-aether-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm">
            <span className="material-symbols-outlined text-aether-gold">settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
