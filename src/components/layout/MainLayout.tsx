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

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideTopBar = hideTopBarPaths.includes(pathname || "");
  const weatherPages = ["/dashboard"];
  const isDashboard = weatherPages.some(p => pathname === p || pathname?.startsWith(p + "/"));

  return (
    <div className={`min-h-screen font-sans selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden ${isDashboard ? "" : "bg-aether-bg text-aether-text-primary"}`}>
      <div className="grain-overlay" />
      {!hideTopBar && <TopNavbar />}
      <main className={`w-full px-container-padding ${isDashboard ? "min-h-[100dvh]" : "pb-32"}`}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

