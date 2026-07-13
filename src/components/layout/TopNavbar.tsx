"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard/weekly", label: "Weekly" },
  { href: "/dashboard/packing", label: "Packing" },
  { href: "/dashboard/search", label: "Explore" },
];

const blurPages = ["/dashboard", "/dashboard/weekly", "/dashboard/packing", "/dashboard/search"];

export default function TopNavbar() {
  const pathname = usePathname();
  const showBlur = blurPages.includes(pathname || "");

  return (
    <nav className={`bg-transparent sticky top-0 z-50 border-b border-white/20 ${showBlur ? "backdrop-blur-xl" : ""}`}>
      <div className="w-full px-container-padding flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
        >
          <img src="/logo.svg" alt="Aether Weather" className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-serif text-lg font-bold text-aether-gold tracking-tight">Aether Weather</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "font-label-bold text-label-bold px-3 py-1.5 transition-colors rounded-lg",
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
          <Link href="/dashboard/notifications" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-aether-gold/10">
            <span className="material-symbols-outlined text-aether-gold">notifications</span>
          </Link>
          <Link href="/dashboard/profile" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-aether-gold/10">
            <span className="material-symbols-outlined text-aether-gold">account_circle</span>
          </Link>
          <Link href="/dashboard/settings" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-aether-gold/10">
            <span className="material-symbols-outlined text-aether-gold">settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
