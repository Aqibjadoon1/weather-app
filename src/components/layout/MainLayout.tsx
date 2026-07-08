"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const hideTopBarPaths: string[] = [];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideTopBar = hideTopBarPaths.includes(pathname);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
      {!hideTopBar && <TopNavbar />}
      <main className="w-full px-container-padding pb-32">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
