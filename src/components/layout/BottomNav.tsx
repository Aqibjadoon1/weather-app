"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/packing", icon: "luggage", label: "Packing" },
  { href: "/dashboard/search", icon: "explore", label: "Explore" },
  { href: "/dashboard/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50">
      <div className="flex justify-around items-center px-2 pb-2 pt-2 bg-surface-container-low/95 backdrop-blur-2xl border-t border-outline-variant/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex flex-col items-center justify-center gap-0 transition-all duration-200 min-w-0",
                isActive
                  ? "bg-primary-container text-on-primary-container rounded-xl px-3 py-1.5 scale-105"
                  : "text-on-surface-variant opacity-60 hover:opacity-100 px-2 py-1.5",
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
