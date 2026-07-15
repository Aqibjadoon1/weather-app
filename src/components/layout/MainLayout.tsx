"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const hideTopBarPaths: string[] = ["/splash", "/dashboard"];

function isDashboard(path: string | null): boolean {
  return path !== null && (path === "/dashboard" || path.startsWith("/dashboard/"));
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideTopBar = hideTopBarPaths.includes(pathname || "") || isDashboard(pathname);
  const isDash = isDashboard(pathname);

  return (
    <div className={`relative z-[2] min-h-screen font-sans selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden ${isDash ? "" : "bg-aether-bg text-aether-text-primary"}`}>
      <div className="grain-overlay" />
      {!hideTopBar && <TopNavbar />}
      <main className={`w-full ${isDash ? "min-h-[100dvh] overflow-hidden relative p-0" : "px-container-padding pb-32"}`}>
        {children}
      </main>
      {!isDash && <Footer />}
      <BottomNav />
    </div>
  );
}

