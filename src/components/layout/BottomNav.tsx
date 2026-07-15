"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Home", exact: true },
  { href: "/dashboard/today", icon: "today", label: "Today" },
  { href: "/dashboard/packing", icon: "luggage", label: "Packing" },
  { href: "/dashboard/search", icon: "explore", label: "Explore" },
  { href: "/dashboard/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (item: typeof navItems[number]) =>
    item.exact
      ? pathname === item.href
      : pathname?.startsWith(item.href) ?? false;

  return (
    <nav
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 left-0 w-full z-50"
    >
      {/* Safe-area padding shell */}
      <div
        className="px-3 pb-safe-or-3 pt-2"
        style={{
          background: "rgba(15, 20, 38, 0.72)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-3 py-1.5 rounded-2xl",
                  "transition-all duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                  active
                    ? "text-aether-gold"
                    : "text-aether-text-muted hover:text-aether-text-primary",
                ].join(" ")}
              >
                {/* Indicator dot above active icon */}
                <span
                  className={[
                    "w-1 h-1 rounded-full mb-0.5 transition-all duration-300",
                    active ? "bg-aether-gold scale-100" : "scale-0 bg-transparent",
                  ].join(" ")}
                />
                <span
                  className={[
                    "material-symbols-outlined text-[22px] leading-none transition-all duration-200",
                    active ? "fill scale-110" : "scale-100",
                  ].join(" ")}
                >
                  {item.icon}
                </span>
                <span
                  className={[
                    "font-label-bold text-[10px] leading-tight tracking-wide transition-all duration-200",
                    active ? "opacity-100" : "opacity-60",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
