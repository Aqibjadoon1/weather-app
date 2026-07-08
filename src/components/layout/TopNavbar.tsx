"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard/weekly", label: "Weekly" },
  { href: "/dashboard/packing", label: "Packing" },
  { href: "/dashboard/search", label: "Explore" },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="w-full px-container-padding flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="font-headline-md text-primary tracking-tighter whitespace-nowrap"
        >
          Aether Weather
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
                    ? "text-on-primary bg-primary"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary-fixed",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <Link href="/dashboard/notifications" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-primary-fixed">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </Link>
          <Link href="/dashboard/profile" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-primary-fixed">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </Link>
          <Link href="/dashboard/settings" className="transition-all active:scale-95 p-2 rounded-xl hover:bg-primary-fixed">
            <span className="material-symbols-outlined text-primary">settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
