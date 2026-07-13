"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const hideTopBarPaths: string[] = ["/splash"];
const darkPaths = [
  "/dashboard/profile",
  "/dashboard/today",
  "/dashboard/empty-states",
  "/dashboard/packing",
  "/dashboard/settings",
  "/dashboard/notifications",
  "/dashboard/weekly",
  "/dashboard/search",
  "/splash"
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideTopBar = hideTopBarPaths.includes(pathname || "");
  const isDark = darkPaths.some(path => pathname === path || pathname?.startsWith(path));

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-background text-on-surface" : "bg-background text-on-surface"} font-sans selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden`}>
      <div className="grain-overlay" />
      {!hideTopBar && <TopNavbar />}
      <main className="w-full px-container-padding pb-32">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

