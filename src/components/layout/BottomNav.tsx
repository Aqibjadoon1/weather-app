"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/today", icon: "today", label: "Today" },
  { href: "/dashboard/packing", icon: "luggage", label: "Packing" },
  { href: "/dashboard/search", icon: "explore", label: "Explore" },
  { href: "/dashboard/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50">
      <div className="flex justify-around items-center px-2 pb-2 pt-2 rounded-t-2xl" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex flex-col items-center justify-center gap-0 transition-all duration-200 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm",
                isActive
                  ? "bg-aether-gold/10 text-aether-gold rounded-xl px-3 py-1.5 scale-105"
                  : "text-aether-text-muted opacity-60 hover:opacity-100 px-2 py-1.5",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-lg leading-none">
                {item.icon}
              </span>
              <span className="font-label-bold text-[10px] leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
